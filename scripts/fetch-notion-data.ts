import {
	Client,
	isFullBlock,
	isFullDatabase,
	isFullPage,
	iteratePaginatedAPI,
} from "@notionhq/client"
import type {
	BlockObjectResponse,
	PageObjectResponse,
	RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints"
import { invariant, memoize, sortBy } from "es-toolkit"
import { existsSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { argv } from "node:process"
import { inspect } from "node:util"
import * as prettier from "prettier"
import * as yaml from "yaml"

const NOTION_SECRET = process.env.NOTION_SECRET
const PAGE_ID = "1b1b0b885c0e803d8566fb10e0b5130c"
const FORMAT = argv.includes("--no-format") ? false : true
const OUTPUT_PATH = resolve("public/guide.md")

if (!NOTION_SECRET) {
	console.error("Error: NOTION_SECRET environment variable is not set")
	process.exit(1)
}

const notion = new Client({ auth: NOTION_SECRET })

async function main() {
	let content = await formatPage(await loadPage(PAGE_ID))
	if (FORMAT) {
		console.info("Formatting... (pass --no-format to skip)")
		content = await prettier.format(content, { parser: "markdown" })
	}

	const outputFolder = dirname(OUTPUT_PATH)
	if (!existsSync(outputFolder)) {
		await mkdir(outputFolder, { recursive: true })
	}
	await writeFile(OUTPUT_PATH, content)
}

const loadPage = memoize(async function loadPage(
	pageId: string,
): Promise<PageObjectResponse> {
	const page = await notion.pages.retrieve({ page_id: pageId })
	invariant(isFullPage(page), `expected full page, received: ${prettify(page)}`)
	return page
})

function getPageTitleProperty(page: PageObjectResponse) {
	for (const [key, property] of Object.entries(page.properties)) {
		if (property.type === "title") {
			return { key, property }
		}
	}
	throw new Error(`Unexpected, page has no title property: ${prettify(page)}`)
}

function splitPageTitleProperty(page: PageObjectResponse) {
	const { key, property } = getPageTitleProperty(page)
	const { [key]: _, ...rest } = page.properties

	return {
		title: formatRichText(property.title),
		properties: rest,
	}
}

async function formatPage(page: PageObjectResponse): Promise<string> {
	const { title, properties } = splitPageTitleProperty(page)
	return compactJoin("\n", [
		Object.keys(properties).length > 0 && `${yaml.stringify(properties)}---\n`,
		`# ${title}\n`,
		await formatBlockChildren(PAGE_ID, ""),
	])
}

async function formatBlockChildren(
	blockId: string,
	linePrefix: string,
): Promise<string> {
	const content = []

	console.info("Fetching block children:", blockId)
	for await (const child of iteratePaginatedAPI(notion.blocks.children.list, {
		block_id: blockId,
	})) {
		invariant(isFullBlock(child), `expected full block: ${prettify(child)}`)
		content.push(await formatBlock(child))
	}

	return content
		.map((chunk) =>
			chunk
				.split("\n")
				.map((line) => linePrefix + line)
				.join("\n"),
		)
		.join("\n\n")
}

async function formatBlock(block: BlockObjectResponse): Promise<string> {
	if (block.type === "heading_1") {
		return `# ${formatRichText(block.heading_1.rich_text)}`
	}

	if (block.type === "heading_2") {
		return `## ${formatRichText(block.heading_2.rich_text)}`
	}

	if (block.type === "heading_3") {
		return `### ${formatRichText(block.heading_3.rich_text)}`
	}

	if (block.type === "paragraph") {
		return compactJoin("\n\n", [
			formatRichText(block.paragraph.rich_text),
			block.has_children && (await formatBlockChildren(block.id, "  ")),
		])
	}

	if (block.type === "bulleted_list_item") {
		return compactJoin("\n\n", [
			`- ${formatRichText(block.bulleted_list_item.rich_text)}`,
			block.has_children && (await formatBlockChildren(block.id, "  ")),
		])
	}

	if (block.type === "numbered_list_item") {
		return compactJoin("\n\n", [
			`1. ${formatRichText(block.numbered_list_item.rich_text)}`,
			block.has_children && (await formatBlockChildren(block.id, "  ")),
		])
	}

	if (block.type === "quote") {
		return compactJoin("\n\n", [
			`> ${formatRichText(block.quote.rich_text)}`,
			block.has_children && (await formatBlockChildren(block.id, "> ")),
		])
	}

	if (block.type === "code") {
		const caption = formatRichText(block.code.caption)
		return compactJoin("\n\n", [
			compactJoin("\n", [
				`\`\`\`${block.code.language}`,
				formatRichText(block.code.rich_text),
				await formatBlockChildren(block.id, ""),
				"```",
			]),
			caption && compactJoin("\n", ["<aside>", caption, "</aside>"]),
		])
	}

	if (block.type === "callout") {
		return compactJoin("\n\n", [
			"<aside>",
			compactJoin(" ", [
				block.callout.icon?.type === "emoji" && block.callout.icon.emoji,
				formatRichText(block.callout.rich_text),
			]),
			block.has_children && (await formatBlockChildren(block.id, "")),
			"</aside>",
		])
	}

	if (block.type === "synced_block") {
		return await formatBlockChildren(block.id, "")
	}

	if (block.type === "divider") {
		return "---"
	}

	if (block.type === "child_database") {
		console.info("Querying database:", block.child_database.title)

		try {
			const database = await notion.databases.retrieve({
				database_id: block.id,
			})
			invariant(
				isFullDatabase(database),
				`expected full database: ${prettify(database)}`,
			)

			const columnNames = sortBy(Object.values(database.properties), [
				(item) => (item.type === "title" ? 0 : 1),
			]).map((item) => item.name)

			const rows = []

			for await (const item of iteratePaginatedAPI(notion.databases.query, {
				database_id: block.id,
			})) {
				if (isFullPage(item)) {
					rows.push(await flattenDatabaseRow(item))
				} else {
					console.warn(`Unsupported database item:`, item)
				}
			}

			return compactJoin("\n", [
				`| ${columnNames.join(" | ")} |`,
				`| ${columnNames.map(() => "---").join(" | ")} |`,
				...rows.map(
					(row) => `| ${columnNames.map((key) => row[key]).join(" | ")} |`,
				),
			])
		} catch (error) {
			// notion errors when trying to fetch a linked database,
			// but we also can't tell a linked database from a regular database,
			// so we'll just try/catch
			console.warn(`Failed to query database:`, error)
			return `<!-- failed to query database: ${error} -->`
		}
	}

	console.warn(`Unsupported block type ${block.type}, skipping`)
	return `<!-- unsupported block type: ${block.type} -->`
}

async function flattenDatabaseRow(
	item: PageObjectResponse,
): Promise<Record<string, string>> {
	return Object.fromEntries(
		await Array.fromAsync(
			Object.entries(item.properties),
			async ([name, property]) => [name, await flattenPageProperty(property)],
		),
	)
}

async function flattenPageProperty(
	property: PageObjectResponse["properties"][string],
): Promise<string> {
	if (property.type === "title") {
		return formatRichText(property.title)
	}

	if (property.type === "rich_text") {
		return formatRichText(property.rich_text)
	}

	if (property.type === "select") {
		return property.select?.name ?? ""
	}

	if (property.type === "multi_select") {
		return property.multi_select.map((value) => value.name).join(", ")
	}

	if (property.type === "relation") {
		const relatedPages = await Promise.all(
			property.relation.map((related) => loadPage(related.id)),
		)

		return relatedPages
			.map((page) => {
				const { title } = splitPageTitleProperty(page)
				return title
			})
			.join(", ")
	}

	console.warn(`Unsupported database property:`, property)
	return JSON.stringify(property)
}

function compactJoin(
	separator: string,
	items: ReadonlyArray<string | false | undefined | null | 0 | 0n>,
) {
	return items.filter(Boolean).join(separator)
}

function formatRichText(items: RichTextItemResponse[]) {
	return items.map(formatRichTextItem).join("")
}

function formatRichTextItem(item: RichTextItemResponse) {
	let text = item.plain_text
	if (item.annotations.code) {
		text = `\`${text}\``
	}
	if (item.annotations.bold) {
		text = `**${text}**`
	}
	if (item.annotations.italic) {
		text = `_${text}_`
	}
	if (item.annotations.strikethrough) {
		text = `~~${text}~~`
	}
	if (item.annotations.underline) {
		text = `__${text}__`
	}
	if (item.href) {
		// uses notion.so as a fallback domain if the link doesn't have a domain
		const url = new URL(item.href, "https://www.notion.so")
		text = `[${text}](${url.href})`
	}
	return text
}

function prettify(value: unknown) {
	return inspect(value, { depth: 10, colors: true })
}

if (require.main !== module) {
	console.error("This file must be run as a standalone script")
	process.exit(1)
}

await main()

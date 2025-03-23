import {
	isFullBlock,
	isFullDatabase,
	isFullPage,
	iteratePaginatedAPI,
	type Client,
} from "@notionhq/client"
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { invariant, sortBy } from "es-toolkit"
import { flattenDatabaseRow } from "./notion-database.ts"
import { formatRichText } from "./notion-rich-text.ts"
import { compactJoin, prettify } from "./utils.ts"

export async function formatBlockChildren(
	notion: Client,
	blockId: string,
	linePrefix: string,
): Promise<string> {
	const content = []

	console.info("Fetching block children:", blockId)
	for await (const child of iteratePaginatedAPI(notion.blocks.children.list, {
		block_id: blockId,
	})) {
		invariant(isFullBlock(child), `expected full block: ${prettify(child)}`)
		content.push(await formatBlock(notion, child))
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

export async function formatBlock(
	notion: Client,
	block: BlockObjectResponse,
): Promise<string> {
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
			block.has_children && (await formatBlockChildren(notion, block.id, "  ")),
		])
	}

	if (block.type === "bulleted_list_item") {
		return compactJoin("\n\n", [
			`- ${formatRichText(block.bulleted_list_item.rich_text)}`,
			block.has_children && (await formatBlockChildren(notion, block.id, "  ")),
		])
	}

	if (block.type === "numbered_list_item") {
		return compactJoin("\n\n", [
			`1. ${formatRichText(block.numbered_list_item.rich_text)}`,
			block.has_children && (await formatBlockChildren(notion, block.id, "  ")),
		])
	}

	if (block.type === "quote") {
		return compactJoin("\n\n", [
			`> ${formatRichText(block.quote.rich_text)}`,
			block.has_children && (await formatBlockChildren(notion, block.id, "> ")),
		])
	}

	if (block.type === "code") {
		const caption = formatRichText(block.code.caption)
		return compactJoin("\n\n", [
			compactJoin("\n", [
				`\`\`\`${block.code.language}`,
				formatRichText(block.code.rich_text),
				await formatBlockChildren(notion, block.id, ""),
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
			block.has_children && (await formatBlockChildren(notion, block.id, "")),
			"</aside>",
		])
	}

	if (block.type === "synced_block") {
		return await formatBlockChildren(notion, block.id, "")
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
					rows.push(await flattenDatabaseRow(notion, item))
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

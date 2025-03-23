import {
	Client,
	isFullBlock,
	isFullPage,
	iteratePaginatedAPI,
} from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { camelCase, invariant, kebabCase, mapKeys } from "es-toolkit"
import { existsSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { parseArgs } from "node:util"
import * as prettier from "prettier"
import {
	flattenPageProperties,
	formatPage,
	loadPage,
} from "./lib/notion-page.ts"
import { prettify } from "./lib/utils.ts"

const notionPageId = "1b1b0b885c0e803d8566fb10e0b5130c"
const dataFolder = resolve("public/data")
const pageContentPath = resolve(dataFolder, "guide.md")

const notionSecret = process.env.NOTION_SECRET
if (!notionSecret) {
	console.error("Error: NOTION_SECRET environment variable is not set")
	process.exit(1)
}

const options = parseArgs({
	args: process.argv.slice(2),
	options: {
		format: {
			type: "boolean",
			default: true,
		},
		content: {
			type: "string",
		},
	},
})

const shouldSavePageContent =
	options.values.content == null || options.values.content?.startsWith("page")

const shouldSaveDatabaseContent =
	options.values.content == null ||
	options.values.content?.startsWith("database") ||
	options.values.content?.startsWith("db")

const shouldFormat = options.values.format

const notion = new Client({ auth: notionSecret })

async function main() {
	const page = await loadPage(notion, notionPageId)
	if (shouldSavePageContent) await saveContent(page)
	if (shouldSaveDatabaseContent) await saveDatabases(page)
}

async function saveContent(page: PageObjectResponse) {
	let content = await formatPage(notion, page)
	if (shouldFormat) {
		console.info("Formatting... (pass --no-format to skip)")
		content = await prettier.format(content, { parser: "markdown" })
	}
	await writeFileNested(pageContentPath, content)
	return page
}

async function saveDatabases(page: PageObjectResponse) {
	const databases = new Map<string, Record<string, string>[]>()

	for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
		block_id: page.id,
	})) {
		invariant(isFullBlock(block), `expected full block: ${prettify(block)}`)

		if (block.type !== "child_database") {
			continue
		}

		const title = kebabCase(block.child_database.title)

		// technically there can be different databases with the same name,
		// but for now we don't care
		if (databases.has(title)) {
			console.info(`Already fetched ${block.child_database.title}, skipping`)
			continue
		}

		const rows: Record<string, string>[] = []
		databases.set(title, rows)

		console.info(`Fetching database ${block.child_database.title}...`)

		try {
			for await (const row of iteratePaginatedAPI(notion.databases.query, {
				database_id: block.id,
			})) {
				invariant(isFullPage(row), `expected full page: ${prettify(row)}`)
				const rowObject = await flattenPageProperties(notion, row, {
					asPlainText: true,
				})
				rows.push(mapKeys(rowObject, (_value, key) => camelCase(key)))
			}
		} catch (error) {
			console.error(`Error fetching database: ${block.id}`, error)
		}
	}

	for (const [title, rows] of databases) {
		await writeFileNested(
			resolve(dataFolder, `${title}.json`),
			JSON.stringify(rows, null, 2),
		)
	}
}

async function writeFileNested(path: string, content: string) {
	const outputFolder = dirname(path)
	if (!existsSync(outputFolder)) {
		await mkdir(outputFolder, { recursive: true })
	}
	await writeFile(path, content)
}

if (!import.meta.main) {
	console.error("This file must be run as a standalone script")
	process.exit(1)
}

await main()

import { Client } from "@notionhq/client"
import { existsSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { argv } from "node:process"
import * as prettier from "prettier"
import { formatPage, loadPage } from "./lib/notion-page.ts"

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
	let content = await formatPage(notion, await loadPage(notion, PAGE_ID))
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

if (require.main !== module) {
	console.error("This file must be run as a standalone script")
	process.exit(1)
}

await main()

import {
	Client,
	isFullBlock,
	isFullDatabase,
	isFullPageOrDatabase,
} from "@notionhq/client"
import type {
	BlockObjectResponse,
	DatabaseObjectResponse,
	PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import { invariant } from "es-toolkit"
import fs from "fs"
import path from "path"

export const notionSecret = process.env.NOTION_SECRET
export const pageId = "1b1b0b885c0e803d8566fb10e0b5130c"

// Initialize the Notion client
if (!notionSecret) {
	console.error("Error: NOTION_SECRET environment variable is not set")
	process.exit(1)
}

const notion = new Client({ auth: notionSecret })
const dataDir = path.resolve(process.cwd(), "data")

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true })
}

/** Fetch a page from Notion by ID */
async function fetchPage(id: string) {
	try {
		console.log(`Fetching page: ${id}`)
		const response = await notion.pages.retrieve({ page_id: id })
		return response
	} catch (error) {
		console.error(`Error fetching page ${id}:`, error)
		throw error
	}
}

/** Fetch page content (blocks) from Notion */
async function fetchPageContent(
	id: string,
	startCursor?: string,
	blockChildrenMap: Map<string, BlockObjectResponse[]> = new Map(),
): Promise<{
	blocks: BlockObjectResponse[]
	childrenMap: Map<string, BlockObjectResponse[]>
}> {
	try {
		console.log(
			`Fetching page content for: ${id}${startCursor ? ` (continuing from ${startCursor})` : ""}`,
		)
		const response = await notion.blocks.children.list({
			block_id: id,
			start_cursor: startCursor,
			page_size: 100,
		})

		let blocks = response.results.filter(isFullBlock)

		// Fetch child blocks for each block that has children
		for (const block of blocks) {
			if (block.has_children) {
				const { blocks: childBlocks, childrenMap: updatedMap } =
					await fetchPageContent(block.id, undefined, blockChildrenMap)
				blockChildrenMap = updatedMap
				blockChildrenMap.set(block.id, childBlocks)
			}
		}

		// If there are more results, fetch them recursively
		if (response.has_more && response.next_cursor) {
			const { blocks: moreBlocks, childrenMap: updatedMap } =
				await fetchPageContent(id, response.next_cursor, blockChildrenMap)
			blockChildrenMap = updatedMap
			blocks = [...blocks, ...moreBlocks]
		}

		return { blocks, childrenMap: blockChildrenMap }
	} catch (error) {
		console.error(`Error fetching page content for ${id}:`, error)
		throw error
	}
}

/** Fetch a database from Notion by ID */
async function fetchDatabase(id: string): Promise<DatabaseObjectResponse> {
	try {
		console.log(`Fetching database: ${id}`)
		const response = await notion.databases.retrieve({ database_id: id })
		invariant(isFullDatabase(response), "expected full database")
		return response
	} catch (error) {
		console.error(`Error fetching database ${id}:`, error)
		throw error
	}
}

/** Query all items from a database */
async function queryDatabase(
	id: string,
	startCursor?: string,
): Promise<(PageObjectResponse | DatabaseObjectResponse)[]> {
	try {
		console.log(
			`Querying database: ${id}${startCursor ? ` (continuing from ${startCursor})` : ""}`,
		)
		const response = await notion.databases.query({
			database_id: id,
			start_cursor: startCursor,
			page_size: 100,
		})

		let results = response.results

		// If there are more results, fetch them recursively
		if (response.has_more && response.next_cursor) {
			const moreResults = await queryDatabase(id, response.next_cursor)
			results = [...results, ...moreResults]
		}

		return results.filter(isFullPageOrDatabase)
	} catch (error) {
		console.error(`Error querying database ${id}:`, error)
		throw error
	}
}

/** Process blocks to find database references */
function findDatabaseIds(
	blocks: BlockObjectResponse[],
	childrenMap: Map<string, BlockObjectResponse[]>,
): string[] {
	const databaseIds: string[] = []

	for (const block of blocks) {
		// Check if block is a child_database
		if (block.type === "child_database" && block.id) {
			databaseIds.push(block.id)
		}

		// Recursively check child blocks if they exist
		if (block.has_children) {
			const childBlocks = childrenMap.get(block.id) || []
			if (childBlocks.length > 0) {
				const childDatabaseIds = findDatabaseIds(childBlocks, childrenMap)
				databaseIds.push(...childDatabaseIds)
			}
		}
	}

	return databaseIds
}

/** Clean and format database items for easier use in the app */
function processDatabaseItems(
	items: (PageObjectResponse | DatabaseObjectResponse)[],
) {
	return items.map((item) => {
		const processedItem: Record<string, unknown> = { id: item.id }

		// Process each property based on its type
		for (const key in item.properties) {
			const prop = item.properties[key]
			const type = prop.type

			if (type === "title") {
				processedItem[key] = prop.title.map((t) => t.plain_text).join("")
			} else if (type === "rich_text") {
				processedItem[key] = prop.rich_text.map((t) => t.plain_text).join("")
			} else if (type === "number") {
				processedItem[key] = prop.number
			} else if (type === "select") {
				if (prop.select && "name" in prop.select) {
					processedItem[key] = prop.select?.name || null
				}
			} else if (type === "multi_select") {
				if (Array.isArray(prop.multi_select)) {
					processedItem[key] = prop.multi_select.map((s) => s.name)
				}
			} else if (type === "checkbox") {
				processedItem[key] = prop.checkbox
			} else if (type === "date") {
				processedItem[key] = prop.date?.start || null
			} else if (type === "url") {
				processedItem[key] = prop.url
			} else {
				processedItem[key] = prop
			}
		}

		return processedItem
	})
}

/** Convert Notion blocks to Markdown */
function blocksToMarkdown(
	blocks: BlockObjectResponse[],
	childrenMap: Map<string, BlockObjectResponse[]>,
	indent: number = 0,
): string {
	const indentStr = " ".repeat(indent)
	let markdown = ""

	for (const block of blocks) {
		if (block.type === "paragraph") {
			const text = block.paragraph.rich_text.map((t) => t.plain_text).join("")
			markdown += `${indentStr}${text}\n\n`
		} else if (block.type === "heading_1") {
			const text = block.heading_1.rich_text.map((t) => t.plain_text).join("")
			markdown += `${indentStr}# ${text}\n\n`
		} else if (block.type === "heading_2") {
			const text = block.heading_2.rich_text.map((t) => t.plain_text).join("")
			markdown += `${indentStr}## ${text}\n\n`
		} else if (block.type === "heading_3") {
			const text = block.heading_3.rich_text.map((t) => t.plain_text).join("")
			markdown += `${indentStr}### ${text}\n\n`
		} else if (block.type === "bulleted_list_item") {
			const text = block.bulleted_list_item.rich_text
				.map((t) => t.plain_text)
				.join("")
			markdown += `${indentStr}- ${text}\n`
		} else if (block.type === "numbered_list_item") {
			const text = block.numbered_list_item.rich_text
				.map((t) => t.plain_text)
				.join("")
			markdown += `${indentStr}1. ${text}\n`
		} else if (block.type === "code") {
			const text = block.code.rich_text.map((t) => t.plain_text).join("")
			const language = block.code.language || ""
			markdown += `${indentStr}\`\`\`${language}\n${text}\n\`\`\`\n\n`
		} else if (block.type === "quote") {
			const text = block.quote.rich_text.map((t) => t.plain_text).join("")
			markdown += `${indentStr}> ${text}\n\n`
		} else if (block.type === "divider") {
			markdown += `${indentStr}---\n\n`
		} else if (block.type === "to_do") {
			const text = block.to_do.rich_text.map((t) => t.plain_text).join("")
			const checked = block.to_do.checked ? "x" : " "
			markdown += `${indentStr}- [${checked}] ${text}\n`
		} else if (block.type === "callout") {
			const text = block.callout.rich_text.map((t) => t.plain_text).join("")
			const emoji =
				block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "💡"

			markdown += `${indentStr}> **${emoji} NOTE**\n>\n`
			markdown += `${indentStr}> ${text}\n\n`

			// Add callout children if any
			if (block.has_children) {
				const childBlocks = childrenMap.get(block.id) || []
				if (childBlocks.length > 0) {
					// Convert child content and add to callout with > prefix on each line
					const childContent = blocksToMarkdown(
						childBlocks,
						childrenMap,
						indent,
					)
						.split("\n")
						.map((line) => (line ? `> ${line}` : ">"))
						.join("\n")
					markdown += `${childContent}\n\n`
				}
			}
		} else if (block.type === "toggle") {
			const text = block.toggle.rich_text.map((t) => t.plain_text).join("")
			markdown += `${indentStr}<details>\n${indentStr}<summary>${text}</summary>\n\n`

			// Add nested content if available
			if (block.has_children) {
				const childBlocks = childrenMap.get(block.id) || []
				if (childBlocks.length > 0) {
					markdown += blocksToMarkdown(childBlocks, childrenMap, indent + 2)
				}
			}

			markdown += `${indentStr}</details>\n\n`
		} else if (block.type === "synced_block") {
			// For synced blocks, just render their content directly
			if (block.has_children) {
				const childBlocks = childrenMap.get(block.id) || []
				if (childBlocks.length > 0) {
					markdown += blocksToMarkdown(childBlocks, childrenMap, indent)
				}
			}
		} else if (block.type === "child_database") {
			markdown += `${indentStr}*Database: ${block.id}*\n\n`
		} else if (block.type === "child_page") {
			markdown += `${indentStr}*Page: ${block.id}*\n\n`
		} else if (block.type === "table") {
			markdown += `${indentStr}<table>\n`
			// Table content will be in children
			if (block.has_children) {
				const childBlocks = childrenMap.get(block.id) || []
				if (childBlocks.length > 0) {
					markdown += blocksToMarkdown(childBlocks, childrenMap, indent + 2)
				}
			}
			markdown += `${indentStr}</table>\n\n`
		} else if (block.type === "table_row") {
			markdown += `${indentStr}<tr>\n`
			for (const cell of block.table_row.cells) {
				const cellText = cell.map((t) => t.plain_text).join("")
				markdown += `${indentStr}  <td>${cellText}</td>\n`
			}
			markdown += `${indentStr}</tr>\n`
		} else if (block.type === "column_list") {
			markdown += `${indentStr}<div class="column-list">\n`
			if (block.has_children) {
				const childBlocks = childrenMap.get(block.id) || []
				if (childBlocks.length > 0) {
					markdown += blocksToMarkdown(childBlocks, childrenMap, indent + 2)
				}
			}
			markdown += `${indentStr}</div>\n\n`
		} else if (block.type === "column") {
			markdown += `${indentStr}<div class="column">\n`
			if (block.has_children) {
				const childBlocks = childrenMap.get(block.id) || []
				if (childBlocks.length > 0) {
					markdown += blocksToMarkdown(childBlocks, childrenMap, indent + 2)
				}
			}
			markdown += `${indentStr}</div>\n`
		} else {
			// For unsupported block types, add a placeholder with the type
			markdown += `${indentStr}*${block.type}*\n\n`
		}
	}

	return markdown
}

/** Save data to a JSON file */
function saveToJson(filename: string, data: unknown): void {
	const filePath = path.join(dataDir, `${filename}.json`)
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
	console.log(`Saved data to ${filePath}`)
}

/** Save content to a Markdown file */
function saveToMarkdown(filename: string, content: string): void {
	const filePath = path.join(dataDir, `${filename}.md`)
	fs.writeFileSync(filePath, content)
	console.log(`Saved data to ${filePath}`)
}

/** Save data to a CSV file */
function saveToCsv(filename: string, items: Record<string, unknown>[]): void {
	if (items.length === 0) {
		console.log(`No items to save to CSV for ${filename}`)
		return
	}

	// Get all unique headers from all items
	const headers = Array.from(
		new Set(items.flatMap((item) => Object.keys(item))),
	)

	// Create CSV content
	let csvContent = headers.join(",") + "\n"

	// Add rows
	for (const item of items) {
		const row = headers.map((header) => {
			const value = item[header]

			// Handle different value types
			if (value === undefined || value === null) {
				return ""
			} else if (typeof value === "string") {
				// Escape quotes and wrap in quotes if needed
				const escaped = value.replace(/"/g, '""')
				return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped
			} else if (Array.isArray(value)) {
				// Join arrays with semicolons and wrap in quotes
				const joined = value.join(";")
				return `"${joined}"`
			} else {
				return String(value)
			}
		})

		csvContent += row.join(",") + "\n"
	}

	const filePath = path.join(dataDir, `${filename}.csv`)
	fs.writeFileSync(filePath, csvContent)
	console.log(`Saved data to ${filePath}`)
}

/** Main function to run the script */
async function main() {
	try {
		// Fetch the guide page
		const guidePage = await fetchPage(pageId)
		saveToJson("guide-page", guidePage)

		// Fetch the page content
		const { blocks: pageBlocks, childrenMap: blockChildrenMap } =
			await fetchPageContent(pageId)
		saveToJson("guide-content", pageBlocks)

		// Convert blocks to markdown and save
		let pageTitle = "Aspects of Nature Guidebook"

		// Access title if it exists on the page object
		if (
			isFullPageOrDatabase(guidePage) &&
			"properties" in guidePage &&
			guidePage.properties.title?.type === "title"
		) {
			const titleText = guidePage.properties.title.title?.[0]?.plain_text
			if (titleText) pageTitle = titleText
		}

		// Generate markdown content with original title
		const pageMarkdown = `# ${pageTitle}\n\n${blocksToMarkdown(pageBlocks, blockChildrenMap)}`

		// Sanitize title for filename - replace colons and other invalid characters
		const sanitizedTitle = pageTitle
			.replace(/:/g, "-")
			.replace(/[<>:"/\\|?*]/g, "-") // Replace Windows invalid filename chars
			.replace(/\s+/g, " ")
			.trim()

		saveToMarkdown(`${sanitizedTitle} ${pageId}`, pageMarkdown)

		// Find all database IDs in the page content
		const databaseIds = findDatabaseIds(pageBlocks, blockChildrenMap)
		console.log(`Found ${databaseIds.length} databases in the guide page`)

		// Fetch each database and its items
		for (const dbId of databaseIds) {
			// Fetch database structure
			const database = await fetchDatabase(dbId)
			const databaseName =
				database.title.map((item) => item.plain_text).join("") ||
				`database-${dbId}`

			// Sanitize name for filename (json files use lowercase kebab-case)
			const sanitizedName = databaseName
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "")

			// Save database structure
			saveToJson(`${sanitizedName}-structure`, database)

			// Query all items in the database
			const items = await queryDatabase(dbId)

			// Process and save items
			const processedItems = processDatabaseItems(items)
			saveToJson(sanitizedName, processedItems)

			// Sanitize database name for CSV (preserve original case but replace invalid chars)
			const sanitizedCsvName = databaseName
				.replace(/:/g, "-")
				.replace(/[<>:"/\\|?*]/g, "-") // Replace Windows invalid filename chars
				.replace(/\s+/g, " ")
				.trim()

			// Save items as CSV
			saveToCsv(`${sanitizedCsvName} ${dbId}`, processedItems)
		}

		console.log("Data fetching completed successfully!")
	} catch (error) {
		console.error("Error in main process:", error)
		process.exit(1)
	}
}

// Run the script if executed directly
if (require.main === module) {
	main()
}

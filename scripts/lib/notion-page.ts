import { isFullPage, type Client } from "@notionhq/client"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { invariant } from "es-toolkit"
import * as yaml from "yaml"
import { formatBlockChildren } from "./notion-block.ts"
import {
	formatRichText,
	type FormatRichTextItemOptions,
} from "./notion-rich-text.ts"
import { compactJoin, prettify } from "./utils.ts"

const pageCache = new Map<string, PageObjectResponse>()

export async function loadPage(
	notion: Client,
	pageId: string,
): Promise<PageObjectResponse> {
	const existing = pageCache.get(pageId)
	if (existing) return existing

	const page = await notion.pages.retrieve({ page_id: pageId })
	invariant(isFullPage(page), `expected full page, received: ${prettify(page)}`)
	pageCache.set(pageId, page)
	return page
}

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

export async function formatPage(
	notion: Client,
	page: PageObjectResponse,
): Promise<string> {
	const { title, properties } = splitPageTitleProperty(page)
	return compactJoin("\n", [
		Object.keys(properties).length > 0 && `${yaml.stringify(properties)}---\n`,
		`# ${title}\n`,
		await formatBlockChildren(notion, page.id, ""),
	])
}

export async function flattenPageProperty(
	notion: Client,
	property: PageObjectResponse["properties"][string],
	options?: FormatRichTextItemOptions,
): Promise<string> {
	if (property.type === "title") {
		return formatRichText(property.title, options)
	}

	if (property.type === "rich_text") {
		return formatRichText(property.rich_text, options)
	}

	if (property.type === "select") {
		return property.select?.name ?? ""
	}

	if (property.type === "multi_select") {
		return property.multi_select.map((value) => value.name).join(", ")
	}

	if (property.type === "relation") {
		return await getRelationTitle(notion, property)
	}

	console.warn(`Unsupported database property:`, property)
	return JSON.stringify(property)
}

async function getRelationTitle(
	notion: Client,
	property: { relation: Array<{ id: string }> },
) {
	const relatedPages = await Promise.all(
		property.relation.map((related) => loadPage(notion, related.id)),
	)

	return relatedPages
		.map((page) => {
			const { title } = splitPageTitleProperty(page)
			return title
		})
		.join(", ")
}

export async function flattenPageProperties(
	notion: Client,
	item: PageObjectResponse,
	options?: FormatRichTextItemOptions,
): Promise<Record<string, string>> {
	return Object.fromEntries(
		await Array.fromAsync(
			Object.entries(item.properties),
			async ([name, property]) => [
				name,

				await flattenPageProperty(notion, property, options),
			],
		),
	)
}

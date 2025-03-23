import type { Client } from "@notionhq/client"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { flattenPageProperty } from "./notion-page.ts"

export async function flattenDatabaseRow(
	notion: Client,
	item: PageObjectResponse,
): Promise<Record<string, string>> {
	return Object.fromEntries(
		await Array.fromAsync(
			Object.entries(item.properties),
			async ([name, property]) => [
				name,
				await flattenPageProperty(notion, property),
			],
		),
	)
}

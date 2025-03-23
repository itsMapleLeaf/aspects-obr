import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"

export function formatRichText(
	items: RichTextItemResponse[],
	options?: FormatRichTextItemOptions,
) {
	return items.map((item) => formatRichTextItem(item, options)).join("")
}

export type FormatRichTextItemOptions = {
	asPlainText?: boolean
}

export function formatRichTextItem(
	item: RichTextItemResponse,
	options?: FormatRichTextItemOptions,
) {
	let text = item.plain_text

	if (options?.asPlainText) {
		return text
	}

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

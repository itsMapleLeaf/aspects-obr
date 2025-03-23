import { inspect } from "node:util"

export function compactJoin(
	separator: string,
	items: ReadonlyArray<string | false | undefined | null | 0 | 0n>,
) {
	return items.filter(Boolean).join(separator)
}

export function prettify(value: unknown) {
	return inspect(value, { depth: 10, colors: true })
}

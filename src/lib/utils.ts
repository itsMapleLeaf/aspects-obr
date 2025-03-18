import type { Falsy } from "./types.ts"

export function withoutIndex<T>(array: T[], index: number) {
	const result = [...array]
	result.splice(index, 1)
	return result
}

/**
 * Toggles an item in an array - removes it if present, adds it if not
 *
 * @param array The original array
 * @param item The item to toggle
 * @returns A new array with the item toggled
 */
export function toggleInArray<T>(array: T[], item: T): T[] {
	const set = new Set(array || [])
	if (set.has(item)) {
		set.delete(item)
	} else {
		set.add(item)
	}
	return [...set]
}

/**
 * Filters out falsy values from an array and joins the truthy ones with a
 * separator
 *
 * @param separator String to join the values with (defaults to a space)
 * @param values Array of values (can contain falsy values)
 * @returns A string of joined truthy values
 */
export function compactJoin(
	separator: string,
	values: (string | Falsy)[],
): string {
	return values.filter(Boolean).join(separator)
}

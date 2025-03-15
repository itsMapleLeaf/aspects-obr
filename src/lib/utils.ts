export function withoutIndex<T>(array: T[], index: number) {
	const result = [...array]
	result.splice(index, 1)
	return result
}

/**
 * Toggles an item in an array - removes it if present, adds it if not
 *
 * @param array The original array (or undefined)
 * @param item The item to toggle
 * @returns A new array with the item toggled
 */
export function toggleInArray<T>(array: T[] | undefined, item: T): T[] {
	const set = new Set(array || [])
	if (set.has(item)) {
		set.delete(item)
	} else {
		set.add(item)
	}
	return [...set]
}

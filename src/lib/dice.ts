/**
 * Calculates the number of successes for a dice roll value. 9-11 count as 1
 * success, 12 counts as 2 successes.
 */
export function calculateSuccesses(value: number): number {
	if (value >= 9 && value <= 11) return 1
	if (value === 12) return 2
	return 0
}

/** Counts the total successes from an array of dice roll values. */
export function countTotalSuccesses(results: number[]): number {
	return results.reduce((sum, value) => sum + calculateSuccesses(value), 0)
}

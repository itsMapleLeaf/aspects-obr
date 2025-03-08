export function withoutIndex<T>(array: T[], index: number) {
	const result = [...array]
	result.splice(index, 1)
	return result
}

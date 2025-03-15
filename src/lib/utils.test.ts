import { describe, expect, it } from "vitest"
import { toggleInArray, withoutIndex } from "./utils"

describe("toggleInArray", () => {
	it("adds an item that is not in the array", () => {
		const arr = ["a", "b", "c"]
		const result = toggleInArray(arr, "d")
		expect(result).toEqual(["a", "b", "c", "d"])
		// Original array is unchanged
		expect(arr).toEqual(["a", "b", "c"])
	})

	it("removes an item that is already in the array", () => {
		const arr = ["a", "b", "c"]
		const result = toggleInArray(arr, "b")
		expect(result).toEqual(["a", "c"])
		// Original array is unchanged
		expect(arr).toEqual(["a", "b", "c"])
	})

	it("handles undefined arrays", () => {
		const result = toggleInArray(undefined, "a")
		expect(result).toEqual(["a"])
	})

	it("handles empty arrays", () => {
		const result = toggleInArray([], "a")
		expect(result).toEqual(["a"])
	})

	it("preserves uniqueness", () => {
		const arr = ["a", "b", "b", "c"]
		const result = toggleInArray(arr, "d")
		expect(result).toEqual(["a", "b", "c", "d"])
	})
})

describe("withoutIndex", () => {
	it("removes an item at a specific index", () => {
		const arr = ["a", "b", "c", "d"]
		const result = withoutIndex(arr, 1)
		expect(result).toEqual(["a", "c", "d"])
		// Original array is unchanged
		expect(arr).toEqual(["a", "b", "c", "d"])
	})

	it("returns a copy of the array when index is out of bounds", () => {
		const arr = ["a", "b", "c"]
		const result = withoutIndex(arr, 5)
		expect(result).toEqual(["a", "b", "c"])
		expect(result).not.toBe(arr) // Should be a new array
	})
})

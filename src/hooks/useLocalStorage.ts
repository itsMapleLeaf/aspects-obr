import { useEffect, useState } from "react"
import { useValueRef } from "./common.ts"

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue }

export function useLocalStorage<T>(
	key: string,
	defaultValue: T,
	load: (input: JsonValue) => T,
) {
	const [value, setValue] = useState<T>(defaultValue)
	const [loaded, setLoaded] = useState(false)
	const loadRef = useValueRef(load)

	if (!loaded) {
		try {
			const saved = window.localStorage.getItem(key)
			if (saved) {
				setValue(loadRef.current(JSON.parse(saved) as JsonValue))
			}
			setLoaded(true)
		} catch (error) {
			console.warn("failed to parse", error)
		}
	}

	useEffect(() => {
		if (!loaded) return
		window.localStorage.setItem(key, JSON.stringify(value))
	}, [key, value, loaded])

	return [value, setValue] as const
}

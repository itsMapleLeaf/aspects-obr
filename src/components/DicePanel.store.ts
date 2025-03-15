import { useState } from "react"

export type DicePanelStore = ReturnType<typeof useDicePanelStore>
export function useDicePanelStore() {
	const [count, setCount] = useState(1)
	const [label, setLabel] = useState("")
	const [fatigue, setFatigue] = useState(0)
	const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
		null,
	)

	function reset() {
		setCount(1)
		setLabel("")
		setFatigue(0)
	}

	return {
		count,
		setCount,
		label,
		setLabel,
		fatigue,
		setFatigue,
		selectedCharacterId,
		setSelectedCharacterId,
		reset,
	}
}

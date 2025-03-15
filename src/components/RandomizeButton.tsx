import { useState } from "react"
import { Icon } from "./ui/Icon.tsx"
import { SolidButton } from "./ui/SolidButton.tsx"

export function RandomizeButton({ onRandomize }: { onRandomize: () => void }) {
	const [showConfirm, setShowConfirm] = useState(false)

	const handleRandomize = () => {
		onRandomize()
		setShowConfirm(false)
	}

	return !showConfirm ? (
		<SolidButton onClick={() => setShowConfirm(true)} className="mt-2">
			<Icon icon="mingcute:refresh-2-fill" className="size-4" /> Randomize
		</SolidButton>
	) : (
		<div className="mt-2 flex gap-2">
			<SolidButton onClick={() => setShowConfirm(false)} className="flex-1">
				<Icon icon="mingcute:close-line" className="size-4" />
				Cancel
			</SolidButton>
			<SolidButton
				onClick={handleRandomize}
				className="flex-1 border-red-900 bg-red-900/25 text-red-300 hover:border-red-800 hover:bg-red-900/40 hover:text-red-200"
			>
				<Icon icon="mingcute:check-fill" className="size-4" />
				Confirm Randomize
			</SolidButton>
		</div>
	)
}

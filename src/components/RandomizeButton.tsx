import { Icon } from "./ui/Icon.tsx"
import { SolidButton } from "./ui/SolidButton.tsx"

export function RandomizeButton({ onRandomize }: { onRandomize: () => void }) {
	const handleClick = () => {
		if (
			confirm(
				"Are you sure you want to randomize this character? This will replace current character values.",
			)
		) {
			onRandomize()
		}
	}

	return (
		<SolidButton onClick={handleClick} className="mt-2">
			<Icon icon="mingcute:refresh-2-fill" className="size-4" /> Randomize
		</SolidButton>
	)
}

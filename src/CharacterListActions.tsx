import { Icon } from "~/components/ui/Icon.tsx"
import { SquareIconButton } from "~/components/ui/SquareIconButton.tsx"
import { Character } from "./character.ts"

interface CharacterListActionsProps {
	character: Character
	onEdit: (id: string) => void
	onClone: (character: Character) => void
	onDelete: (id: string) => void
}

export function CharacterListActions({
	character,
	onEdit,
	onClone,
	onDelete,
}: CharacterListActionsProps) {
	function exportCharacter() {
		const characterData = JSON.stringify(character, null, 2)
		const blob = new Blob([characterData], { type: "application/json" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `${character.name.replace(/\s+/g, "_")}.json`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	return (
		<div className="flex gap-1">
			<SquareIconButton
				icon={<Icon icon="mingcute:delete-2-fill" className="size-5" />}
				onClick={() => onDelete(character.id)}
				className="text-red-400 hover:text-red-300"
			>
				Delete
			</SquareIconButton>
			<SquareIconButton
				icon={<Icon icon="mingcute:copy-2-fill" className="size-5" />}
				onClick={() => onClone(character)}
			>
				Clone
			</SquareIconButton>
			<SquareIconButton
				icon={<Icon icon="mingcute:download-2-fill" className="size-5" />}
				onClick={exportCharacter}
			>
				Export
			</SquareIconButton>
			<SquareIconButton
				icon={<Icon icon="mingcute:edit-2-fill" className="size-5" />}
				onClick={() => onEdit(character.id)}
			>
				Edit
			</SquareIconButton>
		</div>
	)
}

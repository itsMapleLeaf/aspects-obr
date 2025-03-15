import { Character, getComputedCharacter } from "../character.ts"
import { InputField } from "./ui/InputField.tsx"

interface CharacterResourceFieldsProps {
	character: Character
	onUpdate: (patch: Partial<Character>) => void
}

export function CharacterResourceFields({
	character,
	onUpdate,
}: CharacterResourceFieldsProps) {
	const stats = getComputedCharacter(character)
	const { maxHits, maxFatigue } = stats

	return (
		<div className="flex gap-3">
			<InputField
				label={`Hits / ${maxHits}`}
				type="number"
				className="min-w-0 flex-1"
				min={0}
				value={character.hits}
				onSubmitValue={(event) =>
					onUpdate({
						hits: Number(event) || 0,
					})
				}
			/>
			<InputField
				label={`Fatigue / ${maxFatigue}`}
				type="number"
				className="min-w-0 flex-1"
				min={0}
				value={character.fatigue}
				onSubmitValue={(event) =>
					onUpdate({
						fatigue: Number(event) || 0,
					})
				}
			/>
		</div>
	)
}

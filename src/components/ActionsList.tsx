import { groupBy } from "es-toolkit"
import { twMerge } from "tailwind-merge"
import { Tooltip } from "~/components/ui/Tooltip"
import type { Character } from "../character.ts"
import { getComputedCharacter } from "../character.ts"
import { actions, aspectSkills, aspects, attributes } from "../data.ts"
import { SmallSolidButton } from "./ui/SmallSolidButton"

interface ActionsListProps {
	character: Character
	className?: string
	onRollAction: (
		label: string,
		diceCount: number,
		fatigue: number,
		characterId: string,
	) => void
}

export function ActionsList({
	character,
	className,
	onRollAction,
}: ActionsListProps) {
	const actionsByAttribute = groupBy(
		Object.values(actions),
		(action) => action.attribute.name,
	)

	const aspectSkillsByAspect = groupBy(
		Object.values(aspectSkills),
		(skill) => skill.aspect.name,
	)

	const characterStats = getComputedCharacter(character)

	function handleActionClick(actionName: string, attributeName: string) {
		const attributeKey =
			attributeName.toLowerCase() as keyof typeof characterStats
		const diceCount = characterStats[attributeKey] || 1

		if (onRollAction) {
			onRollAction(
				`${actionName} (${attributeName})`,
				diceCount,
				0,
				character.id,
			)
		}
	}

	function handleAspectSkillClick(skillName: string, aspectName: string) {
		const aspectKey = aspectName.toLowerCase() as keyof typeof characterStats
		const diceCount = characterStats[aspectKey] || 1

		if (onRollAction) {
			onRollAction(`${skillName} (${aspectName})`, diceCount, 1, character.id)
		}
	}

	return (
		<div className={twMerge("flex flex-col gap-4", className)}>
			<div className="flex flex-wrap gap-x-6 gap-y-2">
				{Object.values(attributes).map((attribute) => {
					const attributeKey =
						attribute.name.toLowerCase() as keyof typeof characterStats
					const attributeValue = characterStats[attributeKey] || 0

					return (
						<section key={attribute.name}>
							<h3 className="mb-0.5 text-sm font-semibold">
								{attribute.name} ({attributeValue})
							</h3>
							<ul className="flex flex-wrap gap-2">
								{actionsByAttribute[attribute.name]?.map((action) => (
									<Tooltip
										key={action.name}
										content={`${action.description} (${attributeValue} dice)`}
									>
										<SmallSolidButton
											onClick={() =>
												handleActionClick(action.name, attribute.name)
											}
										>
											{action.name}
										</SmallSolidButton>
									</Tooltip>
								))}
							</ul>
						</section>
					)
				})}
			</div>

			<div className="flex flex-wrap gap-x-6 gap-y-2">
				{Object.values(aspects).map((aspect) => {
					const aspectKey =
						aspect.name.toLowerCase() as keyof typeof characterStats
					const aspectValue = characterStats[aspectKey] || 0
					const disabled = aspectValue === 0

					return (
						<section key={aspect.name} className={disabled ? "opacity-50" : ""}>
							<h3 className="mb-0.5 text-sm font-semibold">
								{aspect.name} ({aspectValue})
							</h3>
							<ul className="flex flex-wrap gap-2">
								{aspectSkillsByAspect[aspect.name]
									?.filter((skill) =>
										skill.drives.some(
											(drive) =>
												drive.name.toLowerCase() ===
												character.drive?.toLowerCase(),
										),
									)
									?.map((skill) => (
										<Tooltip
											key={skill.name}
											content={`${skill.effect} (${aspectValue} dice)`}
										>
											<SmallSolidButton
												onClick={() => {
													if (disabled) return
													handleAspectSkillClick(skill.name, aspect.name)
												}}
											>
												{skill.name}
											</SmallSolidButton>
										</Tooltip>
									))}
							</ul>
						</section>
					)
				})}
			</div>
		</div>
	)
}

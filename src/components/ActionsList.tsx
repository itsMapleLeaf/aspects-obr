import { groupBy } from "es-toolkit"
import { twMerge } from "tailwind-merge"
import { Tooltip } from "~/components/ui/Tooltip"
import type { Character } from "../character.ts"
import { getComputedCharacter } from "../character.ts"
import {
	actions,
	aspects,
	aspectSkills,
	attributes,
	lineages,
} from "../data.ts"
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

	const skillsByAspect = groupBy(
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
		const aspectKey = aspectName.toLowerCase()
		let attributeValue = 1 // Default to 1 die if we can't determine the linked attribute

		// Find the linked attribute for this aspect based on lineage
		const characterLineages = character.lineages ?? []
		for (const lineageName of characterLineages) {
			const matchingLineage = lineages.find((l) => l.name === lineageName)
			if (
				matchingLineage?.aspects.some((a) => a.name.toLowerCase() === aspectKey)
			) {
				// This lineage has this aspect, use the appropriate attribute
				// For now, we're using a fixed attribute value since we don't have aspect-attribute linking
				attributeValue = 2
				break
			}
		}

		// Most aspect skills use fatigue, but some might not
		const skill = aspectSkills.find((s) => s.name === skillName)
		const fatigueCost = skill ? 1 : 0 // Default fatigue cost of 1 for aspect skills

		onRollAction?.(
			`${skillName} (${aspectName})`,
			attributeValue,
			fatigueCost,
			character.id,
		)
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

			<div className="mt-4">
				<h2 className="mb-2 text-center text-lg font-semibold">
					Aspect Skills
				</h2>
				<div className="flex flex-wrap gap-x-6 gap-y-4">
					{Object.values(aspects).map((aspect) => {
						return (
							<section key={aspect.name}>
								<h3 className="mb-0.5 text-sm font-semibold">{aspect.name}</h3>
								<ul className="flex flex-wrap gap-2">
									{skillsByAspect[aspect.name]?.map((skill) => {
										const isSelected =
											character.selectedAspectSkills?.includes(skill.name) ??
											false
										return (
											<Tooltip
												key={skill.name}
												content={`${skill.description} - ${skill.effect}${isSelected ? " (Selected)" : ""}`}
											>
												<SmallSolidButton
													onClick={() =>
														handleAspectSkillClick(skill.name, aspect.name)
													}
													className={
														isSelected
															? "bg-primary-600 hover:bg-primary-700"
															: ""
													}
												>
													{skill.name}
												</SmallSolidButton>
											</Tooltip>
										)
									})}
								</ul>
							</section>
						)
					})}
				</div>
			</div>
		</div>
	)
}

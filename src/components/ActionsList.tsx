import { groupBy } from "es-toolkit"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Tooltip } from "~/components/ui/Tooltip"
import type { Character } from "../character.ts"
import { actions, aspects, aspectSkills, attributes } from "../data.ts"
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
	const [showAllAspectActions, setShowAllAspectActions] = useState(false)

	const actionsByAttribute = groupBy(
		Object.values(actions),
		(action) => action.attribute.name,
	)

	const actionsByAspect = groupBy(
		Object.values(aspectSkills),
		(skill) => skill.aspect.name,
	)

	// Use character attribute scores directly - no need for computed stats
	const attributeScores = character.attributeScores || {}

	// Helper function to check if an action has mechanical effects
	function hasNoMechanicalEffect(action: (typeof aspectSkills)[0]): boolean {
		// An action has no mechanical effect if the effect field is empty
		return !action.effect
	}

	function handleActionClick(actionName: string, attributeName: string) {
		const attributeKey = attributeName.toLowerCase()
		const diceCount = attributeScores[attributeKey] || 1

		onRollAction?.(
			`${actionName} (${attributeName})`,
			diceCount,
			0, // Core actions don't use fatigue
			character.id,
		)
	}

	function handleAspectSkillClick(skillName: string, aspectName: string) {
		const aspectKey = aspectName.toLowerCase()
		// Use the aspect score directly for dice count
		const diceCount = attributeScores[aspectKey] || 0

		// Check if this is a fatigue action
		const skill = aspectSkills.find((s) => s.name === skillName)
		// For now, all aspect actions use fatigue except for narrative-only actions
		// This should be updated when fatigue actions are properly tagged in the data
		const hasNarrationOnlyEffect = skill && hasNoMechanicalEffect(skill)
		const fatigueCost = hasNarrationOnlyEffect ? 0 : 1

		onRollAction?.(
			`${skillName} (${aspectName})`,
			diceCount,
			fatigueCost,
			character.id,
		)
	}

	return (
		<div className={twMerge("flex flex-col gap-4", className)}>
			{/* Core attribute actions */}
			<div className="flex flex-wrap gap-x-6 gap-y-2">
				{Object.values(attributes).map((attribute) => {
					const attributeKey = attribute.name.toLowerCase()
					const attributeValue = attributeScores[attributeKey] || 0

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

			{/* Aspect actions */}
			<div className="flex flex-wrap gap-x-6 gap-y-2">
				{Object.values(aspects).map((aspect) => {
					const aspectKey = aspect.name.toLowerCase()
					const aspectValue = attributeScores[aspectKey] || 0

					// Skip rendering if no points in this aspect
					if (aspectValue === 0) return null

					// Filter aspect actions
					const aspectActions = actionsByAspect[aspect.name]?.filter(
						(action) => {
							const isNarrationOnly = hasNoMechanicalEffect(action)
							const isSelected = character.selectedAspectSkills?.includes(
								action.name,
							)

							// Show if any of these conditions are true:
							// 1. The "Show all" checkbox is checked
							// 2. This is a narrative-only action (like Illuminate)
							// 3. The action is selected by the character
							return showAllAspectActions || isNarrationOnly || isSelected
						},
					)

					// Skip rendering sections with no actions
					if (!aspectActions?.length) return null

					return (
						<section key={aspect.name}>
							<h3 className="mb-0.5 text-sm font-semibold">
								{aspect.name} ({aspectValue})
							</h3>
							<ul className="flex flex-wrap gap-2">
								{aspectActions.map((action) => {
									const isSelected =
										character.selectedAspectSkills?.includes(action.name) ??
										false
									const isNarrationOnly = hasNoMechanicalEffect(action)

									return (
										<Tooltip
											key={action.name}
											content={`${action.effect ? action.effect : action.description}${action.effect && action.description ? ` - ${action.description}` : ""}${isNarrationOnly ? "" : " (Uses 1 fatigue)"}${isSelected ? " (Selected)" : ""}`}
										>
											<SmallSolidButton
												onClick={() =>
													handleAspectSkillClick(action.name, aspect.name)
												}
												className={
													!isSelected && !isNarrationOnly ? "opacity-50" : ""
												}
											>
												{action.name}
											</SmallSolidButton>
										</Tooltip>
									)
								})}
							</ul>
						</section>
					)
				})}
			</div>

			{/* Show all aspect actions checkbox - KEEP THIS AT THE BOTTOM */}
			<div className="flex items-center">
				<input
					type="checkbox"
					id="showAllAspectActions"
					checked={showAllAspectActions}
					onChange={() => setShowAllAspectActions(!showAllAspectActions)}
					className="mr-2 h-4 w-4 rounded border-gray-800"
				/>
				<label htmlFor="showAllAspectActions" className="text-sm font-medium">
					Show all aspect actions
				</label>
			</div>
		</div>
	)
}

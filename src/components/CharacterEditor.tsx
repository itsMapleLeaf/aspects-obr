import OBR from "@owlbear-rodeo/sdk"
import { isEqual } from "es-toolkit"
import { subtract } from "es-toolkit/compat"
import { Character } from "../character.ts"
import {
	aspects,
	aspectSkills,
	attributes,
	lineages,
	personas,
} from "../data.ts"
import { usePartyPlayers, usePlayer } from "../hooks/obr.ts"
import { toggleInArray } from "../lib/utils.ts"
import { ActionsList } from "./ActionsList.tsx"
import { CharacterResourceFields } from "./CharacterResourceFields.tsx"
import { Icon } from "./ui/Icon.tsx"
import { InputField } from "./ui/InputField.tsx"
import { OptionCard } from "./ui/OptionCard.tsx"
import { SmallSolidButton } from "./ui/SmallSolidButton.tsx"
import { SubmitTextArea } from "./ui/SubmitTextArea.tsx"
import { ToggleSection } from "./ui/ToggleSection.tsx"
import { Tooltip } from "./ui/Tooltip.tsx"

function getCharacterLineages(character: Character) {
	return lineages.filter((l) => character.lineages?.includes(l.name))
}

function getCharacterPersonas(character: Character) {
	return personas.filter((p) => character.personas?.includes(p.name))
}

// Validation functions for attribute distributions
function isValidAttributeDistribution(
	values: number[],
	requiredDistribution: number[],
) {
	return isEqual(values.sort(subtract), requiredDistribution.sort(subtract))
}

export function CharacterEditor({
	character,
	onUpdate,
	onRollAction,
}: {
	character: Character
	onUpdate: (patch: Partial<Character>) => void
	onRollAction: (
		label: string,
		diceCount: number,
		fatigue: number,
		characterId: string,
	) => void
}) {
	const characterLineages = getCharacterLineages(character)
	const characterPersonas = getCharacterPersonas(character)
	const attributeScores = character.attributeScores || {}

	// Required distributions
	const coreAttributeDistribution = [1, 2, 2, 3, 5]
	const aspectAttributeDistribution = [0, 0, 1, 2, 4]

	// Unique options for dropdowns
	const coreAttributeOptions = Array.from(
		new Set(coreAttributeDistribution),
	).sort(subtract)
	const aspectAttributeOptions = Array.from(
		new Set(aspectAttributeDistribution),
	).sort(subtract)

	// Get current values
	const coreAttributeValues = Object.keys(attributes).map(
		(key) => attributeScores[key] ?? 1,
	)
	const aspectAttributeValues = Object.keys(aspects).map(
		(key) => attributeScores[key] ?? 0,
	)

	// Validate distributions
	const isCoreAttributesValid = isValidAttributeDistribution(
		coreAttributeValues,
		coreAttributeDistribution,
	)
	const isAspectAttributesValid = isValidAttributeDistribution(
		aspectAttributeValues,
		aspectAttributeDistribution,
	)

	const updateAttributeScore = (attribute: string, value: number) => {
		const updatedScores = { ...attributeScores }
		if (value !== 0) {
			updatedScores[attribute] = value
		} else {
			delete updatedScores[attribute]
		}
		onUpdate({ attributeScores: updatedScores })
	}

	return (
		<main className="grid gap-6 p-3">
			<div className="grid grid-cols-1 gap-3">
				<div className="flex gap-3">
					<CharacterImage
						url={character.imageUrl}
						onChange={(imageUrl) => onUpdate({ imageUrl })}
					/>

					<div className="flex flex-1 flex-col gap-3">
						<div className="flex gap-3">
							<InputField
								label="Name"
								className="flex-1"
								value={character.name}
								onSubmitValue={(value) => {
									onUpdate({ name: value })
								}}
							/>
						</div>

						<CharacterResourceFields
							character={character}
							onUpdate={onUpdate}
						/>

						<PlayerSelect
							playerId={character.ownerId}
							onChange={(ownerId) => onUpdate({ ownerId })}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-6">
					<div className="grid content-start gap-3">
						<h2
							className={`heading-xl text-left ${isCoreAttributesValid ? "" : "text-red-300"}`}
						>
							Core Attributes
						</h2>
						{Object.entries(attributes).map(([key, attribute]) => (
							<AttributeDropdown
								key={key}
								label={attribute.name}
								value={attributeScores[key] ?? 1}
								onSubmitValue={(value) => updateAttributeScore(key, value)}
								options={coreAttributeOptions}
							/>
						))}
						{!isCoreAttributesValid && (
							<p className="mt-2 text-sm font-medium text-red-300">
								Assign exactly one of each: 1, 2, 2, 3, 5 to core attributes
							</p>
						)}
					</div>

					<div className="grid content-start gap-3">
						<h2
							className={`heading-xl text-left ${isAspectAttributesValid ? "" : "text-red-300"}`}
						>
							Aspect Attributes
						</h2>
						{Object.entries(aspects).map(([key, aspect]) => (
							<AttributeDropdown
								key={key}
								label={aspect.name}
								value={attributeScores[key] ?? 0}
								onSubmitValue={(value) => updateAttributeScore(key, value)}
								options={aspectAttributeOptions}
							/>
						))}
						{!isAspectAttributesValid && (
							<p className="mt-2 text-sm font-medium text-red-300">
								Assign exactly: 0, 0, 1, 2, 4 to aspect attributes
								<button
									type="button"
									className="ml-2 text-xs underline"
									onClick={() => {
										console.group("Aspect Attributes Debug")
										console.log(
											"Current Values:",
											Object.fromEntries(
												Object.keys(aspects).map((key) => [
													key,
													attributeScores[key] ?? 0,
												]),
											),
										)
										console.log(
											"Expected Distribution:",
											aspectAttributeDistribution,
										)
										console.log(
											"Actual Distribution:",
											aspectAttributeValues.sort(),
										)
										console.groupEnd()
									}}
								>
									Debug
								</button>
							</p>
						)}
					</div>
				</div>
			</div>

			<ToggleSection title="Actions">
				<div className="mt-4">
					<ActionsList character={character} onRollAction={onRollAction} />
				</div>
			</ToggleSection>

			<ToggleSection title="Details">
				<p className="mb-4 text-sm font-medium text-pretty text-gray-300">
					Add any additional details about your character, such as their
					backstory, personality, etc.
				</p>
				<SubmitTextArea
					className="field-sizing-content w-full min-w-0 rounded border border-gray-800 bg-gray-900 px-3 py-1.5 transition focus:border-gray-700 focus:outline-none"
					value={character.details ?? ""}
					onSubmitValue={(details) => onUpdate({ details })}
				/>
			</ToggleSection>

			<ToggleSection title="Lineage">
				<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
					Your lineage(s) determine your physical appearance and traits. Hover
					over each one for examples.
				</p>

				{(characterLineages.length === 0 || characterLineages.length > 2) && (
					<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
						Choose one or two lineages.
					</p>
				)}

				<div className="grid grid-cols-2 items-start gap-3">
					{lineages.map((lineage) => (
						<OptionCard
							type="checkbox"
							key={lineage.name}
							label={lineage.name}
							description={lineage.ability}
							aside={`Examples: ${lineage.example}`}
							checked={character.lineages?.includes(lineage.name)}
							onChange={() => {
								onUpdate({
									lineages: toggleInArray(character.lineages, lineage.name),
								})
							}}
						/>
					))}
				</div>
			</ToggleSection>

			<ToggleSection title="Persona">
				<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
					Your persona(s) determine your character's role and alignment. Hover
					over each one for examples.
				</p>

				{(characterPersonas.length === 0 || characterPersonas.length > 2) && (
					<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
						Choose one or two personas.
					</p>
				)}

				<div className="grid grid-cols-2 items-start gap-3">
					{personas.map((persona) => (
						<OptionCard
							type="checkbox"
							key={persona.name}
							label={persona.name}
							description={persona.ability}
							aside={persona.description}
							checked={character.personas?.includes(persona.name)}
							onChange={() => {
								onUpdate({
									personas: toggleInArray(character.personas, persona.name),
								})
							}}
						/>
					))}
				</div>
			</ToggleSection>

			<ToggleSection title="Aspect Actions">
				<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
					Aspect actions are the various ways your character can perform aspect
					art.
				</p>

				{character.selectedAspectSkills?.length !== 3 && (
					<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
						Select 3 aspect actions.
					</p>
				)}

				<div className="grid gap-4">
					{Object.values(aspects).map((aspect) => {
						const aspectActions = aspectSkills.filter(
							(skill) => skill.aspect === aspect,
						)
						const aspectValue = attributeScores[aspect.name.toLowerCase()] ?? 0
						const isZeroValue = aspectValue === 0

						return (
							<div
								key={aspect.name}
								className={`grid gap-2 ${isZeroValue ? "opacity-75" : ""}`}
							>
								<h3 className="text-md font-medium">
									{aspect.name} ({aspectValue})
								</h3>
								<div className="grid grid-cols-2 gap-3">
									{aspectActions.map((action) => {
										const isSelected = character.selectedAspectSkills?.includes(
											action.name,
										)
										return (
											<OptionCard
												type="checkbox"
												key={action.name}
												label={action.name}
												description={action.effect}
												aside={action.description}
												checked={isSelected}
												onChange={() => {
													onUpdate({
														selectedAspectSkills: toggleInArray(
															character.selectedAspectSkills,
															action.name,
														),
													})
												}}
											/>
										)
									})}
								</div>
							</div>
						)
					})}
				</div>
			</ToggleSection>
		</main>
	)
}

function AttributeDropdown({
	label,
	className,
	value,
	onSubmitValue,
	options,
}: {
	label: string
	className?: string
	value: number
	onSubmitValue: (value: number) => void
	options: number[]
}) {
	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<label className="w-24 text-sm font-medium">{label}</label>
			<select
				value={value}
				onChange={(event) => onSubmitValue(Number(event.target.value))}
				className="h-10 w-20 min-w-0 rounded border border-gray-800 bg-gray-900 px-3 text-center transition focus:border-gray-700 focus:outline-none"
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}

function PlayerSelect({
	playerId,
	onChange,
}: {
	playerId: string | undefined
	onChange: (playerId: string | undefined) => void
}) {
	const players = usePartyPlayers()
	const self = usePlayer()
	const allPlayers = self ? [self, ...players] : players
	if (self?.role !== "GM") return null

	return (
		<div>
			<label className="block text-sm font-medium">Player</label>
			<select
				value={playerId ?? ""}
				onChange={(event) => {
					onChange(event.currentTarget.value || undefined)
				}}
				className="h-10 w-full min-w-0 rounded border border-gray-800 bg-gray-900 px-3 transition focus:border-gray-700 focus:outline-none"
			>
				<option value="">None</option>
				{allPlayers.map((player) => (
					<option key={player.id} value={player.id}>
						{player.name}
					</option>
				))}
			</select>
		</div>
	)
}

function CharacterImage({
	url,
	onChange,
}: {
	url: string | undefined | null
	onChange: (url: string | null) => void
}) {
	const player = usePlayer()
	if (player?.role !== "GM") {
		return url ? (
			<img
				src={url}
				alt=""
				className="aspect-[3/4] w-32 rounded border border-gray-800 object-cover object-top"
			/>
		) : null
	}

	return (
		<div className="flex flex-col gap-1">
			<Tooltip content="Set character image">
				<button
					type="button"
					className="group flex aspect-[3/4] w-32 items-center justify-center overflow-clip rounded border border-gray-800 transition hover:border-gray-700"
					onClick={async () => {
						const [download] = await OBR.assets.downloadImages(false)
						if (download?.image.url) {
							onChange(download.image.url)
						}
					}}
				>
					<Icon
						icon="mingcute:pic-line"
						className="group-hover:text-primary-300 size-16 opacity-25 transition group-hover:opacity-50"
					/>
					{url && (
						<img
							src={url}
							alt=""
							className="size-full object-cover object-top"
						/>
					)}
				</button>
			</Tooltip>
			{url && (
				<SmallSolidButton onClick={() => onChange(null)}>
					<Icon icon="mingcute:close-fill" className="size-4" /> Remove image
				</SmallSolidButton>
			)}
		</div>
	)
}

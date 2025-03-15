import OBR from "@owlbear-rodeo/sdk"
import { Character } from "../character.ts"
import {
	ASPECT_ACTIONS_COUNT,
	ASPECT_ATTRIBUTE_MIN,
	ASPECT_ATTRIBUTE_POINTS,
	aspects,
	aspectSkills,
	attributes,
	CORE_ATTRIBUTE_MIN,
	CORE_ATTRIBUTE_POINTS,
	lineages,
	MAX_ATTRIBUTE_VALUE,
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

	// Calculate totals for each attribute category
	const coreAttributeValues = Object.keys(attributes).map(
		(key) => attributeScores[key] ?? CORE_ATTRIBUTE_MIN,
	)
	const aspectAttributeValues = Object.keys(aspects).map(
		(key) => attributeScores[key] ?? ASPECT_ATTRIBUTE_MIN,
	)

	const coreAttributesTotal = coreAttributeValues.reduce(
		(sum, val) => sum + val,
		0,
	)
	const aspectAttributesTotal = aspectAttributeValues.reduce(
		(sum, val) => sum + val,
		0,
	)

	// Validate sums
	const isCoreAttributeSumValid = coreAttributesTotal === CORE_ATTRIBUTE_POINTS
	const isAspectAttributeSumValid =
		aspectAttributesTotal === ASPECT_ATTRIBUTE_POINTS

	const anyCoreAttributeOutOfRange = coreAttributeValues.some(
		(value) => value < CORE_ATTRIBUTE_MIN || value > MAX_ATTRIBUTE_VALUE,
	)

	const anyAspectAttributeOutOfRange = aspectAttributeValues.some(
		(value) => value < ASPECT_ATTRIBUTE_MIN || value > MAX_ATTRIBUTE_VALUE,
	)

	// Combined validation
	const isCoreAttributesValid =
		isCoreAttributeSumValid && !anyCoreAttributeOutOfRange
	const isAspectAttributesValid =
		isAspectAttributeSumValid && !anyAspectAttributeOutOfRange

	const updateAttributeScore = (attribute: string, value: number) => {
		onUpdate({
			attributeScores: {
				...attributeScores,
				[attribute]: value,
			},
		})
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
							Core Attributes ({coreAttributesTotal}/{CORE_ATTRIBUTE_POINTS})
						</h2>
						{Object.entries(attributes).map(([key, attribute]) => (
							<AttributeInput
								key={key}
								label={attribute.name}
								value={attributeScores[key] ?? CORE_ATTRIBUTE_MIN}
								onSubmitValue={(value) => {
									const clampedValue = Math.max(value, CORE_ATTRIBUTE_MIN)
									updateAttributeScore(key, clampedValue)
								}}
								min={CORE_ATTRIBUTE_MIN}
							/>
						))}
						{!isCoreAttributesValid && (
							<p className="mt-2 text-sm font-medium text-red-300">
								{anyCoreAttributeOutOfRange
									? `Core attributes must be between ${CORE_ATTRIBUTE_MIN} and ${MAX_ATTRIBUTE_VALUE}.`
									: `Assign exactly ${CORE_ATTRIBUTE_POINTS} total points to core attributes.`}
							</p>
						)}
					</div>

					<div className="grid content-start gap-3">
						<h2
							className={`heading-xl text-left ${isAspectAttributesValid ? "" : "text-red-300"}`}
						>
							Aspect Attributes ({aspectAttributesTotal}/
							{ASPECT_ATTRIBUTE_POINTS})
						</h2>
						{Object.entries(aspects).map(([key, aspect]) => (
							<AttributeInput
								key={key}
								label={aspect.name}
								value={attributeScores[key] ?? ASPECT_ATTRIBUTE_MIN}
								onSubmitValue={(value) => {
									const clampedValue = Math.max(value, ASPECT_ATTRIBUTE_MIN)
									updateAttributeScore(key, clampedValue)
								}}
								min={ASPECT_ATTRIBUTE_MIN}
							/>
						))}
						{!isAspectAttributesValid && (
							<p className="mt-2 text-sm font-medium text-red-300">
								{anyAspectAttributeOutOfRange
									? `Aspect attributes must be between ${ASPECT_ATTRIBUTE_MIN} and ${MAX_ATTRIBUTE_VALUE}.`
									: `Assign exactly ${ASPECT_ATTRIBUTE_POINTS} total points to aspect attributes.`}
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
					Your lineage determine your physical appearance and traits.
				</p>

				{(characterLineages.length === 0 || characterLineages.length > 2) && (
					<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
						Choose one or two lineages.
					</p>
				)}

				<div className="grid grid-cols-2 gap-3">
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
									lineages: toggleInArray(
										character.lineages ?? [],
										lineage.name,
									),
								})
							}}
						/>
					))}
				</div>
			</ToggleSection>

			<ToggleSection title="Persona">
				<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
					Your persona defines your role in the group and your approach to
					solving problems.
				</p>

				{(characterPersonas.length === 0 || characterPersonas.length > 2) && (
					<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
						Choose one or two personas.
					</p>
				)}

				<div className="grid grid-cols-2 gap-3">
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
									personas: toggleInArray(
										character.personas ?? [],
										persona.name,
									),
								})
							}}
						/>
					))}
				</div>
			</ToggleSection>

			<ToggleSection
				title={`Aspect Actions (${character.selectedAspectSkills?.length || 0}/${ASPECT_ACTIONS_COUNT})`}
			>
				<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
					Aspect actions are the various ways your character can perform aspect
					art.
				</p>

				{character.selectedAspectSkills?.length !== ASPECT_ACTIONS_COUNT && (
					<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
						Select {ASPECT_ACTIONS_COUNT} aspect actions.
					</p>
				)}

				<div className="grid gap-4">
					{Object.values(aspects).map((aspect) => {
						const allAspectActions = aspectSkills.filter(
							(skill) => skill.aspect === aspect,
						)
						const aspectValue = attributeScores[aspect.name.toLowerCase()] ?? 0
						const isZeroValue = aspectValue === 0

						// Split actions into selectable (with effects) and narrative (without effects)
						const selectableActions = allAspectActions.filter(
							(action) => !!action.effect,
						)
						const narrativeActions = allAspectActions.filter(
							(action) => !action.effect,
						)

						return (
							<div
								key={aspect.name}
								className={`grid gap-2 ${isZeroValue ? "opacity-75" : ""}`}
							>
								<h3 className="text-xl font-light">
									{aspect.name} ({aspectValue})
								</h3>

								{/* Selectable actions */}
								<div className="grid grid-cols-2 gap-3">
									{selectableActions.map((action) => {
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
															character.selectedAspectSkills ?? [],
															action.name,
														),
													})
												}}
											/>
										)
									})}
								</div>

								{/* Narrative-only actions */}
								{narrativeActions.length > 0 && aspectValue > 0 && (
									<>
										<h4 className="mt-2 text-lg font-light text-gray-200">
											Other Actions
										</h4>
										<ul className="grid gap-x-4 gap-y-1">
											{narrativeActions.map((action) => (
												<li key={action.name} className="text-sm text-gray-300">
													<strong>{action.name}</strong> - {action.description}
												</li>
											))}
										</ul>
									</>
								)}
							</div>
						)
					})}
				</div>
			</ToggleSection>
		</main>
	)
}

function AttributeInput({
	label,
	className,
	value,
	onSubmitValue,
	min,
}: {
	label: string
	className?: string
	value: number
	onSubmitValue: (value: number) => void
	min: number
}) {
	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<label className="w-20 font-medium">{label}</label>
			<input
				type="number"
				value={value}
				min={min}
				onChange={(event) => onSubmitValue(Number(event.target.value))}
				className="h-10 w-20 min-w-0 rounded border border-gray-800 bg-gray-900 px-3 text-center transition focus:border-gray-700 focus:outline-none"
			/>
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

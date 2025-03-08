import { intersection } from "es-toolkit"
import { ActionsList } from "./ActionsList.tsx"
import { CharacterResourceFields } from "./CharacterResourceFields.tsx"
import { InputField } from "./InputField.tsx"
import { OptionCard } from "./OptionCard.tsx"
import { StatField } from "./StatField.tsx"
import { ToggleSection } from "./ToggleSection.tsx"
import { Character, getComputedCharacter } from "./character.ts"
import {
	characterLevels,
	drives,
	experiences,
	lineages,
	roles,
} from "./data.ts"
import { usePartyPlayers, usePlayer } from "./hooks.tsx"

function getCharacterExperienceCount(character: Character) {
	return intersection(Object.keys(experiences), character.experiences ?? [])
		.length
}

function getCharacterLineages(character: Character) {
	return lineages.filter((l) => character.lineages?.includes(l.name))
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
	const stats = getComputedCharacter(character)

	const level = characterLevels[character.level - 1]

	const currentAttributeBonuses =
		character.strengthBonus +
		character.senseBonus +
		character.dexterityBonus +
		character.presenceBonus

	const availableAttributeBonuses = 3 + (level?.attributePoints ?? 0)

	const currentAspectBonuses =
		character.fireBonus +
		character.waterBonus +
		character.windBonus +
		character.lightBonus +
		character.darknessBonus

	const availableAspectBonuses = 5 + (level?.aspectPoints ?? 0)

	const characterLineages = getCharacterLineages(character)

	return (
		<main className="grid gap-6 p-3">
			<div className="grid grid-cols-1 gap-3">
				<div className="flex gap-3">
					<InputField
						label="Name"
						className="flex-1"
						value={character.name}
						onSubmitValue={(value) => {
							onUpdate({ name: value })
						}}
					/>
					<InputField
						label="Level"
						type="number"
						className="w-16"
						min={1}
						max={characterLevels.length}
						value={character.level}
						onSubmitValue={(event) =>
							onUpdate({
								level: Number(event) || 0,
							})
						}
					/>
				</div>

				<CharacterResourceFields character={character} onUpdate={onUpdate} />

				<PlayerSelect
					playerId={character.ownerId}
					onChange={(ownerId) => onUpdate({ ownerId })}
				/>

				<div className="grid grid-cols-2 gap-4">
					<div className="grid content-start gap-3">
						<h2 className="heading-xl text-center">
							Attributes ({currentAttributeBonuses}/{availableAttributeBonuses})
						</h2>

						<StatField
							label="Strength"
							className="min-w-0 flex-1"
							value={character.strengthBonus || 0}
							addition={stats.strength - character.strengthBonus}
							onSubmitValue={(value) => onUpdate({ strengthBonus: value })}
						/>
						<StatField
							label="Sense"
							className="min-w-0 flex-1"
							value={character.senseBonus || 0}
							addition={stats.sense - character.senseBonus}
							onSubmitValue={(value) => onUpdate({ senseBonus: value })}
						/>
						<StatField
							label="Dexterity"
							className="min-w-0 flex-1"
							value={character.dexterityBonus || 0}
							addition={stats.dexterity - character.dexterityBonus}
							onSubmitValue={(value) => onUpdate({ dexterityBonus: value })}
						/>
						<StatField
							label="Presence"
							className="min-w-0 flex-1"
							value={character.presenceBonus || 0}
							addition={stats.presence - character.presenceBonus}
							onSubmitValue={(value) => onUpdate({ presenceBonus: value })}
						/>
					</div>

					<div className="grid content-start gap-3">
						<h2 className="heading-xl text-center">
							Aspects ({currentAspectBonuses}/{availableAspectBonuses})
						</h2>
						<StatField
							label="Fire"
							className="min-w-0 flex-1"
							value={character.fireBonus || 0}
							addition={stats.fire - character.fireBonus}
							onSubmitValue={(value) => onUpdate({ fireBonus: value })}
						/>
						<StatField
							label="Water"
							className="min-w-0 flex-1"
							value={character.waterBonus || 0}
							addition={stats.water - character.waterBonus}
							onSubmitValue={(value) => onUpdate({ waterBonus: value })}
						/>
						<StatField
							label="Wind"
							className="min-w-0 flex-1"
							value={character.windBonus || 0}
							addition={stats.wind - character.windBonus}
							onSubmitValue={(value) => onUpdate({ windBonus: value })}
						/>
						<StatField
							label="Light"
							className="min-w-0 flex-1"
							value={character.lightBonus || 0}
							addition={stats.light - character.lightBonus}
							onSubmitValue={(value) => onUpdate({ lightBonus: value })}
						/>
						<StatField
							label="Darkness"
							className="min-w-0 flex-1"
							value={character.darknessBonus || 0}
							addition={stats.darkness - character.darknessBonus}
							onSubmitValue={(value) => onUpdate({ darknessBonus: value })}
						/>
					</div>
				</div>
			</div>

			<ToggleSection title="Actions">
				<ActionsList character={character} onRollAction={onRollAction} />
			</ToggleSection>

			<ToggleSection
				title={`Experiences (${getCharacterExperienceCount(character)}/3)`}
			>
				<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
					Choose three experiences from your character's past. Each experience
					adds +2 to the named attribute and increases your aspect attunement.
				</p>

				<div className="grid gap-3">
					{Object.entries(experiences).map(([id, exp]) => (
						<OptionCard
							type="checkbox"
							key={id}
							label={exp.description}
							description={[
								`${exp.attribute.name} +2`,
								exp.aspects.length === 1
									? exp.aspects.map((it) => it.name).join("") + " +2"
									: exp.aspects.map((it) => it.name + " +1").join(", "),
							]}
							checked={character.experiences?.includes(id) ?? false}
							onChange={() => {
								const currentExperiences = character.experiences || []
								if (currentExperiences.includes(id)) {
									onUpdate({
										experiences: currentExperiences.filter((exp) => exp !== id),
									})
								} else {
									onUpdate({
										experiences: [...currentExperiences, id],
									})
								}
							}}
						/>
					))}
				</div>
			</ToggleSection>

			<ToggleSection title="Role">
				<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
					Choose your role in this society. Hover over each one for examples.
				</p>
				<div className="grid grid-cols-2 gap-3">
					{Object.entries(roles).map(([roleId, role]) => (
						<OptionCard
							type="radio"
							key={roleId}
							label={role.name}
							description={`+2 ${role.attribute.name}`}
							checked={character.role === roleId}
							onChange={() => onUpdate({ role: roleId })}
							// show name on title in case it gets truncated
							title={`${role.name} - ${role.examples}`}
						/>
					))}
				</div>
			</ToggleSection>

			<ToggleSection title="Drive">
				<p className="mb-2 text-sm font-medium text-pretty text-gray-300">
					Choose your character's drive, the primary motivation that pushes them
					to action. Your chosen drive determines your aspect skills.
				</p>

				{character.role && (
					<>
						<h3 className="text-md mb-1 font-semibold text-gray-200">
							Suggested for the role "
							{character.role &&
								roles[character.role as keyof typeof roles]?.name}
							"
						</h3>
						<div className="mb-4 grid grid-cols-2 gap-3">
							{Object.entries(roles)
								.find(([id]) => id === character.role)?.[1]
								?.drives.map((drive) => (
									<OptionCard
										type="radio"
										key={drive.name}
										label={drive.name}
										description={drive.description}
										checked={character.drive === drive.name}
										onChange={() => onUpdate({ drive: drive.name })}
									/>
								))}
						</div>
					</>
				)}

				<h3 className="text-md mb-1 font-semibold text-gray-200">
					Other drives
				</h3>
				<div className="grid grid-cols-2 gap-3">
					{Object.values(drives)
						.filter(
							(drive) =>
								!character.role ||
								!Object.entries(roles)
									.find(([id]) => id === character.role)?.[1]
									?.drives.includes(drive),
						)
						.map((drive) => (
							<OptionCard
								type="checkbox"
								key={drive.name}
								label={drive.name}
								description={drive.description}
								checked={character.drive === drive.name}
								onChange={() => onUpdate({ drive: drive.name })}
							/>
						))}
				</div>
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

				<div className="grid grid-cols-2 gap-3">
					{lineages.map((lineage) => (
						<OptionCard
							type="checkbox"
							key={lineage.name}
							label={lineage.name}
							description={lineage.aspects
								.map((it) => `+2 ${it.name}`)
								.join(", ")}
							title={lineage.example}
							checked={character.lineages?.includes(lineage.name)}
							onChange={() => {
								const lineages = new Set(character.lineages)
								if (lineages.has(lineage.name)) {
									lineages.delete(lineage.name)
								} else {
									lineages.add(lineage.name)
								}
								onUpdate({ lineages: [...lineages] })
							}}
						/>
					))}
				</div>
			</ToggleSection>
		</main>
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

import { type } from "arktype"
import { twMerge } from "tailwind-merge"
import { Icon } from "~/components/ui/Icon.tsx"
import { Tooltip } from "~/components/ui/Tooltip.tsx"
import { Character } from "../character.ts"
import type { DicePanelStore } from "./DicePanel.store.ts"
import { Dialog, DialogButton, DialogPanel } from "./ui/Dialog.tsx"
import { InputField } from "./ui/InputField.tsx"
import { SelectField } from "./ui/SelectField.tsx"
import { SolidButton } from "./ui/SolidButton"

export type DiceRoll = typeof DiceRoll.inferOut
export const DiceRoll = type({
	id: "string",
	label: "string",
	diceCount: "number",
	results: "number[]",
	timestamp: "number",
	fatigueCost: "number?",
	characterName: "string?",
})

function calculateSuccesses(value: number): number {
	if (value >= 10 && value <= 11) return 1
	if (value === 12) return 2
	return 0
}

function getDieIcon(value: number): React.ReactNode {
	const success = calculateSuccesses(value)

	if (success === 2) {
		return (
			<div className="flex items-center justify-center text-green-700">
				<Icon icon="mingcute:pentagon-fill" className="size-10" />
				<span className="absolute font-semibold text-white">{value}</span>
			</div>
		)
	} else if (success === 1) {
		return (
			<div className="flex items-center justify-center text-green-700">
				<Icon icon="mingcute:pentagon-line" className="size-10" />
				<span className="absolute font-semibold">{value}</span>
			</div>
		)
	} else {
		return (
			<div className="flex items-center justify-center text-gray-400">
				<Icon icon="mingcute:pentagon-line" className="size-10" />
				<span className="absolute font-semibold">{value}</span>
			</div>
		)
	}
}

interface DicePanelProps {
	store: DicePanelStore
	isOpen: boolean
	setOpen: (open: boolean) => void
	diceRolls: DiceRoll[]
	onRoll: (params: {
		characterId: string
		fatigue: number
		results: number[]
		isSuccess: boolean
		label: string
	}) => void
	characters: Map<string, Character>
}

export function DicePanel({
	store,
	isOpen,
	setOpen,
	diceRolls,
	onRoll,
	characters,
}: DicePanelProps) {
	function rollDice() {
		if (store.count < 1) return

		const results = Array.from(
			{ length: store.count },
			() => Math.floor(Math.random() * 12) + 1,
		)

		const successes = countSuccesses(results)
		const isSuccess = successes > 0

		if (store.selectedCharacterId !== null) {
			onRoll({
				characterId: store.selectedCharacterId,
				fatigue: store.fatigue,
				results,
				isSuccess,
				label: store.label,
			})
		}
	}

	function countSuccesses(results: number[]): number {
		return results.reduce((sum, value) => sum + calculateSuccesses(value), 0)
	}

	return (
		<Dialog open={isOpen} setOpen={setOpen}>
			<DialogButton
				type="button"
				className="hover:text-primary-300 fixed right-4 bottom-4 flex size-14 items-center justify-center rounded-full border border-gray-800 bg-gray-900 shadow-lg transition hover:border-gray-700"
				title="Show dice roller"
			>
				<Icon icon="mingcute:box-3-fill" className="size-8" />
			</DialogButton>

			<DialogPanel title="Dice Roller">
				<form
					className="flex flex-col gap-2"
					action={() => {
						rollDice()
						store.reset()
						setOpen(false)
					}}
				>
					<div className="flex gap-2">
						<InputField
							label="Label"
							className="flex-1"
							type="text"
							value={store.label}
							onChange={(e) => store.setLabel(e.target.value)}
							onSubmitValue={(value) => store.setLabel(value)}
							placeholder="Strength Check, Attack Roll, etc."
						/>
					</div>

					<SelectField
						label="Character"
						value={store.selectedCharacterId ?? ""}
						onChange={(event) => {
							const value = event.target.value
							store.setSelectedCharacterId(value === "" ? null : value)
						}}
					>
						<option value="">None</option>
						{Array.from(characters.values()).map((character) => (
							<option key={character.id} value={character.id}>
								{character.name}
							</option>
						))}
					</SelectField>

					<div className="flex items-end gap-2">
						{store.selectedCharacterId && (
							<InputField
								label="Fatigue"
								className="flex-1"
								type="number"
								min="0"
								value={store.fatigue}
								onChange={(e) =>
									store.setFatigue(Math.max(0, parseInt(e.target.value) || 0))
								}
							/>
						)}

						<InputField
							label="# of dice"
							className="flex-1"
							type="number"
							min="1"
							value={store.count}
							onChange={(e) =>
								store.setCount(Math.max(1, parseInt(e.target.value) || 1))
							}
						/>
					</div>

					<div className="flex items-center gap-2">
						<SolidButton
							type="submit"
							autoFocus
							className="flex-1 justify-center"
						>
							<Icon icon="mingcute:box-3-fill" className="size-5" />
							<span>Roll {store.count} dice</span>
						</SolidButton>
						<Tooltip content="Roll and preserve settings">
							<SolidButton onClick={rollDice}>
								<Icon
									icon="mingcute:history-anticlockwise-line"
									className="size-5"
								/>
							</SolidButton>
						</Tooltip>
					</div>
				</form>

				<section
					aria-labelledby="history-heading"
					className="flex min-h-0 flex-1 flex-col"
				>
					<h3 id="history-heading" className="heading-xl mb-1">
						History
					</h3>
					{diceRolls.length === 0 ? (
						<p className="text-gray-400">No dice rolls yet</p>
					) : (
						<ul className="grid min-h-0 flex-1 gap-2 overflow-y-auto">
							{diceRolls.map((roll) => {
								const successes = countSuccesses(roll.results)
								const isSuccess = successes > 0
								return (
									<li
										key={roll.id}
										className={twMerge(
											"rounded border bg-gray-900 p-3",
											isSuccess ? "border-green-900" : "border-gray-800",
										)}
									>
										<time
											dateTime={new Date(roll.timestamp).toISOString()}
											className="float-right text-sm text-gray-400"
										>
											{new Date(roll.timestamp).toLocaleTimeString()}
										</time>

										<h4 className="mb-1 font-medium">{roll.label}</h4>

										<ul className="mb-1 flex flex-wrap gap-1">
											{roll.results.map((result, i) => (
												<li key={i} className="relative">
													{getDieIcon(result)}
												</li>
											))}
										</ul>

										<p className="text-sm font-semibold tracking-wide text-gray-400">
											{roll.characterName ? (
												<>
													Rolled by{" "}
													<strong className="font-bold">
														{roll.characterName}
													</strong>{" "}
													•{" "}
												</>
											) : null}
											{isSuccess ? (
												<strong className="text-green-300">
													{successes}{" "}
													{successes === 1 ? "success" : "successes"}
												</strong>
											) : (
												<strong>failed</strong>
											)}
										</p>
									</li>
								)
							})}
						</ul>
					)}
				</section>
			</DialogPanel>
		</Dialog>
	)
}

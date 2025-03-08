import * as Ariakit from "@ariakit/react"
import { type } from "arktype"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "~/components/ui/Icon.tsx"
import { Tooltip } from "~/components/ui/Tooltip.tsx"
import { Character } from "./character.ts"

export type DiceRoll = typeof DiceRoll.inferOut
export const DiceRoll = type({
	"id": "string",
	"label": "string",
	"diceCount": "number",
	"results": "number[]",
	"timestamp": "number",
	"fatigueCost?": "number",
	"characterName?": "string | null",
	"comebackUsed?": "number",
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

export type DicePanelStore = ReturnType<typeof useDicePanelStore>
export function useDicePanelStore() {
	const [count, setCount] = useState(1)
	const [label, setLabel] = useState("")
	const [fatigue, setFatigue] = useState(0)
	const [comeback, setComeback] = useState(0)
	const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
		null,
	)

	function reset() {
		setCount(1)
		setLabel("")
		setFatigue(0)
		setComeback(0)
	}

	return {
		count,
		setCount,
		label,
		setLabel,
		fatigue,
		setFatigue,
		comeback,
		setComeback,
		selectedCharacterId,
		setSelectedCharacterId,
		reset,
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
		comebackSpent: number
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

		const totalDiceCount = store.count + store.comeback

		const results = Array.from(
			{ length: totalDiceCount },
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
				comebackSpent: store.comeback,
				label: store.label,
			})
		}
	}

	function countSuccesses(results: number[]): number {
		return results.reduce((sum, value) => sum + calculateSuccesses(value), 0)
	}

	return (
		<Ariakit.DialogProvider open={isOpen} setOpen={setOpen}>
			<Ariakit.DialogDisclosure
				type="button"
				className="hover:text-primary-300 fixed right-4 bottom-4 flex size-14 items-center justify-center rounded-full border border-gray-800 bg-gray-900 shadow-lg transition hover:border-gray-700"
				title="Show dice roller"
			>
				<Icon icon="mingcute:box-3-fill" className="size-8" />
			</Ariakit.DialogDisclosure>

			<Ariakit.Dialog
				portal
				unmountOnHide
				backdrop={
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
				}
				className="fixed top-1/2 left-1/2 flex h-dvh max-h-[720px] w-dvw max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg border border-gray-800 bg-gray-950 p-4 shadow-lg"
			>
				<header className="flex items-center justify-between">
					<Ariakit.DialogHeading className="heading-2xl">
						Dice Roller
					</Ariakit.DialogHeading>
					<Ariakit.DialogDismiss className="hover:text-primary-300 rounded p-1 transition">
						<Icon icon="mingcute:close-fill" className="size-6" />
					</Ariakit.DialogDismiss>
				</header>

				<form
					className="flex flex-col gap-2"
					action={() => {
						rollDice()
						store.reset()
						setOpen(false)
					}}
				>
					<div className="flex gap-2">
						<div className="flex-1">
							<label className="mb-1 block text-sm font-medium">Label</label>
							<input
								type="text"
								value={store.label}
								onChange={(e) => store.setLabel(e.target.value)}
								className="h-10 w-full min-w-0 rounded border border-gray-800 bg-gray-900 px-3 transition focus:border-gray-700 focus:outline-none"
								placeholder="Strength Check, Attack Roll, etc."
							/>
						</div>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">Character</label>
						<select
							value={store.selectedCharacterId ?? ""}
							onChange={(e) => {
								const value = e.target.value
								store.setSelectedCharacterId(value === "" ? null : value)
								if (value === "") {
									store.setComeback(0)
								} else {
									const character = characters.get(value)
									if (character && store.comeback > character.comeback) {
										store.setComeback(character.comeback)
									}
								}
							}}
							className="h-10 w-full min-w-0 rounded border border-gray-800 bg-gray-900 px-3 transition focus:border-gray-700 focus:outline-none"
						>
							<option value="">None</option>
							{Array.from(characters.values()).map((character) => (
								<option key={character.id} value={character.id}>
									{character.name}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-end gap-2">
						{store.selectedCharacterId && (
							<>
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium">
										Fatigue
									</label>
									<input
										type="number"
										min="0"
										value={store.fatigue}
										onChange={(e) =>
											store.setFatigue(
												Math.max(0, parseInt(e.target.value) || 0),
											)
										}
										className="h-10 w-full min-w-0 rounded border border-gray-800 bg-gray-900 px-3 transition focus:border-gray-700 focus:outline-none"
									/>
								</div>
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium">
										{store.selectedCharacterId
											? `Comeback / ${characters.get(store.selectedCharacterId)?.comeback || 0}`
											: "Comeback"}
									</label>
									<input
										type="number"
										min="0"
										value={store.comeback}
										onChange={(e) => {
											const selectedCharacter = store.selectedCharacterId
												? characters.get(store.selectedCharacterId)
												: null
											const maxComeback = selectedCharacter?.comeback || 0
											store.setComeback(
												Math.min(
													maxComeback,
													Math.max(0, parseInt(e.target.value) || 0),
												),
											)
										}}
										className="h-10 w-full min-w-0 rounded border border-gray-800 bg-gray-900 px-3 transition focus:border-gray-700 focus:outline-none"
									/>
								</div>
							</>
						)}

						<div className="flex-1">
							<label className="mb-1 block text-sm font-medium">
								# of dice
							</label>
							<input
								type="number"
								min="1"
								value={store.count}
								onChange={(e) =>
									store.setCount(Math.max(1, parseInt(e.target.value) || 1))
								}
								className="h-10 w-full min-w-0 rounded border border-gray-800 bg-gray-900 px-3 transition focus:border-gray-700 focus:outline-none"
							/>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Ariakit.Button
							type="submit"
							className="hover:text-primary-300 flex h-10 flex-1 items-center justify-center gap-2 rounded border border-gray-800 bg-gray-900 px-3 transition"
							autoFocus
						>
							<Icon icon="mingcute:box-3-fill" className="size-5" />
							<span>Roll {store.count + store.comeback} dice</span>
						</Ariakit.Button>
						<Tooltip content="Roll and preserve settings">
							<button
								type="button"
								className="hover:text-primary-300 flex aspect-square h-10 items-center justify-center gap-2 rounded opacity-75 transition hover:opacity-100"
								onClick={rollDice}
							>
								<Icon
									icon="mingcute:history-anticlockwise-line"
									className="size-5"
								/>
							</button>
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
											{roll.comebackUsed ? (
												<span className="text-blue-400">
													Used {roll.comebackUsed} comeback •{" "}
												</span>
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
			</Ariakit.Dialog>
		</Ariakit.DialogProvider>
	)
}

import { useId, type ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { SubmitInput } from "./ui/SubmitInput.tsx"

export function StatField({
	label,
	className,
	addition,
	value,
	onSubmitValue,
	...props
}: ComponentProps<"input"> & {
	label: string
	value: number
	addition: number
	onSubmitValue: (value: number) => void
}) {
	const id = useId()

	return (
		<div
			className={twMerge("flex items-center gap-1.5 tabular-nums", className)}
			{...props}
		>
			<label htmlFor={id} className="w-18 text-end text-sm font-semibold">
				{label}
			</label>
			<strong className="w-4 text-end text-lg">{value + addition}</strong>
			<span className="mx-1 h-5 w-px bg-gray-700"></span>
			<SubmitInput
				id={id}
				value={value}
				type="number"
				min={0}
				onSubmitValue={(value) => {
					return onSubmitValue(Number(value) || 0)
				}}
				{...props}
				className="w-14 min-w-0 rounded border border-gray-800 bg-gray-900 px-2 py-1 transition focus:border-gray-700 focus:outline-none"
			/>
			<p className="shrink-0 cursor-default text-gray-400" title="lore bonuses">
				+{addition}
			</p>
		</div>
	)
}

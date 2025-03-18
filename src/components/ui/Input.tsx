import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { IconTooltip } from "~/components/ui/IconTooltip.tsx"

type InputProps = {
	label?: string
	error?: string
	hint?: string
	suffix?: ReactNode
} & ComponentPropsWithoutRef<"input">

export function Input({
	label,
	error,
	hint,
	suffix,
	className = "",
	readOnly = false,
	...props
}: InputProps) {
	const baseInputClasses =
		"flex-1 px-3 py-2 min-w-0 border bg-gray-900 rounded-md focus:outline-none transition focus:ring-2 focus:ring-primary-500"
	const stateClasses =
		readOnly ? "border-gray-700"
		: error ? "border-red-300 focus:border-red-500 focus:ring-red-500"
		: "border-gray-700"

	return (
		<div className={`min-w-0 ${className}`}>
			{label && (
				<label className="mb-0.5 flex items-center gap-1 text-sm text-gray-300">
					<p className="font-semibold">{label}</p>
					{hint && <IconTooltip content={hint} className="size-4" />}
				</label>
			)}
			<div className="flex items-center gap-2">
				<input
					className={`${baseInputClasses} ${stateClasses}`}
					readOnly={readOnly}
					{...props}
				/>
				{suffix}
			</div>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	)
}

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { Icon } from "~/components/ui/Icon.tsx"
import { Tooltip } from "./Tooltip.tsx"

type TextAreaProps = {
	label?: string
	error?: string
	hint?: string
	suffix?: ReactNode
} & ComponentPropsWithoutRef<"textarea">

export function TextArea({
	label,
	error,
	hint,
	suffix,
	className = "",
	readOnly = false,
	...props
}: TextAreaProps) {
	const baseClasses =
		"flex-1 px-3 py-2 min-w-0 border bg-gray-900 rounded-md focus:outline-none transition focus:ring-2 focus:ring-primary-500 field-sizing-content"

	const stateClasses =
		readOnly ? "border-gray-700"
		: error ? "border-red-300 focus:border-red-500 focus:ring-red-500"
		: "border-gray-700"

	const id = useId()

	return (
		<div className={`min-w-0 ${className}`}>
			{label && (
				<label
					htmlFor={id}
					className="mb-0.5 flex items-center gap-1 text-sm text-gray-300"
				>
					<p className="font-semibold">{label}</p>
					{hint && (
						<Tooltip content={hint}>
							<Icon
								icon="mingcute:information-line"
								className="h-4 w-4 text-gray-400 transition hover:text-gray-100"
								aria-hidden
							/>
						</Tooltip>
					)}
				</label>
			)}
			<div className="flex items-center gap-2">
				<textarea
					id={id}
					className={`${baseClasses} ${stateClasses}`}
					readOnly={readOnly}
					{...props}
				/>
				{suffix}
			</div>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	)
}

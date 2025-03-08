import { useId, type ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { Field } from "./Field.tsx"
import { SubmitInput } from "./SubmitInput.tsx"

export function InputField({
	label,
	className,
	onSubmitValue,
	...props
}: ComponentProps<"input"> & {
	label: string
	onSubmitValue?: (value: string) => void
}) {
	const id = useId()

	const inputClass = twMerge(
		"min-w-0 w-full rounded border border-gray-800 bg-gray-900 px-3 py-1.5 transition focus:border-gray-700 focus:outline-none",
	)

	return (
		<Field label={label} className={className} htmlFor={props.id ?? id}>
			{onSubmitValue ? (
				<SubmitInput {...props} id={props.id ?? id} className={inputClass} />
			) : (
				<input {...props} id={props.id ?? id} className={inputClass} />
			)}
		</Field>
	)
}

import { useId, type ComponentProps } from "react"
import { Field } from "./Field.tsx"
import { SubmitInput } from "./SubmitInput.tsx"

export function InputField({
	label,
	className,
	...props
}: ComponentProps<"input"> & {
	label: string
	onSubmitValue: (value: string) => void
}) {
	const id = useId()
	return (
		<Field
			{...props}
			label={label}
			className={className}
			htmlFor={props.id ?? id}
		>
			<SubmitInput
				{...props}
				id={props.id ?? id}
				className="min-w-0 flex-1 rounded border border-gray-800 bg-gray-900 px-2 py-1 transition focus:border-gray-700 focus:outline-none"
			/>
		</Field>
	)
}

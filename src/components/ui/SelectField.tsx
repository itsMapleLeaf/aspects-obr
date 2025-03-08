import { useId, type ComponentProps } from "react"
import { Field } from "./Field.tsx"

export function SelectField({
	label,
	className,
	children,
	...props
}: ComponentProps<"select"> & {
	label: string
}) {
	const id = useId()

	return (
		<Field label={label} className={className} htmlFor={props.id ?? id}>
			<select
				{...props}
				id={props.id ?? id}
				className="h-10 w-full min-w-0 rounded border border-gray-800 bg-gray-900 px-3 transition focus:border-gray-700 focus:outline-none"
			>
				{children}
			</select>
		</Field>
	)
}

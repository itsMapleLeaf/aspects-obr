import { startTransition, useState, type ComponentProps } from "react"

export function SubmitInput({
	onSubmitValue,
	...props
}: ComponentProps<"input"> & {
	onSubmitValue: (value: string) => unknown
}) {
	const [tempValue, setTempValue] = useState<string>()
	return (
		<input
			{...props}
			value={tempValue ?? props.value}
			onFocus={(event) => {
				setTempValue(event.currentTarget.value)
			}}
			onBlur={() => {
				if (tempValue) {
					startTransition(async () => {
						await onSubmitValue(tempValue)
						setTempValue(undefined)
					})
				}
			}}
			onKeyDown={(event) => {
				if (event.key === "Enter" && tempValue) {
					event.preventDefault()
					startTransition(async () => {
						await onSubmitValue(tempValue)
						setTempValue(undefined)
					})
					event.currentTarget.blur()
				}
			}}
			onChange={(event) => {
				if (tempValue != null) {
					setTempValue(event.currentTarget.value)
				} else {
					props.onChange?.(event)
				}
			}}
		/>
	)
}

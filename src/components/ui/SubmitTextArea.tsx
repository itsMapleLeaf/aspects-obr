import { startTransition, useState, type ComponentProps } from "react"

export function SubmitTextArea({
	onSubmitValue,
	...props
}: ComponentProps<"textarea"> & {
	onSubmitValue?: (value: string) => unknown
}) {
	const [tempValue, setTempValue] = useState<string>()
	return (
		<textarea
			{...props}
			value={tempValue ?? props.value}
			onFocus={(event) => {
				setTempValue(event.currentTarget.value)
			}}
			onBlur={() => {
				if (tempValue) {
					startTransition(async () => {
						await onSubmitValue?.(tempValue)
						setTempValue(undefined)
					})
				}
			}}
			onKeyDown={(event) => {
				if (
					event.key === "Enter" &&
					(event.shiftKey || event.ctrlKey) &&
					tempValue
				) {
					event.preventDefault()
					startTransition(async () => {
						await onSubmitValue?.(tempValue)
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

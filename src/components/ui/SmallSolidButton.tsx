import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { SolidButton } from "./SolidButton.tsx"

export function SmallSolidButton(props: ComponentProps<typeof SolidButton>) {
	return (
		<SolidButton
			{...props}
			className={twMerge("px-2 py-1 text-sm", props.className)}
		/>
	)
}

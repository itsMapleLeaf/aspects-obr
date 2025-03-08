import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { SolidButton } from "./SolidButton.tsx"

export function SmallSolidButton(props: ComponentProps<typeof SolidButton>) {
	return (
		<SolidButton
			{...props}
			className={twMerge("h-7 px-2 pt-0.5 text-sm", props.className)}
		/>
	)
}

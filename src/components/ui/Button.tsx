import * as Ariakit from "@ariakit/react"
import { omit } from "es-toolkit"
import { type ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "~/components/ui/Icon.tsx"

const appearanceClasses = {
	default: twMerge(
		"bg-primary-950/75 backdrop-blur-md border-primary-500 hover:bg-primary-500/30 focus:ring-primary-500/50",
	),
	ghost: twMerge(
		"border-transparent opacity-75 hover:bg-gray-500/30 hover:opacity-100 focus:ring-gray-500/50",
	),
} as const

const sizeClasses = {
	sm: { button: "px-2 py-1 text-sm gap-2", icon: "*:size-3 -mx-0.5" },
	default: { button: "px-3 py-2 text-base gap-2.5", icon: "*:size-4 -mx-1" },
	lg: { button: "px-5 py-2 text-lg gap-3.5", icon: "*:size-5 -mx-1.5" },
} as const

const shapeClasses = {
	default: "rounded-md",
	circle: "rounded-full aspect-square",
}

export interface ButtonProps extends Ariakit.ButtonProps {
	appearance?: keyof typeof appearanceClasses
	size?: keyof typeof sizeClasses
	shape?: keyof typeof shapeClasses
	icon?: ReactNode
	as?: "button" | "link"
	pending?: boolean
}

export function Button({
	appearance = "default",
	size = "default",
	shape = "default",
	icon,
	className = "",
	children,
	pending,
	...props
}: ButtonProps) {
	const combinedClasses = `
		flex items-center transition border font-medium shadow-sm focus:outline-none focus:ring-2
		${appearanceClasses[appearance]}
		${sizeClasses[size].button}
		${shapeClasses[shape]}
		${className}
	`

	const content = (
		<>
			<div className={`${sizeClasses[size].icon} empty:hidden`}>
				{pending ? (
					<Icon icon="mingcute:loading-3-fill" className="animate-spin" />
				) : (
					icon
				)}
			</div>
			{children}
		</>
	)

	return (
		<Ariakit.Button
			className={combinedClasses}
			type="button"
			{...omit(props, ["as"])}
		>
			{content}
		</Ariakit.Button>
	)
}

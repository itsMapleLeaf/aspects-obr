import * as Ariakit from "@ariakit/react"
import { twMerge } from "tailwind-merge"
import { Tooltip } from "./Tooltip.tsx"

export interface SquareIconButtonProps extends Ariakit.ButtonProps {
	icon: React.ReactNode
	size?: "default" | "sm"
}

export function SquareIconButton({
	icon,
	children,
	size = "default",
	...props
}: SquareIconButtonProps) {
	const sizeClasses = {
		default: {
			wrapper: twMerge("w-10 aspect-square"),
			icon: twMerge("size-5"),
		},
		sm: {
			wrapper: twMerge("w-7 h-7 aspect-square"),
			icon: twMerge("size-4"),
		},
	}[size]

	return (
		<Tooltip content={children}>
			<Ariakit.Button
				type="button"
				{...props}
				className={twMerge(
					sizeClasses.wrapper,
					"button-ghost aspect-square justify-center p-0",
					props.className,
				)}
			>
				<span className={twMerge(sizeClasses.icon, "*:size-full")}>{icon}</span>
				<span className="sr-only">{children}</span>
			</Ariakit.Button>
		</Tooltip>
	)
}

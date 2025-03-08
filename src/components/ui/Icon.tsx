import { Icon as BaseIcon, type IconProps } from "@iconify/react"
import { twMerge } from "tailwind-merge"

export function Icon({ className, ...props }: IconProps) {
	return (
		<span
			aria-hidden
			className={twMerge("block h-4 w-4 *:size-full", className)}
		>
			<BaseIcon {...props} className="animate-in fade-in" />
		</span>
	)
}

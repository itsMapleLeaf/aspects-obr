import type { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function IconLabel({
	icon,
	children,
	className,
	...props
}: ComponentProps<"span"> & { icon: ReactNode; children: ReactNode }) {
	return (
		<span
			className={twMerge("flex items-center gap-1 text-sm", className)}
			{...props}
		>
			<span className="block leading-none">{icon}</span>
			<span>{children}</span>
		</span>
	)
}

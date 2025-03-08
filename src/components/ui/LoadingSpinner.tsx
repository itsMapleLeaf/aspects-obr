import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "~/components/ui/Icon.tsx"

export interface LoadingSpinnerProps
	extends Partial<ComponentProps<typeof Icon>> {}

export function LoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
	return (
		<Icon
			icon="mingcute:loading-3-fill"
			className={twMerge("size-16 animate-spin", className)}
			{...props}
		/>
	)
}

import * as Ariakit from "@ariakit/react"
import { type ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export interface TooltipProps
	extends Omit<Ariakit.TooltipAnchorProps, "content"> {
	content: ReactNode
	placement?: Ariakit.TooltipStoreProps["placement"]
	className?: string
}

export function Tooltip({
	placement,
	content,
	className,
	children,
}: TooltipProps) {
	const tooltip = Ariakit.useTooltipStore({ placement })

	return (
		<>
			<Ariakit.TooltipAnchor
				store={tooltip}
				className={twMerge(
					"focus-visible:ring-primary-400 inline-block rounded-md focus-visible:ring-2 focus-visible:outline-none",
					className,
				)}
			>
				{children}
			</Ariakit.TooltipAnchor>
			<Ariakit.Tooltip
				store={tooltip}
				gutter={8}
				portal
				unmountOnHide
				fixed
				className="max-w-sm translate-y-1 rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 shadow transition duration-200 data-[enter]:translate-y-0 data-[enter]:opacity-100 data-[leave]:translate-y-1 data-[leave]:opacity-0 dark:bg-gray-700"
			>
				{content}
			</Ariakit.Tooltip>
			<p className="sr-only">{content}</p>
		</>
	)
}

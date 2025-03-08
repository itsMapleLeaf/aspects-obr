import * as Ariakit from "@ariakit/react"
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function SolidButton(props: ComponentProps<"button">) {
	return (
		<Ariakit.Button
			type="button"
			{...props}
			className={twMerge(
				"hover:text-primary-200 flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-start transition hover:border-gray-700",
				props.className,
			)}
		/>
	)
}

import { type ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

interface CardProps extends ComponentProps<"div"> {
	title?: string
	subtitle?: string
}

export function Card({
	title,
	subtitle,
	children,
	className = "",
	...props
}: CardProps) {
	return (
		<div
			className={twMerge(
				`overflow-clip rounded-lg border border-gray-800 bg-gray-900 shadow`,
				className,
			)}
			{...props}
		>
			{(title || subtitle) && (
				<div className="">
					{title && (
						<h3 className="mb-3 text-3xl font-light text-gray-100">{title}</h3>
					)}
					{subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
				</div>
			)}
			<div className="">{children}</div>
		</div>
	)
}

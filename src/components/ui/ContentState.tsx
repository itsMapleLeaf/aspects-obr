import { Heading, HeadingLevel } from "@ariakit/react"
import type { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "./Icon.tsx"
import { LoadingSpinner } from "./LoadingSpinner.tsx"

export interface ContentStateProps extends ComponentProps<"div"> {
	icon: ReactNode
	heading: ReactNode
}

export function ContentState({
	icon,
	heading,
	children,
	className,
	...props
}: ContentStateProps) {
	return (
		<HeadingLevel>
			<section
				className={twMerge(
					"flex flex-col items-center py-16 text-center",
					className,
				)}
				{...props}
			>
				<div aria-hidden className="text-primary-300/40 mb-2 *:size-16">
					{icon}
				</div>
				<Heading className="heading-xl mb-4 text-balance">{heading}</Heading>
				{children}
			</section>
		</HeadingLevel>
	)
}

ContentState.Loading = LoadingState
function LoadingState(props: Partial<ContentStateProps>) {
	return (
		<ContentState icon={<LoadingSpinner />} heading="Loading..." {...props} />
	)
}

ContentState.Empty = EmptyState
function EmptyState(props: Partial<ContentStateProps>) {
	return (
		<ContentState
			icon={<Icon icon="mingcute:empty-box-line" />}
			heading="Sorry, nothing here."
			{...props}
		/>
	)
}

ContentState.Empty = ErrorState
function ErrorState(props: Partial<ContentStateProps>) {
	return (
		<ContentState
			icon={<Icon icon="mingcute:warning-line" />}
			heading="Sorry, nothing here."
			{...props}
		/>
	)
}

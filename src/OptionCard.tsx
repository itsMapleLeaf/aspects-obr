import { type ComponentProps, type ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "~/components/ui/Icon.tsx"

export function OptionCard({
	type,
	label,
	description,
	className,
	checked,
	onChange,
	...props
}: ComponentProps<"label"> & {
	type: "checkbox" | "radio"
	label: ReactNode
	description: string | string[]
	checked: boolean | undefined
	onChange: () => void
}) {
	return (
		<label
			className={twMerge(
				"has-checked:bg-primary-dark has-checked:border-primary-900/75 has-checked:hover:border-primary-900 flex flex-col justify-evenly rounded border border-gray-800 bg-gray-900 px-2 py-1.5 transition-colors select-none hover:border-gray-700",
				className,
			)}
			{...props}
		>
			<input
				type={type}
				className="sr-only"
				checked={checked}
				onChange={(event) => {
					event.currentTarget.blur()
					onChange()
				}}
			/>
			<header
				className="group flex items-center gap-1.5"
				data-checked={checked}
			>
				<h3 className="heading-xl min-w-0 flex-1 truncate text-lg">{label}</h3>
				<Icon
					icon="mingcute:check-circle-fill"
					className="text-primary-200/50 shrink-0 opacity-0 transition-opacity group-data-[checked=true]:opacity-100"
				/>
			</header>
			<p className="text-sm text-gray-400">
				{Array.isArray(description)
					? description.map((line, index) => (
							<span key={index} className="block">
								{line}
								{index < description.length - 1 && <br />}
							</span>
						))
					: description}
			</p>
		</label>
	)
}

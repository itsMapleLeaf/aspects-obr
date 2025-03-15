import { type ComponentProps, type ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "~/components/ui/Icon.tsx"

export function OptionCard({
	type,
	label,
	description,
	aside,
	className,
	checked,
	onChange,
	...props
}: ComponentProps<"label"> & {
	type: "checkbox" | "radio"
	label: ReactNode
	description: string | string[]
	aside?: string | string[]
	checked: boolean | undefined
	onChange: () => void
}) {
	return (
		<label
			className={twMerge(
				"flex flex-col justify-evenly gap-1.5",
				"rounded select-none",
				"border border-gray-800 bg-gray-900 hover:border-gray-700",
				"px-2 py-1.5 transition-colors",
				"has-checked:bg-primary-dark has-checked:border-primary-900/75 has-checked:hover:border-primary-900",
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
				<h3 className="heading-xl min-w-0 flex-1 truncate">{label}</h3>
				<Icon
					icon="mingcute:check-circle-fill"
					className="text-primary-200/50 shrink-0 opacity-0 transition-opacity group-data-[checked=true]:opacity-100"
				/>
			</header>

			<p className="text-[15px]">
				{Array.isArray(description)
					? description.map((line, index) => (
							<span key={index} className="block">
								{line}
								{index < description.length - 1 && <br />}
							</span>
						))
					: description}
			</p>

			{aside && (
				<p className="text-sm text-gray-300 italic">
					{Array.isArray(aside)
						? aside.map((line, index) => (
								<span key={index} className="block">
									{line}
									{index < aside.length - 1 && <br />}
								</span>
							))
						: aside}
				</p>
			)}
		</label>
	)
}

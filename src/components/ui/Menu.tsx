import * as Ariakit from "@ariakit/react"
import { twMerge } from "tailwind-merge"

export function Menu(props: Ariakit.MenuProviderProps) {
	return <Ariakit.MenuProvider placement="bottom-end" {...props} />
}

export function MenuButton(props: Ariakit.MenuButtonProps) {
	return <Ariakit.MenuButton {...props} />
}

export function MenuPanel({ className, ...props }: Ariakit.MenuProps) {
	return (
		<Ariakit.Menu
			className={twMerge("menu-panel", className)}
			portal
			gutter={8}
			unmountOnHide
			{...props}
		/>
	)
}

export function MenuItem({ className, ...props }: Ariakit.MenuItemProps) {
	return (
		<Ariakit.MenuItem className={twMerge("menu-item", className)} {...props} />
	)
}

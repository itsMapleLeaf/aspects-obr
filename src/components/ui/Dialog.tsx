import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import type { Except } from "type-fest"
import { Icon } from "~/components/ui/Icon"

export function Dialog(props: Ariakit.DialogProviderProps) {
	return <Ariakit.DialogProvider {...props} />
}

export function DialogButton(props: Ariakit.DialogDisclosureProps) {
	return <Ariakit.DialogDisclosure {...props} />
}

export interface DialogPanelProps extends Except<Ariakit.DialogProps, "title"> {
	title: ReactNode
}

export function DialogPanel({ children, title, ...props }: DialogPanelProps) {
	return (
		<Ariakit.Dialog
			portal
			unmountOnHide
			backdrop={
				<div className="fixed inset-0 bg-black/50 opacity-0 backdrop-blur-sm transition data-enter:opacity-100" />
			}
			className="fixed top-1/2 left-1/2 flex h-dvh max-h-[720px] w-dvw max-w-xl -translate-x-1/2 -translate-y-1/2 scale-95 flex-col gap-4 rounded-lg border border-gray-800 bg-gray-950 p-4 opacity-0 shadow-lg transition data-enter:scale-100 data-enter:opacity-100"
			{...props}
		>
			<header className="flex items-center justify-between">
				<Ariakit.DialogHeading className="heading-2xl">
					{title}
				</Ariakit.DialogHeading>
				<Ariakit.DialogDismiss className="hover:text-primary-300 rounded p-1 transition">
					<Icon icon="mingcute:close-fill" className="size-6" />
				</Ariakit.DialogDismiss>
			</header>
			{children}
		</Ariakit.Dialog>
	)
}

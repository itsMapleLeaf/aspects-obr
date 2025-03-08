import type { ComponentProps } from "react"

export function ExternalLink(props: ComponentProps<"a"> & { href: string }) {
	return <a target="_blank" rel="noopener noreferrer" {...props} />
}

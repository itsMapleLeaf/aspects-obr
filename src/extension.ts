export const owlbearExtensionNamespace = "dev.mapleleaf.aspects"

export function getOwlbearExtensionNamespaceKey(key: string) {
	return `${owlbearExtensionNamespace}/${key}`
}

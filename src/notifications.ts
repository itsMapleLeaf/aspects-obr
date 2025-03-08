import OBR from "@owlbear-rodeo/sdk"
import { getOwlbearExtensionNamespaceKey } from "./extension"

const broadcastNotificationChannel =
	getOwlbearExtensionNamespaceKey("notification")

OBR.onReady(() => {
	OBR.broadcast.onMessage(broadcastNotificationChannel, (event) => {
		const { text, variant } = event.data as {
			text: string
			variant: "SUCCESS" | "DEFAULT"
		}
		OBR.notification.show(text, variant)
	})
})

export function broadcastNotification(payload: {
	text: string
	variant: "SUCCESS" | "DEFAULT"
}) {
	OBR.notification.show(payload.text, payload.variant)
	return OBR.broadcast.sendMessage(broadcastNotificationChannel, payload)
}

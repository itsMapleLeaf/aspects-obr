import OBR, { Player } from "@owlbear-rodeo/sdk"
import { useEffect, useState } from "react"

export function usePlayer() {
	const [player, setPlayer] = useState<Player>()

	useEffect(() => {
		void (async () => {
			// force a no-op change to the player so the onChange callback runs
			// there is no other way to reliably get the full self player object
			const name = await OBR.player.getName()
			await OBR.player.setName(name + " ")
			await OBR.player.setName(name)
		})()
	}, [])

	useEffect(() => {
		return OBR.player.onChange(setPlayer)
	}, [])

	return player
}

export function usePartyPlayers() {
	const [players, setPlayers] = useState<Player[]>([])

	useEffect(() => {
		OBR.party.getPlayers().then(setPlayers)
	}, [])

	useEffect(() => {
		return OBR.party.onChange(setPlayers)
	}, [])

	return players
}

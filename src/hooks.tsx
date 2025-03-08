import OBR, { Player } from "@owlbear-rodeo/sdk"
import { uniqBy } from "es-toolkit"
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
		function handleChange(players: Player[]) {
			// players might have multiple connections, making them show up several times
			setPlayers(uniqBy(players, (p) => p.id))
		}
		OBR.party.getPlayers().then(handleChange)
		return OBR.party.onChange(handleChange)
	}, [])

	return players
}

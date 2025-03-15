import { type } from "arktype"

export type Character = typeof Character.inferOut
export const Character = type({
	"id": "string = ''",
	"name": "string = ''",
	"level": "number = 1",
	"hits": "number = 0",
	"fatigue": "number = 0",
	"lineages?": "string[]",
	"personas?": "string[]",
	"details?": "string",
	"attributeScores?": "Record<string, number>",
	"ownerId?": "string",
	"imageUrl": "(string | null)?",
	"selectedAspectSkills?": "string[]",
})

export function createCharacter(name: string): Character {
	return {
		id: crypto.randomUUID(),
		name,
		level: 1,
		hits: 0,
		fatigue: 0,
	}
}

export interface ComputedCharacter {
	strength: number
	sense: number
	dexterity: number
	intellect: number
	presence: number
	maxHits: number
	maxFatigue: number
}

export function getComputedCharacter(character: Character): ComputedCharacter {
	const attributeScores = character.attributeScores || {}

	const stats = {
		strength: attributeScores.strength ?? 1,
		sense: attributeScores.sense ?? 1,
		dexterity: attributeScores.dexterity ?? 1,
		intellect: attributeScores.intellect ?? 1,
		presence: attributeScores.presence ?? 1,
	}

	const maxHits = stats.strength + stats.dexterity + 3
	const maxFatigue = stats.sense + stats.intellect + stats.presence

	return { ...stats, maxHits, maxFatigue }
}

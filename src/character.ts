import { type } from "arktype"
import { aspects, attributes, experiences, lineages, roles } from "./data.ts"

export type CustomExperience = typeof CustomExperience.inferOut
export const CustomExperience = type({
	description: "string",
	attributeIds: "string[]",
	aspectId: "string",
})

export type Character = typeof Character.inferOut
export const Character = type({
	"id": "string = ''",
	"name": "string = ''",
	"level": "number = 1",
	"hits": "number = 0",
	"fatigue": "number = 0",
	"comeback": "number = 0",
	"lineages?": "string[]",
	"role?": "string | null",
	"drive?": "string | null",
	"experiences?": "string[]",
	"customExperiences?": CustomExperience.array(),
	"strengthBonus": "number = 0",
	"senseBonus": "number = 0",
	"dexterityBonus": "number = 0",
	"presenceBonus": "number = 0",
	"fireBonus": "number = 0",
	"waterBonus": "number = 0",
	"windBonus": "number = 0",
	"lightBonus": "number = 0",
	"darknessBonus": "number = 0",
	"ownerId?": "string",
})

export function createCharacter(name: string): Character {
	return {
		id: crypto.randomUUID(),
		name,
		level: 1,
		hits: 0,
		fatigue: 0,
		comeback: 0,
		customExperiences: [],
		strengthBonus: 0,
		senseBonus: 0,
		dexterityBonus: 0,
		presenceBonus: 0,
		fireBonus: 0,
		waterBonus: 0,
		windBonus: 0,
		lightBonus: 0,
		darknessBonus: 0,
	}
}

export interface ComputedCharacter {
	strength: number
	sense: number
	dexterity: number
	presence: number
	fire: number
	water: number
	wind: number
	light: number
	darkness: number
	maxHits: number
	maxFatigue: number
}

export function getComputedCharacter(character: Character): ComputedCharacter {
	const stats = {
		strength: 1 + character.strengthBonus,
		sense: 1 + character.senseBonus,
		dexterity: 1 + character.dexterityBonus,
		presence: 1 + character.presenceBonus,
		fire: 0 + character.fireBonus,
		water: 0 + character.waterBonus,
		wind: 0 + character.windBonus,
		light: 0 + character.lightBonus,
		darkness: 0 + character.darknessBonus,
	}

	const characterLineages = character.lineages ?? []
	for (const lineageName of characterLineages) {
		const lineage = lineages.find((l) => l.name === lineageName)
		if (lineage) {
			for (const aspect of lineage.aspects) {
				stats[aspect.name.toLowerCase() as keyof typeof stats] +=
					2 / characterLineages.length
			}
		}
	}

	if (character.role) {
		const selectedRole = roles[character.role as keyof typeof roles]
		if (selectedRole) {
			const attrName = selectedRole.attribute.name.toLowerCase()
			stats[attrName as keyof typeof stats] += 2
		}
	}

	if (character.experiences) {
		for (const expId of character.experiences) {
			const exp = experiences[expId as keyof typeof experiences]
			if (exp) {
				const attrName = exp.attribute.name.toLowerCase()
				stats[attrName as keyof typeof stats] += 2

				if (exp.aspects.length === 1) {
					const aspectName = exp.aspects[0]!.name.toLowerCase()
					stats[aspectName as keyof typeof stats] += 2
				} else if (exp.aspects.length === 2) {
					for (const aspect of exp.aspects) {
						const aspectName = aspect.name.toLowerCase()
						stats[aspectName as keyof typeof stats] += 1
					}
				}
			}
		}
	}

	if (character.customExperiences) {
		for (const experience of character.customExperiences) {
			for (const attributeId of experience.attributeIds) {
				const attribute = attributes[attributeId as keyof typeof attributes]
				if (!attribute) continue

				const attributeName = attribute.name.toLowerCase()
				stats[attributeName as keyof typeof stats] += 1
			}

			if (!experience.aspectId) continue

			const aspect = aspects[experience.aspectId as keyof typeof aspects]
			if (!aspect) continue

			const aspectName = aspect.name.toLowerCase()
			stats[aspectName as keyof typeof stats] += 2
		}
	}

	const maxHits = stats.strength + stats.dexterity + 3
	const maxFatigue = stats.sense + stats.presence

	return { ...stats, maxHits, maxFatigue }
}

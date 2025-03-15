import { type } from "arktype"
import {
	ASPECT_ACTIONS_COUNT,
	ASPECT_ATTRIBUTE_MIN,
	ASPECT_ATTRIBUTE_POINTS,
	aspects,
	aspectSkills,
	attributes,
	CORE_ATTRIBUTE_MIN,
	CORE_ATTRIBUTE_POINTS,
	lineages,
	MAX_ATTRIBUTE_VALUE,
	personas,
} from "./data.ts"

export type Character = typeof Character.inferOut
export const Character = type({
	"id": "string = ''",
	"name": "string = ''",
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

/** Helper function to get random indices with Fisher-Yates shuffle */
function getRandomIndices(max: number, count: number): number[] {
	const indices = Array.from({ length: max }, (_, i) => i)

	for (let i = indices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = indices[i]
		if (temp !== undefined && indices[j] !== undefined) {
			indices[i] = indices[j]
			indices[j] = temp
		}
	}

	return indices.slice(0, Math.min(count, indices.length))
}

/** Helper function to distribute random points */
function distributeRandomPoints(
	allKeys: string[],
	totalPoints: number,
	minValue: number,
	maxValue: number,
	activeKeys: string[],
): Record<string, number> {
	const result: Record<string, number> = {}

	// Initialize all keys to 0
	for (const key of allKeys) {
		result[key] = ASPECT_ATTRIBUTE_MIN
	}

	// First, assign minimum value to each active key
	let remainingPoints = totalPoints
	for (const key of activeKeys) {
		result[key] = minValue
		remainingPoints -= minValue
	}

	// Then, distribute remaining points randomly
	while (remainingPoints > 0) {
		const randomKeyIndex = Math.floor(Math.random() * activeKeys.length)
		const randomKey = activeKeys[randomKeyIndex]

		if (
			randomKey !== undefined &&
			result[randomKey] !== undefined &&
			result[randomKey] < maxValue
		) {
			result[randomKey]++
			remainingPoints--
		}
	}

	return result
}

export function randomizeCharacter(): Partial<Character> {
	// Generate random core attributes (1-5) that sum to CORE_ATTRIBUTE_POINTS
	const coreKeys = Object.keys(attributes)
	const randomCoreAttributes = distributeRandomPoints(
		coreKeys,
		CORE_ATTRIBUTE_POINTS,
		CORE_ATTRIBUTE_MIN,
		MAX_ATTRIBUTE_VALUE,
		coreKeys,
	)

	// Choose 2-3 random aspects and assign values (1-5) that sum to ASPECT_ATTRIBUTE_POINTS
	const aspectKeys = Object.keys(aspects)
	const aspectCount = Math.random() < 0.5 ? 2 : 3
	const selectedAspectIndices = getRandomIndices(aspectKeys.length, aspectCount)

	const selectedAspectKeys: string[] = []
	for (const index of selectedAspectIndices) {
		const key = aspectKeys[index]
		if (key !== undefined) {
			selectedAspectKeys.push(key)
		}
	}

	const randomAspectAttributes = distributeRandomPoints(
		aspectKeys,
		ASPECT_ATTRIBUTE_POINTS,
		1,
		MAX_ATTRIBUTE_VALUE,
		selectedAspectKeys,
	)

	// Choose random lineage (1)
	const randomLineageIndex = Math.floor(Math.random() * lineages.length)
	const lineage = lineages[randomLineageIndex]
	const randomLineage = lineage ? [lineage.name] : []

	// Choose random persona (1)
	const randomPersonaIndex = Math.floor(Math.random() * personas.length)
	const persona = personas[randomPersonaIndex]
	const randomPersona = persona ? [persona.name] : []

	// Choose aspect actions, but only for non-zero aspect stats
	const aspectWithValues = Object.entries(randomAspectAttributes)
		.filter(([, value]) => value > 0)
		.map(([key]) => key)

	// Map keys to aspect names for filtering skills
	const aspectNamesWithValues: string[] = []
	for (const key of aspectWithValues) {
		const aspectKey = key as keyof typeof aspects
		const aspect = aspects[aspectKey]
		if (aspect) {
			aspectNamesWithValues.push(aspect.name.toLowerCase())
		}
	}

	// Filter for eligible skills (only from aspects with values, and with effects)
	const eligibleSkills = aspectSkills.filter(
		(skill) =>
			skill.effect &&
			skill.aspect &&
			aspectNamesWithValues.includes(skill.aspect.name.toLowerCase()),
	)

	// Determine number of skills to select (min of available skills or required count)
	const skillCount = Math.min(eligibleSkills.length, ASPECT_ACTIONS_COUNT)
	const randomActionIndices = getRandomIndices(
		eligibleSkills.length,
		skillCount,
	)

	const randomActions: string[] = []
	for (const index of randomActionIndices) {
		const skill = eligibleSkills[index]
		if (skill?.name) {
			randomActions.push(skill.name)
		}
	}

	return {
		attributeScores: {
			...randomCoreAttributes,
			...randomAspectAttributes,
		},
		lineages: randomLineage,
		personas: randomPersona,
		selectedAspectSkills: randomActions,
	}
}

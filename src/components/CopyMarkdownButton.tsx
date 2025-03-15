import { useState } from "react"
import { Character, getComputedCharacter } from "../character.ts"
import { aspectSkills, lineages, personas } from "../data.ts"
import { Icon } from "./ui/Icon.tsx"
import { SolidButton } from "./ui/SolidButton.tsx"

function formatCharacterAsMarkdown(character: Character): string {
	const computed = getComputedCharacter(character)
	const attributeScores = character.attributeScores || {}

	const characterPersonas = character.personas || []
	const personaDetails = characterPersonas
		.map((personaName) => {
			const persona = personas.find((p) => p.name === personaName)
			return persona ? `## Persona: ${persona.name}\n\n${persona.ability}` : ""
		})
		.join("\n\n")

	const characterLineages = character.lineages || []
	const lineageDetails = characterLineages
		.map((lineageName) => {
			const lineage = lineages.find((l) => l.name === lineageName)
			if (!lineage) return ""

			return `## Lineage: ${lineage.name}\n\n${lineage.ability}`
		})
		.join("\n\n")

	const selectedSkills = character.selectedAspectSkills || []
	const actionDetails = selectedSkills
		.map((skillName) => {
			const skill = aspectSkills.find((s) => s.name === skillName)
			if (!skill) return skillName
			return `- **${skill.name}**: ${skill.description}\n  ${skill.effect ? `Effect: ${skill.effect}` : ""}`
		})
		.join("\n")

	return `# ${character.name || "Unnamed Character"}

Level: 1

Hits: ${character.hits} / ${computed.maxHits}
Fatigue: ${character.fatigue} / ${computed.maxFatigue}

## Core Attributes

Strength: ${computed.strength}
Sense: ${computed.sense}
Dexterity: ${computed.dexterity}
Intellect: ${computed.intellect}
Presence: ${computed.presence}

## Aspect Attributes

Fire: ${attributeScores.fire || 0}
Water: ${attributeScores.water || 0}
Wind: ${attributeScores.wind || 0}
Light: ${attributeScores.light || 0}
Darkness: ${attributeScores.darkness || 0}

## Aspect Actions

${actionDetails || "(No aspect actions selected)"}

${personaDetails || "## Persona: (none)\n\n(No persona selected)"}

${lineageDetails || "## Lineage: (none)\n\n(No lineage selected)"}

## Background

${character.details || "(No background details)"}
`
}

export function CopyMarkdownButton({ character }: { character: Character }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		const markdown = formatCharacterAsMarkdown(character)
		try {
			await navigator.clipboard.writeText(markdown)
			setCopied(true)
			setTimeout(() => {
				setCopied(false)
			}, 1000)
		} catch (err) {
			console.error("Failed to copy character sheet:", err)
			alert("Failed to copy character sheet")
		}
	}

	return (
		<SolidButton
			onClick={handleCopy}
			className="mt-2"
			title="Copy character sheet as markdown"
			disabled={copied}
		>
			{copied ? (
				<>
					<Icon icon="mingcute:check-fill" className="size-4" /> Copied!
				</>
			) : (
				<>
					<Icon icon="mingcute:copy-2-line" className="size-4" /> Copy as
					Markdown
				</>
			)}
		</SolidButton>
	)
}

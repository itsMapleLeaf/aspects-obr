import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createCharacter } from "../character"
import { CharacterEditor } from "./CharacterEditor"

// Mock the OBR hooks
vi.mock("../hooks/obr", () => ({
	usePartyPlayers: vi.fn().mockReturnValue([]),
	usePlayer: vi.fn().mockReturnValue({
		id: "player-id",
		name: "Test Player",
		role: "PLAYER",
	}),
}))

describe("CharacterEditor", () => {
	const mockOnUpdate = vi.fn()
	const mockOnRollAction = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("shows validation errors for invalid attribute distributions", () => {
		// Create character with empty attributes
		const invalidCharacter = createCharacter("Test Character")

		// Ensure default values are set for a fresh character
		// To mimic what happens in the component when it defaults values
		invalidCharacter.attributeScores = {
			// Core attributes must start at 1
			strength: 1,
			sense: 1,
			dexterity: 1,
			intellect: 1,
			presence: 1,
			// Aspect attributes can stay at 0
			fire: 0,
			water: 0,
			wind: 0,
			light: 0,
			darkness: 0,
		}

		render(
			<CharacterEditor
				character={invalidCharacter}
				onUpdate={mockOnUpdate}
				onRollAction={mockOnRollAction}
			/>,
		)

		// Core attributes heading should be red (invalid)
		const coreHeading = screen.getByText("Core Attributes")
		expect(coreHeading).toHaveClass("text-red-300")

		// Should show validation error message for core attributes
		expect(
			screen.getByText(/Assign exactly one of each: 1, 2, 2, 3, 5/),
		).toBeInTheDocument()

		// Aspect attributes heading should be red (invalid)
		const aspectHeading = screen.getByText("Aspect Attributes")
		expect(aspectHeading).toHaveClass("text-red-300")

		// Should show validation error message for aspect attributes
		expect(
			screen.getByText(/Assign exactly: 0, 0, 1, 2, 4 to aspect attributes/),
		).toBeInTheDocument()
	})

	it("doesn't show validation errors for valid attribute distributions", () => {
		// Create character with valid attribute distributions
		const validCharacter = createCharacter("Test Character")
		validCharacter.attributeScores = {
			// Core attributes with valid distribution [1, 2, 2, 3, 5]
			strength: 1,
			sense: 2,
			dexterity: 2,
			intellect: 3,
			presence: 5,
			// Aspect attributes with valid distribution [0, 0, 1, 2, 4]
			fire: 0,
			water: 0,
			wind: 1,
			light: 2,
			darkness: 4,
		}

		render(
			<CharacterEditor
				character={validCharacter}
				onUpdate={mockOnUpdate}
				onRollAction={mockOnRollAction}
			/>,
		)

		// Core attributes heading should not be red (valid)
		const coreHeading = screen.getByText("Core Attributes")
		expect(coreHeading).not.toHaveClass("text-red-300")

		// Should not show validation error message for core attributes
		expect(
			screen.queryByText(/Assign exactly one of each: 1, 2, 2, 3, 5/),
		).not.toBeInTheDocument()

		// Aspect attributes heading should not be red (valid)
		const aspectHeading = screen.getByText("Aspect Attributes")
		expect(aspectHeading).not.toHaveClass("text-red-300")

		// Should not show validation error message for aspect attributes
		expect(
			screen.queryByText(/Assign exactly: 0, 0, 1, 2, 4 to aspect attributes/),
		).not.toBeInTheDocument()
	})

	it("updates attribute scores when changing select values", async () => {
		// Create character with empty attributes
		const character = createCharacter("Test Character")

		render(
			<CharacterEditor
				character={character}
				onUpdate={mockOnUpdate}
				onRollAction={mockOnRollAction}
			/>,
		)

		// Setup user events
		const user = userEvent.setup()

		// Get all selects and change a core attribute
		const strengthSelect = screen.getAllByRole("combobox")[0]!
		await user.selectOptions(strengthSelect, "3")

		// Verify the update was called with the right value
		expect(mockOnUpdate).toHaveBeenCalledWith({
			attributeScores: { strength: 3 },
		})

		// Change an aspect attribute
		const fireSelect = screen.getAllByRole("combobox")[5]!
		await user.selectOptions(fireSelect, "4")

		// Verify the update was called with the right value
		expect(mockOnUpdate).toHaveBeenCalledWith({
			attributeScores: { fire: 4 },
		})
	})
})

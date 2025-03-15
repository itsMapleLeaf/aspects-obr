import "@testing-library/jest-dom"
import * as matchers from "@testing-library/jest-dom/matchers"
import { expect, vi } from "vitest"

expect.extend(matchers)

vi.mock("@owlbear-rodeo/sdk", () => ({
	default: {
		onReady: vi.fn().mockResolvedValue(undefined),
		room: {
			getMetadata: vi.fn().mockResolvedValue({}),
			onMetadataChanged: vi.fn().mockReturnValue(() => {}),
			setMetadata: vi.fn().mockResolvedValue(undefined),
		},
		player: {
			getMetadata: vi.fn().mockResolvedValue({}),
			onMetadataChanged: vi.fn().mockReturnValue(() => {}),
			setMetadata: vi.fn().mockResolvedValue(undefined),
			getId: vi.fn().mockReturnValue("player-id"),
			getRole: vi.fn().mockReturnValue("PLAYER"),
			getName: vi.fn().mockReturnValue("Test Player"),
		},
		party: {
			getPlayers: vi.fn().mockResolvedValue([]),
			onPlayersChanged: vi.fn().mockReturnValue(() => {}),
		},
		assets: {
			downloadImages: vi.fn().mockResolvedValue([]),
		},
	},
}))

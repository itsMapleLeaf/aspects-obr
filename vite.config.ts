import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [react(), tsconfigPaths(), tailwindcss()],
	server: {
		headers: {
			"Access-Control-Allow-Origin": "https://www.owlbear.rodeo",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		},
	},
})

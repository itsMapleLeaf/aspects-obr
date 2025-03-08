import "@fontsource-variable/quicksand/index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Root } from "./Root.tsx"
import "./styles/index.css"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Root />
	</StrictMode>,
)

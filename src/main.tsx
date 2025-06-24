import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
} else {
	throw new Error("Root element with id 'root' not found");
}

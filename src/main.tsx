
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx executing, mounting App");

// Ensure the app is properly mounted
const root = document.getElementById("root");
if (!root) {
  console.warn("Root element not found, creating one");
  const rootDiv = document.createElement("div");
  rootDiv.id = "root";
  document.body.appendChild(rootDiv);
}

// Create root and render app
const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

createRoot(rootElement!).render(<App />);
console.log("App mounted");

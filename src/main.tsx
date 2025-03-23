
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main script running...");

// Ensure the app is properly mounted
const root = document.getElementById("root");
if (!root) {
  console.log("Root element not found, creating one");
  const rootDiv = document.createElement("div");
  rootDiv.id = "root";
  document.body.appendChild(rootDiv);
}

console.log("Mounting React application");
createRoot(document.getElementById("root")!).render(<App />);
console.log("React application mounted");

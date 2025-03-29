
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as ReactDOMServer from 'react-dom/server'

// Make ReactDOMServer available globally for client-side rendering
// Using type assertion to avoid TypeScript errors
window.ReactDOMServer = ReactDOMServer as any;

// Ensure the app is properly mounted
const root = document.getElementById("root");
if (!root) {
  const rootDiv = document.createElement("div");
  rootDiv.id = "root";
  document.body.appendChild(rootDiv);
}

createRoot(document.getElementById("root")!).render(<App />);

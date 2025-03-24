
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// A simpler initialization approach
const root = document.getElementById("root");
if (!root) {
  const rootDiv = document.createElement("div");
  rootDiv.id = "root";
  document.body.appendChild(rootDiv);
}

// Remove StrictMode temporarily to rule out double-rendering issues
createRoot(document.getElementById("root")!).render(<App />);


import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as React from 'react'

// Ensure React is properly imported and available globally
window.React = React;

// Ensure the app is properly mounted
const root = document.getElementById("root");
if (!root) {
  const rootDiv = document.createElement("div");
  rootDiv.id = "root";
  document.body.appendChild(rootDiv);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

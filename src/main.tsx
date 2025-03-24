
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wait for DOM to be ready
const renderApp = () => {
  // Ensure the app is properly mounted
  const root = document.getElementById("root");
  if (!root) {
    const rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.appendChild(rootDiv);
  }

  try {
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Error rendering the app:", error);
    // Provide a fallback UI
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Something went wrong</h2>
          <p>The application couldn't be loaded. Please try refreshing the page.</p>
        </div>
      `;
    }
  }
};

// Check if document is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

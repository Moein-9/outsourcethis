
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wait for the DOM to be fully loaded before mounting React
document.addEventListener('DOMContentLoaded', () => {
  // Check if root exists, create it if not
  let rootElement = document.getElementById("root");
  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  }

  // Create root and render with a try-catch for better error handling
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error('Error rendering React application:', error);
    // Show a user-friendly error in the DOM if React fails to render
    if (rootElement) {
      rootElement.innerHTML = '<div style="padding: 20px; color: red;">An error occurred while loading the application. Please try refreshing the page.</div>';
    }
  }
});

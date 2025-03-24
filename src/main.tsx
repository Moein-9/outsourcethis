
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure the DOM is loaded before mounting
const rootElement = document.getElementById('root');
if (!rootElement) {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
}

// Create root with error handling
try {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering application:', error);
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Something went wrong</h2>
        <p>The application couldn't be loaded. Please try refreshing the page.</p>
      </div>
    `;
  }
}

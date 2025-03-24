
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simple and direct initialization approach to avoid potential issues
const rootElement = document.getElementById('root');

// Create root element if it doesn't exist
if (!rootElement) {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
}

// Use the newer ReactDOM.createRoot API with error handling
try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<App />);
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

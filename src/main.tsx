
import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure we have a root element
const rootElement = document.getElementById("root");

// If root element doesn't exist, create one
if (!rootElement) {
  const rootDiv = document.createElement("div");
  rootDiv.id = "root";
  document.body.appendChild(rootDiv);
}

// Get the root element again (in case it was just created)
const container = document.getElementById("root");

// Create root and render app
const root = ReactDOM.createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

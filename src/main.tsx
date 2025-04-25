import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initInventoryStore } from "@/store/inventoryStore";

// Initialize the frames data from Supabase
initInventoryStore().catch((error) =>
  console.error("Error initializing inventory:", error)
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

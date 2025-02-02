import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppAdmin from "./admin/AppAdmin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {window.location.pathname.startsWith("/admin") ? <AppAdmin /> : <App />}
  </StrictMode>
);

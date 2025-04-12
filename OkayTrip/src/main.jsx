import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AdminAppWrapper from "./admin/context/AdminWrapper.jsx"; // New wrapper component

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {window.location.pathname.startsWith("/admin") ? <AdminAppWrapper /> : <App />}
  </StrictMode>
);
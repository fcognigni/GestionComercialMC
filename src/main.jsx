import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";

const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input.url;
  const isApi = url.startsWith("https://localhost:7208/api/");
  const token = sessionStorage.getItem("gescom_token");
  const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
  if (isApi && token && !url.endsWith("/api/auth/login")) headers.set("Authorization", `Bearer ${token}`);
  const response = await originalFetch(input, { ...init, headers });
  if (isApi && response.status === 401 && !url.endsWith("/api/auth/login")) {
    sessionStorage.removeItem("gescom_token");
    sessionStorage.removeItem("gescom_usuario");
    window.dispatchEvent(new Event("gescom:session-expired"));
  }
  return response;
};

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
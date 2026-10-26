import { useState } from "react";
import "../Styles/Login.css";

const API_URL = "https://localhost:7208";

export default function LoginModal({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password })
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.mensaje || "No se pudo iniciar sesión.");
      sessionStorage.setItem("gescom_token", result.token);
      sessionStorage.setItem("gescom_usuario", result.usuario);
      onLogin(result.token);
    } catch (err) { setError(err.message || "No se pudo iniciar sesión."); }
    finally { setLoading(false); }
  };

  return <div className="login-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
    <form className="login-modal" onSubmit={handleSubmit}>
      <div className="login-mark">GC</div>
      <h1 id="login-title">GesCom</h1>
      <p>Ingresá para continuar a la gestión comercial.</p>
      <label>Usuario<input value={usuario} onChange={e => setUsuario(e.target.value)} autoComplete="username" required /></label>
      <label>Contraseña<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      {error && <div className="login-error">{error}</div>}
      <button type="submit" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</button>
    </form>
  </div>;
}
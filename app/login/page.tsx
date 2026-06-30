"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("⚠️ Completa todos los campos"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("https://backend-marketplace-85du.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "❌ Credenciales incorrectas"); return; }
      Cookies.set("token", data.token, { expires: 1 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
      router.push(data.user.rol === "ADMIN" ? "/admin" : "/");
    } catch {
      setError("❌ Error al conectar con el servidor");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🛍️</p>
          <h1 style={{
            fontSize: "1.8rem", fontWeight: 800,
            background: "linear-gradient(135deg, #d582d8, #ffaaff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Iniciar Sesión</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            Bienvenido de vuelta 👋
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.4)",
            borderRadius: "10px", padding: "12px", marginBottom: "1.5rem",
            color: "#c0392b", fontSize: "0.9rem", fontWeight: 600,
          }}>{error}</div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Email</label>
          <input className="input-field" type="email" placeholder="tu@email.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Contraseña</label>
          <input className="input-field" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={loading}
          style={{ width: "100%", padding: "14px", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}>
          {loading ? "⏳ Iniciando sesión..." : "Iniciar Sesión →"}
        </button>

        {/* Credenciales de prueba */}
        <div style={{
          marginTop: "1.5rem", padding: "1rem",
          background: "var(--input-bg)", border: "1px solid var(--card-border)",
          borderRadius: "10px", fontSize: "0.82rem",
        }}>
          <p style={{ color: "var(--text-muted)", fontWeight: 700, marginBottom: "6px" }}>🔑 Cuentas de prueba:</p>
          <p style={{ color: "var(--text-muted)" }}>👑 Admin: <strong style={{ color: "var(--text)" }}>admin@marketplace.com</strong> / <strong style={{ color: "var(--text)" }}>admin123</strong></p>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>👤 Cliente: <strong style={{ color: "var(--text)" }}>customer@marketplace.com</strong> / <strong style={{ color: "var(--text)" }}>customer123</strong></p>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/register" style={{ color: "#d582d8", fontWeight: 600, textDecoration: "none" }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
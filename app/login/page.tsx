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
    if (!form.email || !form.password) {
      setError("⚠️ Completa todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://backend-marketplace-85du.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "❌ Credenciales incorrectas");
        return;
      }
      Cookies.set("token", data.token, { expires: 1 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
      if (data.user.rol === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      setError("❌ Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🛍️</p>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #d582d8, #ffaaff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Iniciar Sesión
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            Bienvenido de vuelta
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(231,76,60,0.15)",
            border: "1px solid rgba(231,76,60,0.4)",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "1.5rem",
            color: "#e74c3c",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <input
            className="input-field"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
            Contraseña
          </label>
          <input
            className="input-field"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", padding: "14px", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/register" style={{ color: "#d582d8", fontWeight: 600, textDecoration: "none" }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
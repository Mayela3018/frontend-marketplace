"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setError("⚠️ Completa todos los campos");
      return;
    }
    if (form.password !== form.confirmar) {
      setError("⚠️ Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      setError("⚠️ La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://backend-marketplace-85du.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: "CUSTOMER",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "❌ Error al registrarse");
        return;
      }
      router.push("/login");
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
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✨</p>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #d582d8, #ffaaff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Crear Cuenta
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            Únete a MiniMarket
          </p>
        </div>

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

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
            Nombre completo
          </label>
          <input
            className="input-field"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

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

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
            Contraseña
          </label>
          <input
            className="input-field"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
            Confirmar contraseña
          </label>
          <input
            className="input-field"
            type="password"
            placeholder="Repite tu contraseña"
            value={form.confirmar}
            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleRegister}
          disabled={loading}
          style={{ width: "100%", padding: "14px", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Registrando..." : "Crear Cuenta →"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "#d582d8", fontWeight: 600, textDecoration: "none" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav style={{
      background: "linear-gradient(135deg, rgba(0,56,92,0.95), rgba(53,74,126,0.95))",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(213,130,216,0.3)",
      padding: "0 2rem",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "70px",
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #d582d8, #ffaaff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            🛍️ MiniMarket
          </span>
        </a>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <a href="/" style={{
            color: "rgba(255,255,255,0.85)",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "0.95rem",
          }}>
            Inicio
          </a>

          {user?.rol === "ADMIN" && (
            <a href="/admin" style={{
              background: "linear-gradient(135deg, #7963aa, #d582d8)",
              color: "white",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "8px 18px",
              borderRadius: "20px",
            }}>
              ⚙️ Admin
            </a>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(213,130,216,0.3)",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "0.85rem",
              }}>
                <span style={{ color: "#d582d8", fontWeight: 700 }}>
                  {user.rol === "ADMIN" ? "👑" : "👤"}
                </span>
                <span style={{ color: "rgba(255,255,255,0.8)", marginLeft: "6px" }}>
                  {user.nombre}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(231,76,60,0.2)",
                  border: "1px solid rgba(231,76,60,0.4)",
                  color: "#e74c3c",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <a href="/login" style={{
              background: "linear-gradient(135deg, #7963aa, #d582d8)",
              color: "white",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "8px 18px",
              borderRadius: "20px",
            }}>
              Iniciar sesión
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
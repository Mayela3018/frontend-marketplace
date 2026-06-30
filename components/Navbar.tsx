"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useCart } from "./LayoutClient";

interface User { id: number; nombre: string; email: string; rol: string; }

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { cart, setCartOpen } = useCart();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    const userData = Cookies.get("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav style={{
      background: "linear-gradient(135deg, rgba(60,20,100,0.97), rgba(90,40,140,0.97))",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(213,130,216,0.4)",
      padding: "0 2rem", position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontSize: "1.6rem", fontWeight: 800,
            background: "linear-gradient(135deg, #d582d8, #ffaaff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>🛍️ MiniMarket</span>
        </Link>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem" }}>
            Inicio
          </Link>

          {user?.rol === "ADMIN" && (
            <Link href="/admin" style={{
              background: "linear-gradient(135deg, #7963aa, #d582d8)",
              color: "white", textDecoration: "none", fontWeight: 600,
              fontSize: "0.9rem", padding: "8px 18px", borderRadius: "20px",
            }}>⚙️ Admin</Link>
          )}

          {/* Carrito */}
          <button onClick={() => setCartOpen(true)} style={{
            position: "relative", background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(213,130,216,0.4)", color: "white",
            padding: "8px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "1.1rem",
          }}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: "-6px", right: "-6px",
                background: "linear-gradient(135deg, #d582d8, #ffaaff)",
                color: "#1a0a2e", borderRadius: "50%",
                width: "20px", height: "20px", fontSize: "0.7rem",
                fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
              }}>{cartCount}</span>
            )}
          </button>

          {/* Toggle tema */}
          <button onClick={toggleTheme} style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(213,130,216,0.4)",
            color: "white", padding: "8px 12px", borderRadius: "20px",
            cursor: "pointer", fontSize: "1rem",
          }}>{theme === "dark" ? "☀️" : "🌙"}</button>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(213,130,216,0.3)",
                borderRadius: "20px", padding: "6px 14px", fontSize: "0.85rem",
              }}>
                <span style={{ color: "#d582d8", fontWeight: 700 }}>{user.rol === "ADMIN" ? "👑" : "👤"}</span>
                <span style={{ color: "rgba(255,255,255,0.85)", marginLeft: "6px" }}>{user.nombre}</span>
              </div>
              <button onClick={handleLogout} style={{
                background: "rgba(231,76,60,0.2)", border: "1px solid rgba(231,76,60,0.4)",
                color: "#e74c3c", padding: "6px 14px", borderRadius: "20px",
                cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
              }}>Salir</button>
            </div>
          ) : (
            <Link href="/login" style={{
              background: "linear-gradient(135deg, #7963aa, #d582d8)",
              color: "white", textDecoration: "none", fontWeight: 600,
              fontSize: "0.9rem", padding: "8px 18px", borderRadius: "20px",
            }}>Iniciar sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
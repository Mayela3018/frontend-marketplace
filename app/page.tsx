"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "./types/product";
import { useCart } from "../components/LayoutClient";

const API = "https://backend-marketplace-85du.onrender.com/api";
interface Category { id: number; nombre: string; }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const { addToCart } = useCart();

  // ✅ Primer useEffect: carga categorías y verifica login
  useEffect(() => {
    fetchCategories();
    setIsLoggedIn(document.cookie.includes("token"));
  }, []);

  // ✅ NUEVO useEffect: debounce de 400ms para búsqueda en tiempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400); // espera 400ms después de que el usuario deja de escribir
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ✅ useEffect de fetchProducts (se ejecuta cuando cambian categoría o search)
  useEffect(() => { fetchProducts(); }, [selectedCategory, search]);

  // ✅ NUEVO useEffect: resetea la página cuando cambian filtros
  useEffect(() => { setPage(1); }, [selectedCategory, search]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      setCategories(await res.json());
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("categoryId", String(selectedCategory));
      if (search) params.set("search", search);
      const res = await fetch(`${API}/products?${params}`);
      setProducts(await res.json());
    } catch {} finally { setLoading(false); }
  };

  // ❌ ELIMINADO: handleSearch (ya no se necesita)

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  // ✅ Lógica de paginación
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Hero */}
<div style={{
  textAlign: "center", padding: "4rem 1rem 3rem",
  position: "relative", overflow: "hidden",
}}>
  {/* Círculos decorativos de fondo */}
  <div style={{
    position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(213,130,216,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  }} />

  {/* Badge superior */}
  <div style={{
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "rgba(121,99,170,0.2)", border: "1px solid rgba(213,130,216,0.4)",
    borderRadius: "20px", padding: "6px 16px", fontSize: "0.85rem",
    color: "#d582d8", fontWeight: 600, marginBottom: "1.5rem",
  }}>
    ✨ Tu tienda de tecnología favorita
  </div>

  <h1 style={{
    fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.15,
    background: "linear-gradient(135deg, #7963aa, #d582d8, #ffaaff)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    marginBottom: "1rem",
  }}>
    🛍️ Bienvenido a<br />MiniMarket
  </h1>

  <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
    Encuentra los mejores productos tecnológicos al mejor precio. Rápido, seguro y sin complicaciones.
  </p>

  {/* Stats */}
  <div style={{
    display: "flex", justifyContent: "center", gap: "2rem",
    flexWrap: "wrap", marginBottom: "2.5rem",
  }}>
    {[
      { icon: "📦", value: "8+", label: "Productos" },
      { icon: "🏷️", value: "6", label: "Categorías" },
      { icon: "⚡", value: "24/7", label: "Disponible" },
      { icon: "🔒", value: "100%", label: "Seguro" },
    ].map(s => (
      <div key={s.label} style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.4rem", marginBottom: "2px" }}>{s.icon}</div>
        <div style={{
          fontWeight: 800, fontSize: "1.2rem",
          background: "linear-gradient(135deg, #d582d8, #ffaaff)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{s.value}</div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{s.label}</div>
      </div>
    ))}
  </div>

  {/* Features pills */}
  <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem", flexWrap: "wrap" }}>
    {["🚀 Envío rápido", "💳 Pago seguro", "↩️ Devoluciones", "🎧 Soporte 24/7"].map(f => (
      <span key={f} style={{
        background: "var(--input-bg)", border: "1px solid var(--card-border)",
        borderRadius: "20px", padding: "6px 14px",
        color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 500,
      }}>{f}</span>
    ))}
  </div>
</div>

{/* Banner login — solo para no logueados */}
{!isLoggedIn && (
  <div style={{
    background: "linear-gradient(135deg, rgba(121,99,170,0.25), rgba(213,130,216,0.2))",
    border: "1px solid rgba(213,130,216,0.35)",
    borderRadius: "20px", padding: "2rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: "1.5rem", marginBottom: "2.5rem",
    position: "relative", overflow: "hidden",
  }}>
    {/* Decoración */}
    <div style={{
      position: "absolute", right: "-30px", top: "-30px",
      width: "150px", height: "150px", borderRadius: "50%",
      background: "rgba(213,130,216,0.1)", pointerEvents: "none",
    }} />
    <div>
      <p style={{ color: "var(--text)", fontWeight: 800, fontSize: "1.15rem", marginBottom: "6px" }}>
        🎉 ¡Únete a MiniMarket hoy!
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
        Crea tu cuenta gratis y accede a ofertas exclusivas,<br />guarda tu carrito y mucho más.
      </p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
        {["✅ Gratis", "✅ Sin tarjeta", "✅ Acceso inmediato"].map(b => (
          <span key={b} style={{ color: "#7963aa", fontSize: "0.85rem", fontWeight: 600 }}>{b}</span>
        ))}
      </div>
    </div>
    <div style={{ display: "flex", gap: "0.8rem", flexShrink: 0 }}>
      <a href="/login" style={{
        background: "rgba(255,255,255,0.1)", border: "1px solid rgba(213,130,216,0.5)",
        color: "#d582d8", padding: "12px 24px", borderRadius: "20px",
        textDecoration: "none", fontWeight: 700, fontSize: "0.95rem",
        transition: "all 0.3s",
      }}>Registrarse</a>
      <a href="/login" style={{
        background: "linear-gradient(135deg, #7963aa, #d582d8)",
        color: "white", padding: "12px 24px", borderRadius: "20px",
        textDecoration: "none", fontWeight: 700, fontSize: "0.95rem",
        boxShadow: "0 4px 20px rgba(213,130,216,0.4)",
      }}>Iniciar sesión →</a>
    </div>
  </div>
)}
     

      {/* ✅ Búsqueda en tiempo real (reemplazó el <form>) */}
      <div style={{
        display: "flex", gap: "0.8rem", maxWidth: "500px", margin: "0 auto 2rem", padding: "0 1rem",
        position: "relative",
      }}>
        <input
          className="input-field"
          placeholder="🔍 Buscar productos..."
          value={searchInput}
          onChange={e => { setSearchInput(e.target.value); setSelectedCategory(null); }}
          style={{ paddingRight: searchInput ? "40px" : "14px" }}
        />
        {searchInput && (
          <button onClick={() => { setSearchInput(""); setSearch(""); }} style={{
            position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", color: "var(--text-muted)",
            cursor: "pointer", fontSize: "1rem", padding: "4px",
          }}>✕</button>
        )}
      </div>

      {/* Filtro categorías */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[{ id: null as number | null, nombre: "🛒 Todos" }, ...categories].map(cat => (
            <button
              key={cat.id ?? "all"}
              onClick={() => { setSelectedCategory(cat.id); setSearch(""); setSearchInput(""); }}
              style={{
                background: selectedCategory === cat.id && !search
                  ? "linear-gradient(135deg, #7963aa, #d582d8)"
                  : "rgba(121,99,170,0.15)",
                border: selectedCategory === cat.id && !search
                  ? "none" : "1px solid rgba(121,99,170,0.4)",
                color: selectedCategory === cat.id && !search ? "white" : "#c9a0dc",
                padding: "8px 20px", borderRadius: "20px",
                cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.3s",
              }}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {search && (
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          Resultados para: <strong style={{ color: "#d582d8" }}>"{search}"</strong> — {products.length} encontrados
        </p>
      )}

      {/* Grid productos */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "2rem" }}>⏳</p>
          <p>Cargando productos...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>
          <p style={{ fontSize: "3rem" }}>😕</p>
          <p>No se encontraron productos</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {paginatedProducts.map(product => (
              <div key={product.id} className="card" style={{ padding: "0", overflow: "hidden" }}>
                <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ width: "100%", height: "180px", overflow: "hidden" }}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.nombre}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%",
                        background: "linear-gradient(135deg, rgba(121,99,170,0.3), rgba(213,130,216,0.3))",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem",
                      }}>🛒</div>
                    )}
                  </div>
                  <div style={{ padding: "1.2rem 1.2rem 0.8rem" }}>
                    <h3 style={{ color: "var(--text)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem", lineHeight: 1.3 }}>
                      {product.nombre}
                    </h3>
                    <p style={{
                      color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.8rem",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{product.descripcion}</p>
                    <span style={{
                      background: "linear-gradient(135deg, #d582d8, #ffaaff)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      fontWeight: 800, fontSize: "1.2rem",
                    }}>S/. {Number(product.precio).toFixed(2)}</span>
                  </div>
                </Link>
                <div style={{ padding: "0 1.2rem 1.2rem", display: "flex", gap: "0.6rem" }}>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary"
                    style={{
                      flex: 1, padding: "8px", fontSize: "0.85rem", borderRadius: "10px",
                      background: addedId === product.id
                        ? "linear-gradient(135deg, #27ae60, #2ecc71)" : undefined,
                    }}
                  >
                    {addedId === product.id ? "✅ Agregado" : "🛒 Agregar"}
                  </button>
                  <Link href={`/products/${product.id}`} style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)",
                    color: "var(--text-muted)", padding: "8px 12px", borderRadius: "10px",
                    fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center",
                  }}>Ver →</Link>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Paginación */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2.5rem" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: "var(--input-bg)", border: "1px solid var(--card-border)",
                  color: "var(--text)", padding: "8px 14px", borderRadius: "10px",
                  cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1,
                  fontWeight: 600,
                }}
              >← Anterior</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    background: p === page ? "linear-gradient(135deg, #7963aa, #d582d8)" : "var(--input-bg)",
                    border: p === page ? "none" : "1px solid var(--card-border)",
                    color: p === page ? "white" : "var(--text)",
                    width: "38px", height: "38px", borderRadius: "10px",
                    cursor: "pointer", fontWeight: 700,
                  }}
                >{p}</button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  background: "var(--input-bg)", border: "1px solid var(--card-border)",
                  color: "var(--text)", padding: "8px 14px", borderRadius: "10px",
                  cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1,
                  fontWeight: 600,
                }}
              >Siguiente →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
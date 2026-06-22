"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "./types/product";

interface Category {
  id: number;
  nombre: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://backend-marketplace-85du.onrender.com/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `https://backend-marketplace-85du.onrender.com/api/products?categoryId=${selectedCategory}`
        : "https://backend-marketplace-85du.onrender.com/api/products";
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "3rem 1rem", marginBottom: "2rem" }}>
        <h1 style={{
          fontSize: "3rem",
          fontWeight: 800,
          background: "linear-gradient(135deg, #d582d8, #ffaaff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
        }}>
          🛍️ Bienvenido a MiniMarket
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem" }}>
          Encuentra los mejores productos tecnológicos al mejor precio
        </p>
      </div>

      {/* Filtro de categorías */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              background: selectedCategory === null
                ? "linear-gradient(135deg, #7963aa, #d582d8)"
                : "rgba(255,255,255,0.05)",
              border: selectedCategory === null ? "none" : "1px solid rgba(255,255,255,0.15)",
              color: "white",
              padding: "8px 20px",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "all 0.3s",
            }}
          >
            🛒 Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id
                  ? "linear-gradient(135deg, #7963aa, #d582d8)"
                  : "rgba(255,255,255,0.05)",
                border: selectedCategory === cat.id ? "none" : "1px solid rgba(255,255,255,0.15)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "all 0.3s",
              }}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.4)" }}>
          <p style={{ fontSize: "2rem" }}>⏳</p>
          <p>Cargando productos...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "4rem" }}>
          <p style={{ fontSize: "3rem" }}>😕</p>
          <p>No hay productos en esta categoría</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "0", cursor: "pointer", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "180px", overflow: "hidden" }}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.nombre}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, rgba(121,99,170,0.3), rgba(213,130,216,0.3))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                    }}>🛒</div>
                  )}
                </div>
                <div style={{ padding: "1.2rem" }}>
                  <h3 style={{ color: "white", fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                    {product.nombre}
                  </h3>
                  <p style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {product.descripcion}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      background: "linear-gradient(135deg, #d582d8, #ffaaff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                    }}>
                      S/. {Number(product.precio).toFixed(2)}
                    </span>
                    <span style={{
                      background: "linear-gradient(135deg, #7963aa, #d582d8)",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}>
                      Ver más →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";
import Cookies from "js-cookie";

const API = "https://backend-marketplace-85du.onrender.com/api/products";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ nombre: "", precio: "", descripcion: "" });
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "products">("dashboard");
  const [user, setUser] = useState<{ nombre: string; email: string; rol: string } | null>(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) setUser(JSON.parse(userData));
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data);
    } catch {
      setMsg("❌ Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.precio) {
      setMsg("⚠️ Nombre y precio son obligatorios");
      return;
    }
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `${API}/${editingProduct.id}` : API;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, precio: parseFloat(form.precio) }),
      });
      if (!res.ok) throw new Error();
      setMsg(editingProduct ? "✅ Producto actualizado" : "✅ Producto creado");
      setForm({ nombre: "", precio: "", descripcion: "" });
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch {
      setMsg("❌ Error al guardar producto");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      nombre: product.nombre,
      precio: String(product.precio),
      descripcion: product.descripcion || "",
    });
    setShowForm(true);
    setActiveTab("products");
    setMsg("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setMsg("✅ Producto eliminado");
      fetchProducts();
    } catch {
      setMsg("❌ Error al eliminar");
    }
  };

  const totalValue = products.reduce((sum, p) => sum + Number(p.precio), 0);
  const avgPrice = products.length > 0 ? totalValue / products.length : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => Number(p.precio))) : 0;
  const minPrice = products.length > 0 ? Math.min(...products.map((p) => Number(p.precio))) : 0;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #d582d8, #ffaaff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            ⚙️ Panel de Administración
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Bienvenido, {user?.nombre} 👑
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["dashboard", "products"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab
                  ? "linear-gradient(135deg, #7963aa, #d582d8)"
                  : "rgba(255,255,255,0.05)",
                border: activeTab === tab ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "all 0.3s",
              }}
            >
              {tab === "dashboard" ? "📊 Dashboard" : "📦 Productos"}
            </button>
          ))}
        </div>
      </div>

      {/* Mensaje */}
      {msg && (
        <div style={{
          background: msg.includes("❌") || msg.includes("⚠️") ? "rgba(231,76,60,0.15)" : "rgba(46,213,115,0.15)",
          border: `1px solid ${msg.includes("❌") || msg.includes("⚠️") ? "rgba(231,76,60,0.4)" : "rgba(46,213,115,0.4)"}`,
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "1.5rem",
          color: msg.includes("❌") || msg.includes("⚠️") ? "#e74c3c" : "#2ed573",
          fontWeight: 600,
        }}>
          {msg}
        </div>
      )}

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div>
          {/* Stats cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}>
            {[
              { label: "Total Productos", value: products.length, icon: "📦", color: "#7963aa" },
              { label: "Valor Promedio", value: `S/. ${avgPrice.toFixed(2)}`, icon: "📊", color: "#d582d8" },
              { label: "Precio Máximo", value: `S/. ${maxPrice.toFixed(2)}`, icon: "📈", color: "#00385c" },
              { label: "Precio Mínimo", value: `S/. ${minPrice.toFixed(2)}`, icon: "📉", color: "#354a7e" },
            ].map((stat) => (
              <div key={stat.label} className="card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #d582d8, #ffaaff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                      {stat.value}
                    </p>
                  </div>
                  <span style={{ fontSize: "2rem" }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Top productos */}
          <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h2 style={{ color: "white", fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              🏆 Top 5 productos más caros
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {[...products]
                .sort((a, b) => Number(b.precio) - Number(a.precio))
                .slice(0, 5)
                .map((p, i) => (
                  <div key={p.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.8rem",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                  }}>
                    <span style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7963aa, #d582d8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ color: "white", flex: 1, fontSize: "0.9rem" }}>{p.nombre}</span>
                    <span style={{
                      background: "linear-gradient(135deg, #d582d8, #ffaaff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 700,
                    }}>
                      S/. {Number(p.precio).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Acceso rápido */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ color: "white", fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              ⚡ Acciones rápidas
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                className="btn-primary"
                onClick={() => { setActiveTab("products"); setShowForm(true); }}
              >
                ➕ Nuevo Producto
              </button>
              <button
                onClick={() => setActiveTab("products")}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(213,130,216,0.3)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                📦 Ver todos los productos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
            <button
              className="btn-primary"
              onClick={() => { setShowForm(!showForm); setEditingProduct(null); setForm({ nombre: "", precio: "", descripcion: "" }); }}
            >
              {showForm ? "✕ Cancelar" : "+ Nuevo Producto"}
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
              <h2 style={{ color: "white", fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                {editingProduct ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Nombre *</label>
                  <input className="input-field" placeholder="Nombre del producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Precio (S/.) *</label>
                  <input className="input-field" placeholder="0.00" type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Descripción</label>
                <textarea className="input-field" placeholder="Descripción del producto" rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button className="btn-primary" onClick={handleSubmit}>
                  {editingProduct ? "💾 Guardar cambios" : "➕ Crear producto"}
                </button>
                <button className="btn-danger" onClick={() => { setShowForm(false); setEditingProduct(null); setForm({ nombre: "", precio: "", descripcion: "" }); }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.4)" }}>
              <p style={{ fontSize: "2rem" }}>⏳</p>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, rgba(0,56,92,0.8), rgba(53,74,126,0.8))" }}>
                    {["ID", "Nombre", "Precio", "Descripción", "Acciones"].map((h) => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: h === "Acciones" ? "center" : "left", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                      <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>#{product.id}</td>
                      <td style={{ padding: "14px 16px", color: "white", fontWeight: 600, fontSize: "0.9rem" }}>{product.nombre}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "linear-gradient(135deg, #d582d8, #ffaaff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>
                          S/. {Number(product.precio).toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", maxWidth: "250px" }}>
                        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {product.descripcion}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button onClick={() => handleEdit(product)} style={{ background: "linear-gradient(135deg, #7963aa, #d582d8)", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                            ✏️ Editar
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="btn-danger" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
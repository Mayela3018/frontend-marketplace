"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";
import Cookies from "js-cookie";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const API_PRODUCTS = "https://backend-marketplace-85du.onrender.com/api/products";
const API_USERS = "https://backend-marketplace-85du.onrender.com/api/auth/users";

interface UserData {
  id: number; nombre: string; email: string; rol: string; createdAt: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ nombre: "", precio: "", descripcion: "", imageUrl: "", stock: "" });
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "users">("dashboard");
  const [user, setUser] = useState<{ nombre: string; email: string; rol: string } | null>(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) setUser(JSON.parse(userData));
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === "users" && users.length === 0) fetchUsers();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_PRODUCTS);
      setProducts(await res.json());
    } catch { setMsg("❌ Error al cargar productos"); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(API_USERS);
      setUsers(await res.json());
    } catch { setMsg("❌ Error al cargar usuarios"); }
    finally { setLoadingUsers(false); }
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.precio) { setMsg("⚠️ Nombre y precio son obligatorios"); return; }
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `${API_PRODUCTS}/${editingProduct.id}` : API_PRODUCTS;
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) || 0 }),
      });
      if (!res.ok) throw new Error();
      setMsg(editingProduct ? "✅ Producto actualizado" : "✅ Producto creado");
      setForm({ nombre: "", precio: "", descripcion: "", imageUrl: "", stock: "" });
      setShowForm(false); setEditingProduct(null);
      fetchProducts();
    } catch { setMsg("❌ Error al guardar producto"); }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      nombre: product.nombre,
      precio: String(product.precio),
      descripcion: product.descripcion || "",
      imageUrl: product.imageUrl || "",
      stock: String(product.stock ?? 0),
    });
    setShowForm(true); setActiveTab("products"); setMsg("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await fetch(`${API_PRODUCTS}/${id}`, { method: "DELETE" });
      setMsg("✅ Producto eliminado"); fetchProducts();
    } catch { setMsg("❌ Error al eliminar"); }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await fetch(`${API_USERS.replace("/users", "")}/${id}`.replace("auth/", "auth/users/"), { method: "DELETE" });
      // URL correcta:
      const res = await fetch(`https://backend-marketplace-85du.onrender.com/api/auth/users/${id}`, { method: "DELETE" });
      if (res.ok) { setMsg("✅ Usuario eliminado"); fetchUsers(); }
    } catch { setMsg("❌ Error al eliminar usuario"); }
  };

  const handleChangeRol = async (id: number, currentRol: string) => {
    const newRol = currentRol === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (!confirm(`¿Cambiar rol a ${newRol}?`)) return;
    try {
      await fetch(`https://backend-marketplace-85du.onrender.com/api/auth/users/${id}/rol`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: newRol }),
      });
      setMsg(`✅ Rol actualizado a ${newRol}`); fetchUsers();
    } catch { setMsg("❌ Error al cambiar rol"); }
  };

  const totalValue = products.reduce((sum, p) => sum + Number(p.precio), 0);
  const avgPrice = products.length > 0 ? totalValue / products.length : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => Number(p.precio))) : 0;
  const minPrice = products.length > 0 ? Math.min(...products.map(p => Number(p.precio))) : 0;
  const isError = msg.includes("❌") || msg.includes("⚠️");

  const tabs = [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "products", label: "📦 Productos" },
    { key: "users", label: "👥 Usuarios" },
  ] as const;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{
            fontSize: "2rem", fontWeight: 800,
            background: "linear-gradient(135deg, #d582d8, #ffaaff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>⚙️ Panel de Administración</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Bienvenido, {user?.nombre} 👑</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              background: activeTab === tab.key ? "linear-gradient(135deg, #7963aa, #d582d8)" : "var(--card-bg)",
              border: activeTab === tab.key ? "none" : "1px solid var(--card-border)",
              color: activeTab === tab.key ? "white" : "var(--text)",
              padding: "8px 20px", borderRadius: "20px", cursor: "pointer",
              fontWeight: 600, fontSize: "0.9rem", transition: "all 0.3s",
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Mensaje */}
      {msg && (
        <div style={{
          background: isError ? "rgba(231,76,60,0.15)" : "rgba(46,213,115,0.15)",
          border: `1px solid ${isError ? "rgba(231,76,60,0.4)" : "rgba(46,213,115,0.4)"}`,
          borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem",
          color: isError ? "#c0392b" : "#27ae60", fontWeight: 600,
        }}>{msg}</div>
      )}

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            {[
              { label: "Total Productos", value: products.length, icon: "📦" },
              { label: "Total Usuarios", value: users.length || "—", icon: "👥" },
              { label: "Precio Promedio", value: `S/. ${avgPrice.toFixed(2)}`, icon: "📊" },
              { label: "Precio Máximo", value: `S/. ${maxPrice.toFixed(2)}`, icon: "📈" },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{stat.label}</p>
                    <p style={{
                      fontSize: "1.6rem", fontWeight: 800,
                      background: "linear-gradient(135deg, #7963aa, #d582d8)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>{stat.value}</p>
                  </div>
                  <span style={{ fontSize: "2rem" }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Gráfico de barras — productos por categoría */}
          <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h2 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              📊 Precio por producto
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={products.slice(0, 8).map(p => ({ nombre: p.nombre.split(" ").slice(0, 2).join(" "), precio: Number(p.precio) }))}>
                <XAxis
                  dataKey="nombre"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `S/.${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-solid)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "10px",
                    color: "var(--text)",
                  }}
                  formatter={(value: number) => [`S/. ${value.toFixed(2)}`, "Precio"]}
                />
                <Bar dataKey="precio" radius={[8, 8, 0, 0]}>
                  {products.slice(0, 8).map((_, index) => (
                    <Cell
                      key={index}
                      fill={index % 2 === 0 ? "#7963aa" : "#d582d8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top productos */}
          <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h2 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              🏆 Top 5 productos más caros
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {[...products].sort((a, b) => Number(b.precio) - Number(a.precio)).slice(0, 5).map((p, i) => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.8rem", background: "var(--input-bg)", borderRadius: "10px",
                }}>
                  <span style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #7963aa, #d582d8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.85rem", color: "white", flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ color: "var(--text)", flex: 1, fontSize: "0.9rem", fontWeight: 600 }}>{p.nombre}</span>
                  <span style={{
                    background: "linear-gradient(135deg, #d582d8, #ffaaff)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700,
                  }}>S/. {Number(p.precio).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>⚡ Acciones rápidas</h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => { setActiveTab("products"); setShowForm(true); }}>➕ Nuevo Producto</button>
              <button onClick={() => setActiveTab("users")} style={{
                background: "var(--input-bg)", border: "1px solid var(--card-border)",
                color: "var(--text)", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: 600,
              }}>👥 Ver Usuarios</button>
              <button onClick={() => setActiveTab("products")} style={{
                background: "var(--input-bg)", border: "1px solid var(--card-border)",
                color: "var(--text)", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: 600,
              }}>📦 Ver Productos</button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
            <button className="btn-primary" onClick={() => {
              setShowForm(!showForm); setEditingProduct(null);
              setForm({ nombre: "", precio: "", descripcion: "", imageUrl: "", stock: "" });
            }}>{showForm ? "✕ Cancelar" : "+ Nuevo Producto"}</button>
          </div>

          {showForm && (
            <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
              <h2 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                {editingProduct ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Nombre *</label>
                  <input className="input-field" placeholder="Nombre del producto" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Precio (S/.) *</label>
                  <input className="input-field" placeholder="0.00" type="number" step="0.01" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
                </div>
                <div>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>📦 Stock</label>
                  <input className="input-field" placeholder="0" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Descripción</label>
                <textarea className="input-field" placeholder="Descripción del producto" rows={3}
                  value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  style={{ resize: "vertical" }} />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>
                  🖼️ URL de la imagen
                </label>
                <input className="input-field" placeholder="https://ejemplo.com/imagen.jpg"
                  value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
                {form.imageUrl && (
                  <div style={{
                    marginTop: "10px", width: "100%", height: "140px",
                    borderRadius: "10px", overflow: "hidden", border: "1px solid var(--card-border)",
                  }}>
                    <img src={form.imageUrl} alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button className="btn-primary" onClick={handleSubmit}>
                  {editingProduct ? "💾 Guardar cambios" : "➕ Crear producto"}
                </button>
                <button className="btn-danger" onClick={() => { setShowForm(false); setEditingProduct(null); setForm({ nombre: "", precio: "", descripcion: "", imageUrl: "", stock: "" }); }}>Cancelar</button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem" }}>⏳</p><p>Cargando productos...</p>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, rgba(121,99,170,0.3), rgba(213,130,216,0.2))" }}>
                    {["ID", "Nombre", "Precio", "Stock", "Descripción", "Acciones"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: h === "Acciones" ? "center" : "left", color: "var(--text)", fontSize: "0.85rem", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} style={{ borderTop: "1px solid var(--card-border)", background: index % 2 === 0 ? "transparent" : "var(--input-bg)" }}>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>#{product.id}</td>
                      <td style={{ padding: "14px 16px", color: "var(--text)", fontWeight: 600, fontSize: "0.9rem" }}>{product.nombre}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "linear-gradient(135deg, #d582d8, #ffaaff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>
                          S/. {Number(product.precio).toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          background: (product.stock ?? 0) > 0 ? "rgba(46,213,115,0.15)" : "rgba(231,76,60,0.15)",
                          color: (product.stock ?? 0) > 0 ? "#27ae60" : "#c0392b",
                          padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700,
                        }}>
                          {product.stock ?? 0} {(product.stock ?? 0) === 0 && "⚠️"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "250px" }}>
                        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.descripcion}</span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button onClick={() => handleEdit(product)} style={{ background: "linear-gradient(135deg, #7963aa, #d582d8)", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>✏️ Editar</button>
                          <button onClick={() => handleDelete(product.id)} className="btn-danger" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>🗑️ Eliminar</button>
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

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ color: "var(--text)", fontWeight: 700, fontSize: "1.1rem" }}>
              👥 Usuarios registrados ({users.length})
            </h2>
            <button onClick={fetchUsers} style={{
              background: "var(--input-bg)", border: "1px solid var(--card-border)",
              color: "var(--text)", padding: "8px 16px", borderRadius: "10px",
              cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
            }}>🔄 Actualizar</button>
          </div>

          {loadingUsers ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem" }}>⏳</p><p>Cargando usuarios...</p>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, rgba(121,99,170,0.3), rgba(213,130,216,0.2))" }}>
                    {["ID", "Nombre", "Email", "Rol", "Registrado", "Acciones"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: h === "Acciones" ? "center" : "left", color: "var(--text)", fontSize: "0.85rem", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={u.id} style={{ borderTop: "1px solid var(--card-border)", background: index % 2 === 0 ? "transparent" : "var(--input-bg)" }}>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>#{u.id}</td>
                      <td style={{ padding: "14px 16px", color: "var(--text)", fontWeight: 600, fontSize: "0.9rem" }}>{u.nombre}</td>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>{u.email}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          background: u.rol === "ADMIN" ? "linear-gradient(135deg, #7963aa, #d582d8)" : "rgba(121,99,170,0.2)",
                          color: u.rol === "ADMIN" ? "white" : "#7963aa",
                          padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700,
                        }}>{u.rol === "ADMIN" ? "👑 ADMIN" : "👤 CUSTOMER"}</span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {new Date(u.createdAt).toLocaleDateString("es-PE")}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button onClick={() => handleChangeRol(u.id, u.rol)} style={{
                            background: u.rol === "ADMIN" ? "rgba(121,99,170,0.2)" : "linear-gradient(135deg, #7963aa, #d582d8)",
                            color: u.rol === "ADMIN" ? "#7963aa" : "white",
                            border: u.rol === "ADMIN" ? "1px solid rgba(121,99,170,0.4)" : "none",
                            padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                          }}>{u.rol === "ADMIN" ? "→ CUSTOMER" : "→ ADMIN"}</button>
                          <button onClick={() => handleDeleteUser(u.id)} className="btn-danger" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>🗑️</button>
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
"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface CartItem {
  id: number; nombre: string; precio: number | string;
  imageUrl?: string; quantity: number;
}

interface CartCtx {
  cart: CartItem[];
  addToCart: (p: CartItem) => void;
  removeFromCart: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
}

export const CartContext = createContext<CartCtx>({
  cart: [], addToCart: () => {}, removeFromCart: () => {},
  changeQty: () => {}, clearCart: () => {},
  cartOpen: false, setCartOpen: () => {},
});

export const useCart = () => useContext(CartContext);

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const save = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const addToCart = (product: CartItem) => {
    const existing = cart.find(i => i.id === product.id);
    save(existing
      ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, { ...product, quantity: 1 }]
    );
  };

  const removeFromCart = (id: number) => save(cart.filter(i => i.id !== id));
  const changeQty = (id: number, delta: number) =>
    save(cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  const clearCart = () => save([]);

  const total = cart.reduce((s, i) => s + Number(i.precio) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQty, clearCart, cartOpen, setCartOpen }}>
      <Navbar />

      {/* Overlay carrito */}
      <div className={`cart-overlay ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />

      {/* Sidebar carrito */}
      <div className={`cart-sidebar ${cartOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ color: "var(--text)", fontWeight: 800, fontSize: "1.3rem" }}>🛒 Mi Carrito</h2>
          <button onClick={() => setCartOpen(false)} style={{
            background: "none", border: "none", color: "var(--text-muted)",
            fontSize: "1.5rem", cursor: "pointer",
          }}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
            <p style={{ fontSize: "2.5rem" }}>🛒</p>
            <p style={{ marginTop: "1rem" }}>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{
                display: "flex", gap: "1rem", alignItems: "center",
                padding: "1rem 0", borderBottom: "1px solid var(--card-border)",
              }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "10px", overflow: "hidden",
                  background: "linear-gradient(135deg, rgba(121,99,170,0.3), rgba(213,130,216,0.3))",
                  flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: "1.5rem" }}>🛒</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "var(--text)", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.3 }}>{item.nombre}</p>
                  <p style={{ color: "#d582d8", fontWeight: 800, fontSize: "0.95rem", marginTop: "4px" }}>
                    S/. {(Number(item.precio) * item.quantity).toFixed(2)}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "6px" }}>
                    <button onClick={() => changeQty(item.id, -1)} style={{
                      background: "rgba(255,255,255,0.1)", border: "1px solid var(--card-border)",
                      color: "var(--text)", width: "26px", height: "26px", borderRadius: "50%",
                      cursor: "pointer", fontWeight: 700,
                    }}>-</button>
                    <span style={{ color: "var(--text)", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => changeQty(item.id, 1)} style={{
                      background: "rgba(255,255,255,0.1)", border: "1px solid var(--card-border)",
                      color: "var(--text)", width: "26px", height: "26px", borderRadius: "50%",
                      cursor: "pointer", fontWeight: 700,
                    }}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.3)",
                      color: "#e74c3c", width: "26px", height: "26px", borderRadius: "50%",
                      cursor: "pointer", fontSize: "0.75rem", marginLeft: "4px",
                    }}>✕</button>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: "1.5rem", padding: "1rem 0", borderTop: "2px solid var(--card-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Total:</span>
                <span style={{ color: "#d582d8", fontWeight: 800, fontSize: "1.2rem" }}>S/. {total.toFixed(2)}</span>
              </div>
              <button className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
                onClick={() => alert("🛍️ ¡Gracias por tu compra! (simulado)")}>
                Finalizar compra
              </button>
              <button onClick={clearCart} style={{
                width: "100%", marginTop: "0.5rem", background: "none",
                border: "1px solid var(--card-border)", color: "var(--text-muted)",
                padding: "8px", borderRadius: "10px", cursor: "pointer", fontSize: "0.85rem",
              }}>Vaciar carrito</button>
            </div>
          </>
        )}
      </div>

      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </CartContext.Provider>
  );
}

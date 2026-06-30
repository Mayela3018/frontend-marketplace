"use client";

import { useState } from "react";
import { useCart } from "./LayoutClient";

interface Props {
  product: { id: number; nombre: string; precio: number | string; imageUrl?: string; };
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handle = () => {
    addToCart({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button onClick={handle} className="btn-primary"
      style={{
        width: "100%", padding: "14px", fontSize: "1rem",
        background: added ? "linear-gradient(135deg, #27ae60, #2ecc71)" : undefined,
        transition: "background 0.3s",
      }}>
      {added ? "✅ Agregado al carrito" : "🛒 Agregar al carrito"}
    </button>
  );
}
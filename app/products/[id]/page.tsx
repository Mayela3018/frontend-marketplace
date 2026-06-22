import Link from "next/link";
import { Product } from "../../types/product";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.5)" }}>
        <p style={{ fontSize: "3rem" }}>😕</p>
        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Producto no encontrado</p>
        <Link href="/" style={{
          background: "linear-gradient(135deg, #7963aa, #d582d8)",
          color: "white",
          padding: "10px 24px",
          borderRadius: "20px",
          textDecoration: "none",
          fontWeight: 600,
        }}>
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <Link href="/" style={{
        color: "rgba(255,255,255,0.6)",
        textDecoration: "none",
        fontSize: "0.9rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "2rem",
      }}>
        ← Volver a productos
      </Link>

      <div className="card" style={{ padding: "2.5rem" }}>
        {/* Imagen */}
        <div style={{
          width: "100%",
          height: "300px",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "2rem",
        }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.nombre}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(121,99,170,0.3), rgba(213,130,216,0.3))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "5rem",
            }}>
              🛒
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "white",
            flex: 1,
          }}>
            {product.nombre}
          </h1>
          <span style={{
            background: "linear-gradient(135deg, #d582d8, #ffaaff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
            fontSize: "2rem",
            whiteSpace: "nowrap",
          }}>
            S/. {Number(product.precio).toFixed(2)}
          </span>
        </div>

        <div style={{
          width: "60px",
          height: "3px",
          background: "linear-gradient(135deg, #7963aa, #d582d8)",
          borderRadius: "2px",
          margin: "1rem 0",
        }} />

        <p style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: "1rem",
          lineHeight: 1.7,
          marginBottom: "2rem",
        }}>
          {product.descripcion}
        </p>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          padding: "1rem 1.5rem",
          marginBottom: "2rem",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.4)",
        }}>
          <p>🆔 ID del producto: <strong style={{ color: "rgba(255,255,255,0.7)" }}>#{product.id}</strong></p>
          <p style={{ marginTop: "0.4rem" }}>📅 Agregado: <strong style={{ color: "rgba(255,255,255,0.7)" }}>{new Date(product.createdAt).toLocaleDateString("es-PE")}</strong></p>
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "1rem" }}>
          🛒 Agregar al carrito
        </button>
      </div>
    </div>
  );
}
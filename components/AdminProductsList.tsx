"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

export default function AdminProductsList({ products: initial }: { products: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "fashion" | "wedding">("all");

  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  const filterBtnStyle = (active: boolean) => ({
    fontFamily: "'Montserrat', sans-serif" as const,
    fontSize: "0.65rem" as const,
    letterSpacing: "0.15em" as const,
    textTransform: "uppercase" as const,
    padding: "0.5rem 1.25rem",
    border: "1px solid",
    borderColor: active ? "#c9a84c" : "rgba(255,255,255,0.1)",
    background: active ? "#c9a84c" : "transparent",
    color: active ? "#0a0a0a" : "#888880",
    cursor: "pointer" as const,
    transition: "all 0.2s ease",
  });

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {(["all", "fashion", "wedding"] as const).map((f) => (
          <button key={f} style={filterBtnStyle(filter === f)} onClick={() => setFilter(f)}>
            {f === "all" ? `All (${products.length})` : f === "fashion" ? `Fashion (${products.filter(p => p.category === "fashion").length})` : `Bridal (${products.filter(p => p.category === "wedding").length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p style={{ color: "#444440", fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem" }}>
            No products found.
          </p>
        </div>
      ) : (
        <div style={{ border: "1px solid rgba(201,168,76,0.1)" }}>
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 100px 100px",
              padding: "0.75rem 1.5rem",
              background: "#111111",
              borderBottom: "1px solid rgba(201,168,76,0.1)",
            }}
          >
            {["Product", "Category", "Price", "Actions"].map((h) => (
              <span
                key={h}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "#555550",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((product, i) => (
            <div
              key={product.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 100px 100px",
                padding: "1rem 1.5rem",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: i % 2 === 0 ? "#0d0d0d" : "#111111",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    color: "#f5f5f0",
                    margin: "0 0 0.2rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {product.name}
                  {product.featured && (
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.55rem",
                        color: "#c9a84c",
                        letterSpacing: "0.1em",
                        marginLeft: "0.5rem",
                        background: "rgba(201,168,76,0.1)",
                        padding: "0.1rem 0.4rem",
                      }}
                    >
                      FEATURED
                    </span>
                  )}
                </p>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.6rem",
                    color: "#444440",
                    margin: 0,
                  }}
                >
                  {product.images.length} image{product.images.length !== 1 ? "s" : ""}
                </p>
              </div>

              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: product.category === "wedding" ? "#c9a84c" : "#888880",
                  textTransform: "uppercase",
                }}
              >
                {product.category === "wedding" ? "Bridal" : "Fashion"}
              </span>

              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  color: "#888880",
                }}
              >
                €{product.price.toLocaleString()}
              </span>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "#c9a84c",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    border: "1px solid rgba(201,168,76,0.3)",
                    padding: "0.3rem 0.6rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deletingId === product.id}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "#e05050",
                    background: "none",
                    border: "1px solid rgba(224,80,80,0.3)",
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "all 0.2s ease",
                    opacity: deletingId === product.id ? 0.5 : 1,
                  }}
                >
                  {deletingId === product.id ? "..." : "Del"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

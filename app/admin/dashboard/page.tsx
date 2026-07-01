import { getAllProducts } from "@/lib/db";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const products = getAllProducts();
  const fashionCount = products.filter((p) => p.category === "fashion").length;
  const weddingCount = products.filter((p) => p.category === "wedding").length;
  const featuredCount = products.filter((p) => p.featured).length;
  const recent = products.slice(-5).reverse();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <AdminNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: "#c9a84c",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Administration
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.5rem",
              fontWeight: 300,
              letterSpacing: "0.05em",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          {[
            { label: "Total Products", value: products.length, color: "#c9a84c" },
            { label: "Fashion", value: fashionCount, color: "#888880" },
            { label: "Bridal", value: weddingCount, color: "#c9a84c" },
            { label: "Featured", value: featuredCount, color: "#888880" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: "#111111",
                border: "1px solid rgba(201,168,76,0.1)",
                padding: "1.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "#555550",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "3rem",
                  fontWeight: 300,
                  color,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "#f5f5f0",
              marginBottom: "1rem",
              letterSpacing: "0.05em",
            }}
          >
            Quick Actions
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/admin/products/new" className="btn-gold-solid" style={{ textDecoration: "none" }}>
              + ADD PRODUCT
            </Link>
            <Link href="/admin/products" className="btn-gold" style={{ textDecoration: "none" }}>
              MANAGE PRODUCTS
            </Link>
            <Link href="/catalog" className="btn-gold" style={{ textDecoration: "none" }}>
              VIEW CATALOGUE
            </Link>
          </div>
        </div>

        {/* Recent products */}
        <div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "#f5f5f0",
              marginBottom: "1rem",
              letterSpacing: "0.05em",
            }}
          >
            Recent Products
          </h2>
          {recent.length === 0 ? (
            <div
              style={{
                padding: "3rem",
                border: "1px solid rgba(255,255,255,0.05)",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#444440", fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem" }}>
                No products yet.{" "}
                <Link href="/admin/products/new" style={{ color: "#c9a84c" }}>
                  Add your first product
                </Link>
              </p>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid rgba(201,168,76,0.1)",
                overflow: "hidden",
              }}
            >
              {recent.map((product, i) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 1.5rem",
                    borderBottom: i < recent.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: i % 2 === 0 ? "#111111" : "#0d0d0d",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1rem",
                        color: "#f5f5f0",
                        margin: "0 0 0.25rem",
                      }}
                    >
                      {product.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.65rem",
                        color: "#555550",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        margin: 0,
                      }}
                    >
                      {product.category === "wedding" ? "Bridal" : "Fashion"} · €{product.price.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      color: "#c9a84c",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      border: "1px solid rgba(201,168,76,0.3)",
                      padding: "0.35rem 0.75rem",
                    }}
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

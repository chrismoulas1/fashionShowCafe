import { getAllProducts } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = getAllProducts();
  const featured = products.filter((p) => p.featured);
  const fashionCount = products.filter((p) => p.category === "fashion").length;
  const weddingCount = products.filter((p) => p.category === "wedding").length;

  return (
    <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "4rem 2rem 5rem",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.4em",
            color: "#c9a84c",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          ✦ HAUTE COUTURE ✦
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 300,
            letterSpacing: "0.1em",
            color: "#f5f5f0",
            margin: "0 0 1rem",
            lineHeight: 1,
          }}
        >
          The Collection
        </h1>
        <div className="gold-divider" />
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 300,
            letterSpacing: "0.1em",
            color: "#888880",
            maxWidth: "500px",
            margin: "0 auto 3rem",
            lineHeight: 1.8,
          }}
        >
          Timeless elegance for the modern woman — from everyday luxury to the most
          special day of your life.
        </p>

        {/* Category filters */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <Link href="/catalog" className="btn-gold-solid" style={{ textDecoration: "none" }}>
            ALL ({products.length})
          </Link>
          <Link href="/catalog/fashion" className="btn-gold" style={{ textDecoration: "none" }}>
            FASHION ({fashionCount})
          </Link>
          <Link href="/catalog/wedding" className="btn-gold" style={{ textDecoration: "none" }}>
            BRIDAL ({weddingCount})
          </Link>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section style={{ padding: "5rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.35em",
                color: "#c9a84c",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Editor's Selection
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 300,
                color: "#f5f5f0",
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              Featured Pieces
            </h2>
            <div className="gold-divider" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section
        style={{
          padding: "3rem 2rem 5rem",
          maxWidth: "1400px",
          margin: "0 auto",
          borderTop: featured.length > 0 ? "1px solid rgba(201,168,76,0.1)" : "none",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 300,
              color: "#f5f5f0",
              letterSpacing: "0.08em",
              margin: "0 0 0.5rem",
            }}
          >
            All Collections
          </h2>
          <div className="gold-divider" />
        </div>
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#444440" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>
              No products yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(201,168,76,0.15)",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.8rem",
            fontWeight: 300,
            letterSpacing: "0.25em",
            color: "#c9a84c",
            marginBottom: "0.5rem",
          }}
        >
          GRINALDI
        </p>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "#444440",
            textTransform: "uppercase",
          }}
        >
          © {new Date().getFullYear()} Grinaldi Fashion House. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

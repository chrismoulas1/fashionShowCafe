import { getProductsByCategory } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FashionPage() {
  const products = getProductsByCategory("fashion");

  return (
    <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      {/* Hero */}
      <section
        style={{
          padding: "4rem 2rem 5rem",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Decorative background text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(8rem, 25vw, 20rem)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(201,168,76,0.04)",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            FASHION
          </span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.4em",
              color: "#888880",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Grinaldi Fashion House
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 300,
              letterSpacing: "0.15em",
              color: "#f5f5f0",
              margin: "0 0 1rem",
              lineHeight: 1,
            }}
          >
            Women&apos;s Fashion
          </h1>
          <div className="gold-divider" />
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 300,
              letterSpacing: "0.08em",
              color: "#888880",
              maxWidth: "480px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.9,
            }}
          >
            Sophisticated designs for the modern woman. From evening elegance to daytime
            refinement, each piece is crafted for those who define their own style.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/catalog" className="btn-gold" style={{ textDecoration: "none" }}>
              ALL COLLECTIONS
            </Link>
            <Link href="/catalog/wedding" className="btn-gold" style={{ textDecoration: "none" }}>
              BRIDAL
            </Link>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section style={{ padding: "5rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              letterSpacing: "0.05em",
              color: "#f5f5f0",
              margin: 0,
            }}
          >
            {products.length} {products.length === 1 ? "Piece" : "Pieces"}
          </h2>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "#888880",
              textTransform: "uppercase",
            }}
          >
            Sorted by latest
          </p>
        </div>

        {products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "6rem 2rem",
              border: "1px solid rgba(201,168,76,0.1)",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                color: "#444440",
                marginBottom: "1rem",
              }}
            >
              New pieces arriving soon
            </p>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "#333330",
              }}
            >
              Check back for the latest Grinaldi Fashion designs.
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

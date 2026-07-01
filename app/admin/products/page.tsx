import { getAllProducts } from "@/lib/db";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import AdminProductsList from "@/components/AdminProductsList";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = getAllProducts();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <AdminNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                color: "#888880",
                textTransform: "uppercase",
                marginBottom: "0.25rem",
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
              All Products ({products.length})
            </h1>
          </div>
          <Link href="/admin/products/new" className="btn-gold-solid" style={{ textDecoration: "none" }}>
            + ADD PRODUCT
          </Link>
        </div>

        <AdminProductsList products={products} />
      </main>
    </div>
  );
}

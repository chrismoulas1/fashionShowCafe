import { getProductById } from "@/lib/db";
import { notFound } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <AdminNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: "#888880",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <Link href="/admin/products" style={{ color: "#888880", textDecoration: "none" }}>
              Products
            </Link>
            <span>/</span>
            <span>Edit</span>
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
            Edit: {product.name}
          </h1>
        </div>

        <div
          style={{
            background: "#111111",
            border: "1px solid rgba(201,168,76,0.1)",
            padding: "2.5rem",
          }}
        >
          <ProductForm mode="edit" product={product} />
        </div>
      </main>
    </div>
  );
}

import AdminNav from "@/components/AdminNav";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
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
            }}
          >
            Products / New
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
            Add New Product
          </h1>
        </div>

        <div
          style={{
            background: "#111111",
            border: "1px solid rgba(201,168,76,0.1)",
            padding: "2.5rem",
          }}
        >
          <ProductForm mode="create" />
        </div>
      </main>
    </div>
  );
}

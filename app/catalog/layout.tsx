import Navigation from "@/components/Navigation";

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Navigation />
      {children}
    </div>
  );
}

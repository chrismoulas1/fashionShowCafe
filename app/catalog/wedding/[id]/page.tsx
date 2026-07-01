import { getProductById } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

export default async function WeddingProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product || product.category !== "wedding") notFound();
  return <ProductDetail product={product} backHref="/catalog/wedding" backLabel="BRIDAL" />;
}

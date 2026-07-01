import { getProductById } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

export default async function FashionProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product || product.category !== "fashion") notFound();
  return <ProductDetail product={product} backHref="/catalog/fashion" backLabel="FASHION" />;
}

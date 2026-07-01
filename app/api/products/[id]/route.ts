import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";
import { verifyRequestToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await verifyRequestToken(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { name, description, price, category, featured, images } = body;

    if (category && !["fashion", "wedding"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (price !== undefined) updates.price = Number(price);
    if (category !== undefined) updates.category = category;
    if (featured !== undefined) updates.featured = Boolean(featured);
    if (images !== undefined) updates.images = Array.isArray(images) ? images : [];

    const updated = updateProduct(id, updates);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await verifyRequestToken(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const success = deleteProduct(id);
  if (!success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

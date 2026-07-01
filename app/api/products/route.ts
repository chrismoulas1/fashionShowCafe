import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/db";
import { verifyRequestToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  
  const products = getAllProducts();
  const filtered = category ? products.filter((p) => p.category === category) : products;
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const payload = await verifyRequestToken(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, price, category, featured, images } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["fashion", "wedding"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const product = createProduct({
      id: uuidv4(),
      name: String(name).trim(),
      description: String(description).trim(),
      price: Number(price),
      category,
      images: Array.isArray(images) ? images : [],
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

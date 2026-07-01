import fs from "fs";
import path from "path";
import { Product } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ products: [] }, null, 2));
  }
}

export function getAllProducts(): Product[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);
  return data.products || [];
}

export function getProductById(id: string): Product | null {
  const products = getAllProducts();
  return products.find((p) => p.id === id) || null;
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function createProduct(product: Product): Product {
  ensureDataFile();
  const products = getAllProducts();
  products.push(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  saveProducts(products);
  return true;
}

function saveProducts(products: Product[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ products }, null, 2));
}

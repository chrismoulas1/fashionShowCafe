export type ProductCategory = "fashion" | "wedding";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  featured: boolean;
}

export interface AdminUser {
  username: string;
}

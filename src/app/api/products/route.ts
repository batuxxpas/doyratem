import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductBySlug, insertProduct } from "@/lib/data";
import type { Product } from "@/lib/types";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, categoryId, brand, image, images, specs, featured } = body;

    if (!name || !slug || !categoryId) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    const existing = await getProductBySlug(slug);
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor" }, { status: 400 });
    }

    const products = await getProducts();

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: String(name).slice(0, 200),
      slug: String(slug).slice(0, 200),
      description: String(description || "").slice(0, 2000),
      categoryId: String(categoryId),
      brand: String(brand || "Doyratem").slice(0, 100),
      image: String(image || "/images/products/placeholder.jpg"),
      images: Array.isArray(images) ? images.map(String) : [],
      specs: typeof specs === "object" && specs !== null ? specs : {},
      featured: Boolean(featured),
      order: products.length + 1,
      createdAt: new Date().toISOString().split("T")[0],
    };

    await insertProduct(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

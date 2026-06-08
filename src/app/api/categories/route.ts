import { NextRequest, NextResponse } from "next/server";
import { getCategories, getCategoryBySlug, insertCategory } from "@/lib/data";
import type { Category } from "@/lib/types";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image, specFields } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    const existing = await getCategoryBySlug(slug);
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor" }, { status: 400 });
    }

    const categories = await getCategories();

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: String(name).slice(0, 200),
      slug: String(slug).slice(0, 200),
      description: String(description || "").slice(0, 1000),
      image: String(image || "/images/categories/placeholder.jpg"),
      specFields: Array.isArray(specFields) ? specFields.map(String).slice(0, 20) : [],
      order: categories.length + 1,
    };

    await insertCategory(newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServices, insertService } from "@/lib/data";
import type { Service } from "@/lib/types";

export async function GET() {
  const services = await getServices();
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, description, shortDescription, image, icon, featured } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    if (!image) {
      return NextResponse.json({ error: "Görsel zorunludur" }, { status: 400 });
    }

    const allServices = await getServices();

    const newService: Service = {
      id: `srv-${Date.now()}`,
      title: String(title).slice(0, 200),
      slug: String(slug).slice(0, 200),
      description: String(description || "").slice(0, 2000),
      shortDescription: String(shortDescription || "").slice(0, 500),
      image: String(image),
      icon: String(icon || "truck"),
      order: allServices.length + 1,
      featured: Boolean(featured),
    };

    await insertService(newService);

    return NextResponse.json(newService, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getReferences, insertReference } from "@/lib/data";
import type { Reference } from "@/lib/types";

export async function GET() {
  const references = await getReferences();
  return NextResponse.json(references);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sector, image } = body;

    if (!name) {
      return NextResponse.json({ error: "Firma adı gereklidir" }, { status: 400 });
    }

    const references = await getReferences();

    const newRef: Reference = {
      id: `ref-${Date.now()}`,
      name: String(name).slice(0, 200),
      sector: String(sector || "").slice(0, 200),
      image: String(image || ""),
      order: references.length + 1,
    };

    await insertReference(newRef);

    return NextResponse.json(newRef, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { updateService, deleteService } from "@/lib/data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateService(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const deleted = await deleteService(id);

    if (!deleted) {
      return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 4000;
const VALID_FOLDERS = ["products", "categories", "services", "blog"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const widthStr = formData.get("width") as string | null;
    const heightStr = formData.get("height") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya seçilmedi" }, { status: 400 });
    }

    if (!folder || !VALID_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: "Geçersiz klasör" }, { status: 400 });
    }

    // Type check
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Geçersiz dosya formatı. Sadece JPG, PNG ve WebP desteklenir." },
        { status: 400 }
      );
    }

    // Size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Dosya boyutu çok büyük. Maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB yüklenebilir.` },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Dosya boş" }, { status: 400 });
    }

    // Dimension check (sent from client-side validation)
    const width = widthStr ? parseInt(widthStr, 10) : 0;
    const height = heightStr ? parseInt(heightStr, 10) : 0;

    if (width > 0 && height > 0) {
      if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
        return NextResponse.json(
          { error: `Görsel en az ${MIN_DIMENSION}x${MIN_DIMENSION}px olmalıdır.` },
          { status: 400 }
        );
      }
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        return NextResponse.json(
          { error: `Görsel en fazla ${MAX_DIMENSION}x${MAX_DIMENSION}px olabilir.` },
          { status: 400 }
        );
      }
    }

    // Generate safe filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${safeName}`;

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Görsel yüklenirken hata oluştu" }, { status: 500 });
  }
}

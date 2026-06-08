import { NextRequest, NextResponse } from "next/server";
import { getMessages, insertMessage } from "@/lib/data";
import type { ContactMessage } from "@/lib/types";

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Basic validation
    if (typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Geçersiz isim" }, { status: 400 });
    }
    if (typeof email !== "string" || !email.includes("@") || email.length > 200) {
      return NextResponse.json({ error: "Geçersiz e-posta" }, { status: 400 });
    }
    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json({ error: "Mesaj çok uzun" }, { status: 400 });
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      phone: typeof phone === "string" ? phone.slice(0, 30) : "",
      subject: typeof subject === "string" ? subject.slice(0, 300) : "",
      message: message.slice(0, 5000),
      createdAt: new Date().toISOString(),
      read: false,
    };

    await insertMessage(newMessage);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

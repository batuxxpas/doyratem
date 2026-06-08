import { NextResponse } from "next/server";
import { getSeoPages, upsertSeoPage } from "@/lib/data";
import type { SeoPage } from "@/lib/types";

export async function GET() {
  const pages = await getSeoPages();
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const body = (await request.json()) as SeoPage;
  await upsertSeoPage(body);
  return NextResponse.json({ success: true });
}

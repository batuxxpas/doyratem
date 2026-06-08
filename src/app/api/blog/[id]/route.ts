import { NextResponse } from "next/server";
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/data";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const now = new Date().toISOString().split("T")[0];

  const updated = await updateBlogPost(id, {
    title: body.title,
    slug: body.slug,
    content: body.content,
    excerpt: body.excerpt,
    image: body.image,
    tags: Array.isArray(body.tags) ? body.tags : [],
    published: body.published,
    publishedAt: body.published ? (body.publishedAt || now) : "",
  });

  if (!updated) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const ok = await deleteBlogPost(id);
  if (!ok) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ success: true });
}

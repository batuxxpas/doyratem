import { NextResponse } from "next/server";
import { getBlogPosts, insertBlogPost } from "@/lib/data";
import type { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const now = new Date().toISOString().split("T")[0];
  const post: BlogPost = {
    id: crypto.randomUUID(),
    title: body.title || "",
    slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9ğüşıöç\s]/g, "").replace(/\s+/g, "-") || now,
    content: body.content || "",
    excerpt: body.excerpt || "",
    image: body.image || "",
    tags: Array.isArray(body.tags) ? body.tags : [],
    published: body.published ?? false,
    publishedAt: body.published ? (body.publishedAt || now) : "",
    createdAt: now,
  };
  await insertBlogPost(post);
  return NextResponse.json(post, { status: 201 });
}

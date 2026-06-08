import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import { isValidImage } from "@/lib/utils";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(true);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt || `${post.title} - Doyratem Hijyen Blog`,
    keywords: post.tags.join(", ") || "temizlik, hijyen, Doyratem",
    openGraph: {
      title: `${post.title} | Doyratem Hijyen`,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
      type: "article",
      publishedTime: post.publishedAt,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) notFound();

  const allPosts = await getBlogPosts(true);
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <PageBanner
        title={post.title}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-500">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {post.publishedAt}
              </span>
            )}
            {post.tags.length > 0 && post.tags.map((tag) => (
              <span key={tag} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full font-medium text-xs">
                {tag}
              </span>
            ))}
          </div>

          {/* Cover Image */}
          {isValidImage(post.image) && (
            <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/9] relative">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-800
              prose-img:rounded-xl prose-img:shadow-md
              prose-ul:text-slate-600 prose-ol:text-slate-600
              prose-blockquote:border-cyan-500 prose-blockquote:text-slate-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share + Back */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tüm Yazılar
            </Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - https://doyratem.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.913.913l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.593-.826-6.332-2.207l-.443-.354-3.088 1.035 1.035-3.088-.354-.443A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp ile Paylaş
            </a>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Diğer Yazılar</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                    {p.image ? (
                      <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="400px" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-emerald-50" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">{p.title}</h3>
                    {p.excerpt && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

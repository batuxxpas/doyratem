import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageBanner from "@/components/ui/PageBanner";
import SectionTitle from "@/components/ui/SectionTitle";
import { getBlogPosts } from "@/lib/data";
import { isValidImage } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Blog | Doyratem Hijyen",
  description:
    "Temizlik sektörü haberleri, ürün rehberleri ve endüstriyel hijyen hakkında güncel blog yazıları.",
  keywords: "temizlik blog, hijyen makaleleri, temizlik rehberi, endüstriyel temizlik haberleri",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts(true); // sadece yayınlanmış

  return (
    <>
      <PageBanner
        title="Blog"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog" },
        ]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="Blog"
            title="Haberler & Makaleler"
            description="Temizlik sektöründen güncel bilgiler, ürün kullanım rehberleri ve ipuçları."
          />

          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p>Henüz blog yazısı bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                      {isValidImage(post.image) ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-emerald-50 flex items-center justify-center">
                          <svg className="w-14 h-14 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs font-medium bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-cyan-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    {post.excerpt && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{post.publishedAt}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                      >
                        Devamını Oku
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

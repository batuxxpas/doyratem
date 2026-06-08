import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import ProductCard from "@/components/products/ProductCard";
import { getCategoryBySlug, getCategories, getProductsByCategory } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategori Bulunamadı" };
  return {
    title: category.name,
    description: category.description || `${category.name} - Doyratem Hijyen toptan temizlik ürünleri`,
    openGraph: {
      title: `${category.name} | Doyratem Hijyen`,
      description: category.description,
      images: category.image ? [category.image] : undefined,
    },
    alternates: {
      canonical: `/kategoriler/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, allCategories] = await Promise.all([
    getProductsByCategory(category.id),
    getCategories(),
  ]);

  const bJsonLd = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: "/" },
    { name: "Ürünler", url: "/urunler" },
    { name: category.name },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bJsonLd) }}
      />
      <PageBanner
        title={category.name}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler", href: "/urunler" },
          { label: category.name },
        ]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-6 sticky top-28">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Kategoriler</h3>
                <nav className="space-y-1">
                  <Link
                    href="/urunler"
                    className="block px-4 py-2.5 text-sm text-slate-600 hover:text-cyan-600 hover:bg-white rounded-lg transition-colors"
                  >
                    Tüm Ürünler
                  </Link>
                  {allCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/kategoriler/${cat.slug}`}
                      className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                        cat.id === category.id
                          ? "font-medium text-cyan-600 bg-cyan-50"
                          : "text-slate-600 hover:text-cyan-600 hover:bg-white"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Products */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-1">{category.name}</h2>
                <p className="text-sm text-slate-500">{category.description}</p>
                <p className="text-sm text-slate-400 mt-2">
                  <span className="font-semibold text-slate-700">{products.length}</span> ürün listeleniyor
                </p>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      slug={product.slug}
                      brand={product.brand}
                      image={product.image}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-2xl">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <p className="text-slate-500">Bu kategoride henüz ürün bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

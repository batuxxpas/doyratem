import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import SectionTitle from "@/components/ui/SectionTitle";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, getCategories, getSeoByPageKey } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPageKey("products");
  return {
    title: seo?.metaTitle || "Ürünler",
    description:
      seo?.metaDescription ||
      "Doyratem Hijyen toptan temizlik ürünleri kataloğu. Endüstriyel temizlik ekipmanları ve malzemeleri.",
    keywords: seo?.metaKeywords || "temizlik ürünleri, toptan temizlik, endüstriyel temizlik ekipmanları",
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || "Ürünler | Doyratem Hijyen",
      description: seo?.ogDescription || seo?.metaDescription || undefined,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    alternates: {
      canonical: seo?.canonicalUrl || "/urunler",
    },
  };
}

export default async function UrunlerPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const getCategoryName = (catId: string) => categories.find((c) => c.id === catId)?.name;

  return (
    <>
      <PageBanner
        title="Ürünlerimiz"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler" },
        ]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-6 sticky top-28">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Kategoriler</h3>
                <nav className="space-y-1">
                  <Link
                    href="/urunler"
                    className="block px-4 py-2.5 text-sm font-medium text-cyan-600 bg-cyan-50 rounded-lg"
                  >
                    Tüm Ürünler
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/kategoriler/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:text-cyan-600 hover:bg-white rounded-lg transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{products.length}</span> ürün listeleniyor
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    slug={product.slug}
                    brand={product.brand}
                    image={product.image}
                    categoryName={getCategoryName(product.categoryId)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

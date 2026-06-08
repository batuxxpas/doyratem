import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import { getProductBySlug, getProducts, getCategories, getCategoryById } from "@/lib/data";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ProductCard from "@/components/products/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün Bulunamadı" };
  const category = await getCategoryById(product.categoryId);
  return {
    title: product.name,
    description: product.description || `${product.name} - Doyratem Hijyen toptan temizlik ürünleri`,
    openGraph: {
      title: `${product.name} | Doyratem Hijyen`,
      description: product.description,
      images: product.image ? [product.image] : undefined,
      type: "website",
    },
    alternates: {
      canonical: `/urunler/${product.slug}`,
    },
    keywords: [
      product.name,
      product.brand,
      category?.name,
      "temizlik ürünleri",
      "Doyratem",
    ]
      .filter(Boolean)
      .join(", "),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, allProducts] = await Promise.all([getCategories(), getProducts()]);
  const category = await getCategoryById(product.categoryId);
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const getCategoryName = (catId: string) => categories.find((c) => c.id === catId)?.name;

  const pJsonLd = productJsonLd(product, category?.name);
  const bJsonLd = breadcrumbJsonLd([
    { name: "Ana Sayfa", url: "/" },
    { name: "Ürünler", url: "/urunler" },
    ...(category ? [{ name: category.name, url: `/kategoriler/${category.slug}` }] : []),
    { name: product.name },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bJsonLd) }}
      />
      <PageBanner
        title={product.name}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler", href: "/urunler" },
          ...(category ? [{ label: category.name, href: `/kategoriler/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="bg-slate-50 rounded-3xl aspect-square relative overflow-hidden">
                {product.image && !product.image.includes("placeholder") ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-32 h-32 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-2">
                <span className="text-sm font-semibold text-cyan-600 tracking-wide uppercase">{product.brand}</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>
              <p className="text-slate-500 leading-relaxed mb-8">{product.description}</p>

              {/* Specs */}
              {Object.keys(product.specs).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Teknik Özellikler</h3>
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <div key={key} className={`flex items-center px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                        <span className="font-medium text-slate-700 w-1/3">{key}</span>
                        <span className="text-slate-500">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Tag */}
              {category && (
                <div className="mb-8">
                  <Link
                    href={`/kategoriler/${category.slug}`}
                    className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-sm text-slate-600 px-4 py-2 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    {category.name}
                  </Link>
                </div>
              )}

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/905421861699?text=${encodeURIComponent(`Merhaba, ${product.name} hakkında bilgi almak istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors w-full justify-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.913.913l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.593-.826-6.332-2.207l-.443-.354-3.088 1.035 1.035-3.088-.354-.443A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp ile Bilgi Al
              </a>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Benzer Ürünler</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    name={p.name}
                    slug={p.slug}
                    brand={p.brand}
                    image={p.image}
                    categoryName={getCategoryName(p.categoryId)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

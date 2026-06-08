import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { getProducts, getCategories } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";

export default async function ProductsPreview() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  const getCategoryName = (catId: string) => categories.find((c) => c.id === catId)?.name;

  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll animation="fade-up">
          <SectionTitle
            subtitle="Ürünler"
            title="Öne Çıkan Ürünlerimiz"
            description="Profesyonel temizlik ihtiyaçlarınız için geniş ürün yelpazemizi keşfedin."
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((product, i) => (
            <AnimateOnScroll key={product.id} animation="scale-in" delay={i * 60}>
              <ProductCard
                name={product.name}
                slug={product.slug}
                brand={product.brand}
                image={product.image}
                categoryName={getCategoryName(product.categoryId)}
              />
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll animation="fade-up" delay={300}>
          <div className="text-center mt-12">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors"
            >
              Tüm Ürünleri Görüntüle
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

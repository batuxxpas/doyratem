import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { getCategories } from "@/lib/data";

export default async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <section className="py-20 lg:py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll animation="fade-up">
          <SectionTitle
            subtitle="Kategoriler"
            title="Ürün Kategorilerimiz"
            description="İhtiyacınıza uygun kategoriyi seçerek ürünlerimizi keşfedin."
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {categories.slice(0, 9).map((category, i) => (
            <AnimateOnScroll key={category.id} animation="fade-up" delay={i * 80}>
              <Link
                href={`/kategoriler/${category.slug}`}
                className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 block"
              >
                <div className="p-6 lg:p-8">
                  <div className="w-12 h-12 bg-cyan-50 group-hover:bg-cyan-600 rounded-xl flex items-center justify-center mb-4 transition-colors overflow-hidden relative">
                    {category.image && !category.image.includes("placeholder") ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{category.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-cyan-600 font-medium">
                    <span>Ürünleri Gör</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

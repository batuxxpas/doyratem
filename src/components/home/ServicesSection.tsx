import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { getFeaturedServices } from "@/lib/data";
import { isValidImage } from "@/lib/utils";

const staggerClasses = ["stagger-1", "stagger-2", "stagger-3", "stagger-4"];

export default async function ServicesSection() {
  const featured = await getFeaturedServices();

  if (featured.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll animation="fade-up">
          <SectionTitle
            subtitle="Hizmetler"
            title="Öne Çıkan Hizmetlerimiz"
            description="İşletmenizin temizlik ihtiyaçlarına profesyonel ve kapsamlı çözümler sunuyoruz."
          />
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((service, i) => (
            <AnimateOnScroll
              key={service.slug}
              animation="fade-up"
              delay={i * 100}
              className={staggerClasses[i] ?? ""}
            >
              <Link
                href={`/hizmetler/${service.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-cyan-200 hover:shadow-xl transition-all duration-300 block"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                  {isValidImage(service.image) ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5 group-hover:text-cyan-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {service.shortDescription || service.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-sm text-cyan-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Detaylar</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll animation="fade-up" delay={400}>
          <div className="text-center mt-10">
            <Link href="/hizmetler" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
              Tüm Hizmetleri Gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

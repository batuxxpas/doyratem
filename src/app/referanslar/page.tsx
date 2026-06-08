import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/ui/PageBanner";
import SectionTitle from "@/components/ui/SectionTitle";
import { getReferences, getSeoByPageKey } from "@/lib/data";
import { isValidImage } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPageKey("references");
  return {
    title: seo?.metaTitle || "Referanslar",
    description:
      seo?.metaDescription ||
      "Doyratem Hijyen referansları ve iş ortaklarımız.",
    keywords: seo?.metaKeywords || "Doyratem referanslar, iş ortakları, kurumsal müşteriler",
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || "Referanslar | Doyratem Hijyen",
      description: seo?.ogDescription || seo?.metaDescription || undefined,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    alternates: {
      canonical: seo?.canonicalUrl || "/referanslar",
    },
  };
}

export default async function ReferanslarPage() {
  const references = await getReferences();

  return (
    <>
      <PageBanner
        title="Referanslar"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Referanslar" },
        ]}
      />

      {/* References Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="Referanslarımız"
            title="Güvenilir İş Ortaklıkları"
            description="Birlikte çalıştığımız değerli kurumsal müşterilerimiz."
          />

          {references.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {references.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-white border border-slate-100 rounded-2xl p-6 text-center hover:shadow-lg hover:border-slate-200 transition-all"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden relative">
                    {isValidImage(ref.image) ? (
                      <Image
                        src={ref.image}
                        alt={ref.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-slate-300">{ref.name[0]}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{ref.name}</h3>
                  {ref.sector && (
                    <p className="text-xs text-cyan-600 font-medium">{ref.sector}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p>Henüz referans eklenmemiş.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import { getServiceBySlug, getServices } from "@/lib/data";
import { serviceJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Hizmet Bulunamadı" };
  return {
    title: service.title,
    description: service.shortDescription || service.description || `${service.title} - Doyratem Hijyen`,
    openGraph: {
      title: `${service.title} | Doyratem Hijyen`,
      description: service.shortDescription || service.description,
      images: service.image ? [service.image] : undefined,
    },
    alternates: { canonical: `/hizmetler/${service.slug}` },
  };
}

const iconMap: Record<string, React.ReactNode> = {
  truck: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17a5 5 0 01-.916-9.916A5.002 5.002 0 0112 3c2.761 0 5 2.239 5 5a5 5 0 01-.916 9.916M12 3v14m0 0l-3-3m3 3l3-3" /></svg>,
  headphones: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  building: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  zap: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  shield: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  sparkles: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  clock: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  users: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  box: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
};

export default async function HizmetDetayPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const allServices = await getServices();
  const others = allServices.filter((s) => s.id !== service.id).slice(0, 3);

  const jsonLd = serviceJsonLd(service);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageBanner
        title={service.title}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hizmetlerimiz", href: "/hizmetler" },
          { label: service.title },
        ]}
      />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Info */}
            <div>
              <div className="w-20 h-20 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 text-cyan-600">
                {iconMap[service.icon] || iconMap.truck}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{service.title}</h1>
              {service.shortDescription && (
                <p className="text-lg text-cyan-700 font-medium mb-4 leading-relaxed">{service.shortDescription}</p>
              )}
              <p className="text-slate-500 leading-relaxed text-lg">{service.description}</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/905421861699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.913.913l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.593-.826-6.332-2.207l-.443-.354-3.088 1.035 1.035-3.088-.354-.443A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Hemen Teklif Al
                </a>
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:border-cyan-500 hover:text-cyan-600 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  İletişime Geç
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="bg-slate-100 rounded-3xl aspect-square relative overflow-hidden">
              {service.image && !service.image.includes("placeholder") ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-emerald-100 flex items-center justify-center">
                  <div className="text-cyan-200">
                    {iconMap[service.icon] || iconMap.truck}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Other Services */}
        {others.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mt-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Diğer Hizmetlerimiz</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {others.map((s) => (
                <Link
                  key={s.id}
                  href={`/hizmetler/${s.slug}`}
                  className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-cyan-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 mb-4 group-hover:bg-cyan-100 transition-colors">
                    {iconMap[s.icon] || iconMap.truck}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">{s.title}</h3>
                  {s.shortDescription && (
                    <p className="text-sm text-slate-500 line-clamp-2">{s.shortDescription}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

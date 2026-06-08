import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import SectionTitle from "@/components/ui/SectionTitle";
import { getSeoByPageKey } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPageKey("about");
  return {
    title: seo?.metaTitle || "Hakkımızda",
    description:
      seo?.metaDescription ||
      "Doyratem Hijyen hakkında bilgi edinin. Toptan temizlik ürünleri tedarikinde güvenilir çözüm ortağınız.",
    keywords: seo?.metaKeywords || "Doyratem Hijyen, hakkımızda, temizlik firması, toptan temizlik tedarikçisi",
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || "Hakkımızda | Doyratem Hijyen",
      description: seo?.ogDescription || seo?.metaDescription || undefined,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    alternates: {
      canonical: seo?.canonicalUrl || "/hakkimizda",
    },
  };
}

export default function HakkimizdaPage() {
  return (
    <>
      <PageBanner
        title="Hakkımızda"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hakkımızda" },
        ]}
      />

      {/* Main content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Text */}
            <div>
              <SectionTitle
                subtitle="Doyratem Hijyen"
                title="Temizlikte Güvenilir ve Kaliteli Çözümler"
                align="left"
              />
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-500 leading-relaxed mb-5">
                  <strong className="text-slate-800">Doyratem Hijyen</strong> olarak, hijyen ve temizlik sektöründe yenilikçi, dinamik ve çözüm odaklı bir 
                  yaklaşım ile yolculuğumuza başladık. Endüstriyel temizlikten ambalaj çözümlerine kadar 
                  uzanan geniş ürün yelpazemizle, işletmenizin hijyen standartlarını en üst seviyeye taşımak için 
                  heyecanla yanınızdayız.
                </p>
                <p className="text-slate-500 leading-relaxed mb-5">
                  <strong className="text-cyan-600">&ldquo;Temizlikte Güvenilir ve Kaliteli Çözümler&rdquo;</strong> ilkemizle, sektördeki en 
                  güncel standartları profesyonel hizmet anlayışımızla birleştiriyoruz.
                </p>

                <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">Hizmet ve Ürün Gruplarımız</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    <span className="text-slate-500"><strong className="text-slate-700">Endüstriyel Temizlik Ürünleri:</strong> Yüksek performanslı yüzey, zemin ve genel temizlik kimyasalları.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    <span className="text-slate-500"><strong className="text-slate-700">Kağıt Grubu:</strong> Endüstriyel havlu kağıtlar, tuvalet kağıtları ve dispenser uyumlu ürünler.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    <span className="text-slate-500"><strong className="text-slate-700">Ambalaj Ürünleri:</strong> Streç filmler, paketleme malzemeleri ve koruyucu ambalaj çözümleri.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    <span className="text-slate-500"><strong className="text-slate-700">Temizlik Ekipmanları:</strong> Temizlik arabaları, mop setleri ve profesyonel yardımcı ekipmanlar.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Visual + Stats */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-3xl aspect-video flex items-center justify-center">
                <svg className="w-20 h-20 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Kalite", desc: "Güvenilir markaların ürünleri" },
                  { title: "Hızlı Teslimat", desc: "Zamanında ve eksiksiz" },
                  { title: "Esnek Ödeme", desc: "İşletmenize uygun seçenekler" },
                  { title: "7/24 Destek", desc: "Her zaman yanınızdayız" },
                ].map((item) => (
                  <div key={item.title} className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-2xl p-6 text-center">
                    <div className="text-lg font-bold text-cyan-600 mb-1">{item.title}</div>
                    <div className="text-sm text-slate-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neden Doyratem */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="Neden Biz?"
            title="Neden Doyratem Hijyen?"
            description="Siparişlerinizde zamanında teslimat ve sürdürülebilir kaliteyi garanti ediyoruz."
          />
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-500 leading-relaxed text-center mb-10">
              Yeni kurulan bir firma olmanın verdiği çeviklikle, kurumsal yapınıza en uygun esnek ödeme seçeneklerini ve 
              hızlı teknik desteği sunarak, sadece bir tedarikçi değil, uzun vadeli ve güvenilir bir çözüm 
              ortağınız olmayı hedefliyoruz.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Zamanında Teslimat", desc: "Siparişlerinizi zamanında ve eksiksiz teslim ederek işletmenizin sürekliliğini sağlıyoruz." },
              { title: "Esnek Ödeme", desc: "Kurumsal yapınıza en uygun esnek ödeme seçenekleri ile çalışma kolaylığı sunuyoruz." },
              { title: "Hızlı Teknik Destek", desc: "Ürün seçimi ve kullanımı konusunda hızlı teknik destek ile yanınızdayız." },
              { title: "Geniş Ürün Yelpazesi", desc: "Endüstriyel temizlikten ambalaja kadar geniş ürün yelpazemizle tüm ihtiyaçlarınızı karşılıyoruz." },
              { title: "Sürdürülebilir Kalite", desc: "Kaliteli ürünler ve güvenilir markalarla sürdürülebilir hijyen standartları sunuyoruz." },
              { title: "Çözüm Ortağı", desc: "Sadece bir tedarikçi değil, uzun vadeli ve güvenilir bir çözüm ortağınız olmayı hedefliyoruz." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-7 border border-slate-100">
                <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Founder signature */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 italic mb-2">Saygılarımızla,</p>
            <p className="text-slate-700 font-semibold">Umut Doyranlı</p>
            <p className="text-cyan-600 text-sm font-medium">Doyratem Hijyen</p>
          </div>
        </div>
      </section>
    </>
  );
}

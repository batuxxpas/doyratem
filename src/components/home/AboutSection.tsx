import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const values = [
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Kalite Odaklı Ürünler",
    desc: "Tüm ürünlerimiz sektör standartlarına uygun, güvenilir tedarikçilerden temin edilmektedir.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Çözüm Odaklı Yaklaşım",
    desc: "İşletmenizin ihtiyaçlarını dinleyerek en uygun ürün ve fiyat seçeneklerini birlikte belirliyoruz.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Toptan Alım Kolaylığı",
    desc: "Geniş ürün yelpazemizden toptan sipariş verin, rekabetçi fiyatlarla ihtiyacınızı karşılayın.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-14 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 items-center">

          {/* Left - Content */}
          <AnimateOnScroll animation="slide-left">
            <SectionTitle
              subtitle="Doyratem Hijyen"
              title="Kalite ve Güven Odaklı Çözüm Ortağınız"
              align="left"
            />
            <p className="text-slate-500 leading-relaxed mb-6 text-sm">
              Hijyen ve temizlik sektöründe işletmenizin ihtiyaçlarına uygun toptan çözümler sunuyoruz.
              Endüstriyel temizlik, ambalaj, kağıt grubu ve temizlik ekipmanlarında
              doğru ürünü doğru fiyatla ulaştırmak önceliğimizdir.
            </p>

            {/* Value cards */}
            <div className="space-y-2 mb-6">
              {values.map((v, i) => (
                <AnimateOnScroll key={v.title} animation="fade-up" delay={100 + i * 100}>
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/30 transition-all duration-200 group">
                    <div className="w-9 h-9 bg-cyan-50 group-hover:bg-cyan-100 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                      {v.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 mb-0.5">{v.title}</div>
                      <div className="text-sm text-slate-500 leading-relaxed">{v.desc}</div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20"
            >
              Daha Fazla Bilgi
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimateOnScroll>

          {/* Right - Image */}
          <AnimateOnScroll animation="slide-right" delay={150}>
            <div className="relative flex justify-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full">
                <Image
                  src="/hizmetler/doyratemgorsel.png"
                  alt="Doyratem Hijyen Ürünleri"
                  width={700}
                  height={880}
                  className="w-full h-auto"
                  priority
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-gradient-to-br from-cyan-500 to-emerald-500 text-white rounded-2xl p-5 shadow-xl shadow-cyan-500/30">
                <div className="text-xl font-bold">Toptan</div>
                <div className="text-xs font-medium text-white/80 uppercase tracking-wider">Çözüm<br />Ortağı</div>
              </div>
            </div>
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}

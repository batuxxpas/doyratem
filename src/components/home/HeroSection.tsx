import Link from "next/link";

const cards = [
  { title: "Endüstriyel Temizlik", icon: "spray", cls: "hero-card-1" },
  { title: "Ambalaj Ürünleri",     icon: "package", cls: "hero-card-2" },
  { title: "Kağıt Grubu",          icon: "paper",   cls: "hero-card-3" },
  { title: "Temizlik Ekipmanları", icon: "tools",   cls: "hero-card-4" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/60 via-white to-emerald-50/40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left content */}
          <div>
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-cyan-600 text-sm font-medium">Toptan Temizlik Ürünleri</span>
            </div>

            {/* Heading */}
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-[1.1] mb-6">
              Temizlikte{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">
                Güvenilir
              </span>{" "}
              ve Kaliteli Çözümler
            </h1>

            {/* Description */}
            <p className="hero-desc text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              Endüstriyel temizlik, ambalaj ürünleri, kağıt grubu ve temizlik ekipmanlarında
              toptan çözüm ortağınız.
            </p>

            {/* Buttons */}
            <div className="hero-buttons flex flex-wrap gap-4">
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-7 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5"
              >
                Ürünlerimizi İnceleyin
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 border border-slate-300 hover:border-cyan-400 text-slate-600 hover:text-cyan-600 px-7 py-3.5 rounded-xl font-semibold transition-colors hover:-translate-y-0.5"
              >
                İletişime Geçin
              </Link>
            </div>
          </div>

          {/* Right - Product group cards */}
          <div className="grid grid-cols-2 gap-4 lg:pl-8">
            {cards.map((item) => (
              <div
                key={item.title}
                className={`${item.cls} bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-cyan-200 transition-all group`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:from-cyan-100 group-hover:to-emerald-100 transition-colors">
                  <ProductIcon type={item.icon} />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 group-hover:text-cyan-600 transition-colors">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom gradient divider */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500" />
    </section>
  );
}

function ProductIcon({ type }: { type: string }) {
  const cls = "w-6 h-6 text-cyan-500";
  switch (type) {
    case "spray":
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
    case "package":
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    case "paper":
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case "tools":
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    default:
      return null;
  }
}

import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Hizmetlerimiz", href: "/hizmetler" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Referanslar", href: "/referanslar" },
  { label: "İletişim", href: "/iletisim" },
];

const categories = [
  { label: "Yer Temizleme Grubu", href: "/kategoriler/yer-temizleme-grubu" },
  { label: "Cam Temizleme Grubu", href: "/kategoriler/cam-temizleme-grubu" },
  { label: "Kağıt Grubu", href: "/kategoriler/kagit-grubu" },
  { label: "Sıvı Grubu", href: "/kategoriler/sivi-grubu" },
  { label: "Çöp Kovaları", href: "/kategoriler/cop-kovalari" },
  { label: "Fırça Grubu", href: "/kategoriler/firca-grubu" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Contact Bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Adres</h4>
              <p className="text-sm leading-relaxed">Yeni Karaman Mah. 4.Orta Sok No:44/A<br />Osmangazi / Bursa</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Telefon</h4>
              <p className="text-sm">0542 186 16 99</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">E-posta</h4>
              <p className="text-sm">u.doyranli@doyratemhijyen.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About */}
        <div className="lg:col-span-1">
          <Link href="/" className="inline-flex mb-5">
            <div className="bg-white rounded-xl px-3 py-2">
              <Image
                src="/logo.png"
                alt="Doyratem Hijyen"
                width={150}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 mb-6">
            Toptan temizlik ürünleri tedariğinde güvenilir çözüm ortağınız. Kaliteli ürünleri uygun fiyatlarla sunuyoruz.
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://facebook.com/doyratemhijyen", label: "Facebook", icon: <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/> },
              { href: "https://instagram.com/doyratemhijyen", label: "Instagram", icon: <path d="M12,2.16c3.2,0,3.58.01,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s-.01,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33.01,7.05.07,2.7.27.27,2.69.07,7.05.01,8.33,0,8.74,0,12s.01,3.67.07,4.95c.2,4.36,2.62,6.78,6.98,6.98,1.28.06,1.69.07,4.95.07s3.67-.01,4.95-.07c4.35-.2,6.78-2.62,6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.36-2.62-6.78-6.98-6.98C15.67.01,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/> },
              { href: "https://linkedin.com/company/doyratemhijyen", label: "LinkedIn", icon: <path d="M20.45,20.45H16.89V14.88c0-1.33,0-3.04-1.85-3.04s-2.14,1.45-2.14,2.94v5.67H9.34V9h3.41v1.56h.05a3.74,3.74,0,0,1,3.37-1.85c3.6,0,4.27,2.37,4.27,5.46v6.28ZM5.34,7.43A2.07,2.07,0,1,1,7.41,5.36,2.07,2.07,0,0,1,5.34,7.43ZM7.12,20.45H3.56V9H7.12ZM22.22,0H1.77A1.75,1.75,0,0,0,0,1.73V22.27A1.75,1.75,0,0,0,1.77,24H22.22A1.76,1.76,0,0,0,24,22.27V1.73A1.76,1.76,0,0,0,22.22,0Z"/> },
              { href: "https://youtube.com/doyratemhijyen", label: "YouTube", icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/> },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{social.icon}</svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Hızlı Menü</h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Ürün Kategorileri</h4>
          <ul className="space-y-3">
            {categories.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Bültenimize Katılın</h4>
          <p className="text-sm text-slate-400 mb-4">Yeni ürünler ve kampanyalardan haberdar olun.</p>
          <form className="flex gap-2" action="#">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Doyratem Hijyen. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-slate-500">
            Toptan Temizlik Çözümleri
          </p>
        </div>
      </div>
    </footer>
  );
}

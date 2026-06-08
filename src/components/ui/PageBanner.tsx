import Link from "next/link";

interface PageBannerProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function PageBanner({ title, breadcrumbs }: PageBannerProps) {
  return (
    <section className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 py-16 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        <nav className="flex items-center justify-center gap-2 text-sm text-white/70">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              )}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}

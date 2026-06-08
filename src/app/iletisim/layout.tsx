import type { Metadata } from "next";
import { getSeoByPageKey } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPageKey("contact");
  return {
    title: seo?.metaTitle || "İletişim",
    description:
      seo?.metaDescription ||
      "Doyratem Hijyen ile iletişime geçin. Toptan temizlik ürünleri için teklif alın.",
    keywords: seo?.metaKeywords || "iletişim, Doyratem Hijyen, temizlik ürünleri teklif, Bursa temizlik",
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || "İletişim | Doyratem Hijyen",
      description: seo?.ogDescription || seo?.metaDescription || undefined,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    alternates: {
      canonical: seo?.canonicalUrl || "/iletisim",
    },
  };
}

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { getSettings } from "@/lib/data";
import type { Product, Service } from "@/lib/types";

const SITE_URL = process.env.SITE_URL || "https://doyratem.com";

export async function organizationJsonLd() {
  const settings = await getSettings();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.companyName || "Doyratem Hijyen",
    description:
      "Endüstriyel ve ticari temizlik ürünleri tedariğinde güvenilir çözüm ortağınız. Toptan temizlik, kağıt, ambalaj ve ekipman çözümleri.",
    url: SITE_URL,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressLocality: "Osmangazi",
          addressRegion: "Bursa",
          addressCountry: "TR",
        }
      : undefined,
    sameAs: [
      settings.socialMedia?.facebook,
      settings.socialMedia?.twitter,
      settings.socialMedia?.instagram,
      settings.socialMedia?.linkedin,
      settings.socialMedia?.youtube,
    ].filter(Boolean),
    priceRange: "$$",
    openingHours: "Mo-Sa 08:00-18:00",
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
    },
    knowsAbout: [
      "Endüstriyel temizlik ürünleri",
      "Toptan temizlik malzemeleri",
      "Hijyen ürünleri",
      "Temizlik ekipmanları",
      "Kağıt ürünleri",
      "Ambalaj çözümleri",
    ],
  };
}

export function productJsonLd(product: Product, categoryName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? `${SITE_URL}${product.image}` : undefined,
    brand: {
      "@type": "Brand",
      name: product.brand || "Doyratem",
    },
    category: categoryName,
    url: `${SITE_URL}/urunler/${product.slug}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "TRY",
      seller: {
        "@type": "Organization",
        name: "Doyratem Hijyen",
      },
    },
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description || service.shortDescription,
    provider: {
      "@type": "Organization",
      name: "Doyratem Hijyen",
    },
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
    },
    url: `${SITE_URL}/hizmetler`,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Doyratem Hijyen",
    url: SITE_URL,
    description:
      "Endüstriyel ve ticari temizlik ürünleri tedariğinde güvenilir çözüm ortağınız.",
    publisher: {
      "@type": "Organization",
      name: "Doyratem Hijyen",
    },
    inLanguage: "tr-TR",
  };
}

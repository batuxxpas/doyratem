import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import CategoriesSection from "@/components/home/CategoriesSection";
import CTASection from "@/components/home/CTASection";
import { getSeoByPageKey } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPageKey("home");
  return {
    title: seo?.metaTitle || "Doyratem Hijyen | Toptan Temizlik Ürünleri",
    description:
      seo?.metaDescription ||
      "Endüstriyel ve ticari temizlik ürünleri tedariğinde güvenilir çözüm ortağınız. Toptan temizlik, kağıt, ambalaj ve ekipman çözümleri.",
    keywords: seo?.metaKeywords || undefined,
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || undefined,
      description: seo?.ogDescription || seo?.metaDescription || undefined,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    alternates: {
      canonical: seo?.canonicalUrl || "/",
    },
  };
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProductsPreview />
      <CategoriesSection />
      <CTASection />
    </>
  );
}


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.SITE_URL || "https://doyratem.com";

export const metadata: Metadata = {
  title: {
    default: "Doyratem Hijyen | Toptan Temizlik Ürünleri",
    template: "%s | Doyratem Hijyen",
  },
  description:
    "Endüstriyel ve ticari temizlik ürünleri tedariğinde güvenilir çözüm ortağınız. Toptan temizlik, kağıt, ambalaj ve ekipman çözümleri.",
  keywords: [
    "temizlik ürünleri",
    "endüstriyel temizlik",
    "toptan temizlik",
    "hijyen ürünleri",
    "temizlik malzemeleri",
    "Bursa temizlik",
    "temizlik ekipmanları",
    "kağıt ürünleri",
    "ambalaj çözümleri",
    "Doyratem",
  ],
  authors: [{ name: "Doyratem Hijyen" }],
  creator: "Doyratem Hijyen",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Doyratem Hijyen",
    title: "Doyratem Hijyen | Toptan Temizlik Ürünleri",
    description:
      "Endüstriyel ve ticari temizlik ürünleri tedariğinde güvenilir çözüm ortağınız. Toptan temizlik, kağıt, ambalaj ve ekipman çözümleri.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doyratem Hijyen | Toptan Temizlik Ürünleri",
    description:
      "Endüstriyel ve ticari temizlik ürünleri tedariğinde güvenilir çözüm ortağınız.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [orgJsonLd, siteJsonLd] = await Promise.all([
    organizationJsonLd(),
    Promise.resolve(webSiteJsonLd()),
  ]);

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

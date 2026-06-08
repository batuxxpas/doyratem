"use client";

import { useState, useEffect } from "react";
import type { SeoPage } from "@/lib/types";

const SEO_PAGES = [
  { key: "home", label: "Ana Sayfa", path: "/" },
  { key: "products", label: "Ürünler", path: "/urunler" },
  { key: "services", label: "Hizmetler", path: "/hizmetler" },
  { key: "about", label: "Hakkımızda", path: "/hakkimizda" },
  { key: "contact", label: "İletişim", path: "/iletisim" },
  { key: "references", label: "Referanslar", path: "/referanslar" },
];

function emptyPage(key: string): SeoPage {
  return {
    id: crypto.randomUUID(),
    pageKey: key,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
  };
}

export default function AdminSeoPage() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/seo")
      .then((r) => r.json())
      .then((data: SeoPage[]) => {
        // Merge saved data with all page keys
        const merged = SEO_PAGES.map((sp) => {
          const existing = data.find((d) => d.pageKey === sp.key);
          return existing || emptyPage(sp.key);
        });
        setPages(merged);
        setLoading(false);
      });
  }, []);

  const activePage = pages.find((p) => p.pageKey === activeTab);

  function updateField(field: keyof SeoPage, value: string) {
    setPages((prev) =>
      prev.map((p) => (p.pageKey === activeTab ? { ...p, [field]: value } : p))
    );
    setSaved(false);
  }

  async function handleSave() {
    if (!activePage) return;
    setSaving(true);
    await fetch("/api/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activePage),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSaveAll() {
    setSaving(true);
    for (const page of pages) {
      await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!activePage) return null;

  const metaDescLen = activePage.metaDescription.length;
  const metaTitleLen = activePage.metaTitle.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">
            Sayfa bazlı meta etiketleri, Open Graph ve anahtar kelime yönetimi
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
        </button>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          SEO ayarları başarıyla kaydedildi.
        </div>
      )}

      {/* Page tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex overflow-x-auto px-4 pt-4 gap-1">
            {SEO_PAGES.map((sp) => (
              <button
                key={sp.key}
                onClick={() => setActiveTab(sp.key)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                  activeTab === sp.key
                    ? "bg-cyan-50 text-cyan-700 border border-slate-200 border-b-white -mb-px"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {sp.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 space-y-6">
          {/* Google Preview */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google Önizleme
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 max-w-xl">
              <p className="text-blue-800 text-lg leading-tight truncate">
                {activePage.metaTitle || "Sayfa Başlığı | Doyratem Hijyen"}
              </p>
              <p className="text-green-700 text-sm mt-0.5">
                doyratem.com{SEO_PAGES.find((s) => s.key === activeTab)?.path}
              </p>
              <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                {activePage.metaDescription || "Sayfa açıklaması burada görünecek..."}
              </p>
            </div>
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Meta Başlık (Title)
            </label>
            <input
              type="text"
              value={activePage.metaTitle}
              onChange={(e) => updateField("metaTitle", e.target.value)}
              placeholder="Sayfa başlığı — ideal: 50-60 karakter"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Önerilen: 50-60 karakter</span>
              <span
                className={`text-xs font-medium ${
                  metaTitleLen === 0
                    ? "text-slate-400"
                    : metaTitleLen <= 60
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {metaTitleLen}/60
              </span>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Meta Açıklama (Description)
            </label>
            <textarea
              rows={3}
              value={activePage.metaDescription}
              onChange={(e) => updateField("metaDescription", e.target.value)}
              placeholder="Sayfa açıklaması — ideal: 150-160 karakter"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Önerilen: 150-160 karakter</span>
              <span
                className={`text-xs font-medium ${
                  metaDescLen === 0
                    ? "text-slate-400"
                    : metaDescLen <= 160
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {metaDescLen}/160
              </span>
            </div>
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Anahtar Kelimeler (Keywords)
            </label>
            <input
              type="text"
              value={activePage.metaKeywords}
              onChange={(e) => updateField("metaKeywords", e.target.value)}
              placeholder="temizlik ürünleri, endüstriyel temizlik, toptan temizlik"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <span className="text-xs text-slate-400">Virgülle ayırarak yazın</span>
          </div>

          {/* Divider */}
          <hr className="border-slate-200" />

          {/* Open Graph */}
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
            Open Graph (Sosyal Medya Paylaşımı)
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">OG Başlık</label>
            <input
              type="text"
              value={activePage.ogTitle}
              onChange={(e) => updateField("ogTitle", e.target.value)}
              placeholder="Boş bırakılırsa Meta Başlık kullanılır"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">OG Açıklama</label>
            <textarea
              rows={2}
              value={activePage.ogDescription}
              onChange={(e) => updateField("ogDescription", e.target.value)}
              placeholder="Boş bırakılırsa Meta Açıklama kullanılır"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">OG Görsel URL</label>
            <input
              type="text"
              value={activePage.ogImage}
              onChange={(e) => updateField("ogImage", e.target.value)}
              placeholder="https://doyratem.com/og-image.jpg (1200x630 önerilir)"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <hr className="border-slate-200" />

          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Canonical URL
            </label>
            <input
              type="text"
              value={activePage.canonicalUrl}
              onChange={(e) => updateField("canonicalUrl", e.target.value)}
              placeholder="https://doyratem.com/urunler"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <span className="text-xs text-slate-400">
              Boş bırakılırsa otomatik oluşturulur
            </span>
          </div>

          {/* Save per tab */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Bu Sayfayı Kaydet"}
            </button>
          </div>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          SEO İpuçları
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span><strong>Meta Başlık:</strong> Ana anahtar kelimeyi başa yakın yerleştirin, 50-60 karakter arasında tutun.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span><strong>Meta Açıklama:</strong> Sayfa içeriğini özetleyin, eylem çağrısı ekleyin, 150-160 karakter ideal.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span><strong>Anahtar Kelimeler:</strong> "endüstriyel temizlik", "toptan temizlik ürünleri", "hijyen malzemeleri" gibi sektörel kelimeler kullanın.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span><strong>Open Graph:</strong> Sosyal medyada paylaşımlarda görünecek bilgileri özelleştirin. 1200×630px görsel önerilir.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

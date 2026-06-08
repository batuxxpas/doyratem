"use client";

import { useEffect, useState } from "react";

interface Settings {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  socialMedia: { facebook: string; instagram: string; twitter: string; linkedin: string; youtube: string };
  about: { title: string; description: string; experience: number };
}

export default function AdminAyarlarPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaving(false);
    setMsg(res.ok ? "Ayarlar kaydedildi." : "Hata oluştu.");
    setTimeout(() => setMsg(""), 3000);
  }

  if (!settings) return <p className="text-slate-500">Yükleniyor...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Site Ayarları</h2>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {/* Company Info */}
        <fieldset className="bg-white border border-slate-200 rounded-xl p-6">
          <legend className="text-lg font-semibold text-slate-900 px-2">Firma Bilgileri</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Firma Adı</span>
              <input className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.companyName} onChange={e => setSettings({ ...settings, companyName: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Telefon</span>
              <input className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">E-posta</span>
              <input type="email" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">WhatsApp</span>
              <input className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Adres</span>
              <textarea rows={2} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} />
            </label>
          </div>
        </fieldset>

        {/* Social Media */}
        <fieldset className="bg-white border border-slate-200 rounded-xl p-6">
          <legend className="text-lg font-semibold text-slate-900 px-2">Sosyal Medya</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {(Object.keys(settings.socialMedia) as (keyof typeof settings.socialMedia)[]).map(key => (
              <label key={key} className="block">
                <span className="text-sm font-medium text-slate-700 capitalize">{key}</span>
                <input className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.socialMedia[key]} onChange={e => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, [key]: e.target.value } })} />
              </label>
            ))}
          </div>
        </fieldset>

        {/* About */}
        <fieldset className="bg-white border border-slate-200 rounded-xl p-6">
          <legend className="text-lg font-semibold text-slate-900 px-2">Hakkımızda</legend>
          <div className="space-y-4 mt-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Başlık</span>
              <input className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.about.title} onChange={e => setSettings({ ...settings, about: { ...settings.about, title: e.target.value } })} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Açıklama</span>
              <textarea rows={4} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.about.description} onChange={e => setSettings({ ...settings, about: { ...settings.about, description: e.target.value } })} />
            </label>
            <label className="block max-w-xs">
              <span className="text-sm font-medium text-slate-700">Deneyim (Yıl)</span>
              <input type="number" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={settings.about.experience} onChange={e => setSettings({ ...settings, about: { ...settings.about, experience: Number(e.target.value) } })} />
            </label>
          </div>
        </fieldset>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          {msg && <span className="text-sm font-medium text-emerald-600">{msg}</span>}
        </div>
      </form>
    </div>
  );
}

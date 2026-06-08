"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Service } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import DeleteModal from "@/components/admin/DeleteModal";
import { isValidImage } from "@/lib/utils";

const MAX_FEATURED = 4;

const iconOptions = [
  { value: "truck", label: "Tedarik" },
  { value: "sparkles", label: "Temizlik" },
  { value: "box", label: "Paket / Kargo" },
  { value: "leaf", label: "Doğa Dostu" },
  { value: "headphones", label: "Destek" },
  { value: "building", label: "Kurumsal" },
  { value: "zap", label: "Hızlı" },
  { value: "shield", label: "Güvenlik" },
  { value: "clock", label: "7/24 Hizmet" },
  { value: "users", label: "Ekip" },
  { value: "wrench", label: "Teknik Servis" },
  { value: "chart", label: "Analiz / Rapor" },
  { value: "globe", label: "Global" },
  { value: "star", label: "Premium" },
  { value: "phone", label: "İletişim" },
  { value: "clipboard", label: "Planlama" },
];

export default function AdminHizmetlerPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const featuredCount = services.filter((s) => s.featured).length;

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  function openForm(service?: Service) {
    setEditing(service || null);
    setImageUrl(service?.image || "");
    setImageError(false);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setImageUrl("");
    setImageError(false);
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) {
      setImageError(true);
      return;
    }
    const form = new FormData(e.currentTarget);
    const featured = (form.get("featured") as string) === "on";

    if (featured && !editing?.featured && featuredCount >= MAX_FEATURED) {
      alert(`En fazla ${MAX_FEATURED} hizmet öne çıkan olarak işaretlenebilir. Önce bir hizmetin öne çıkan özelliğini kaldırın.`);
      return;
    }

    const data = {
      title: form.get("title"),
      slug: form.get("slug"),
      description: form.get("description"),
      shortDescription: form.get("shortDescription"),
      icon: form.get("icon") || "truck",
      image: imageUrl,
      featured,
    };

    if (editing) {
      const res = await fetch(`/api/services/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } else {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      if (created.id) setServices((prev) => [...prev, created]);
    }
    closeForm();
  }

  async function toggleFeatured(service: Service) {
    if (!service.featured && featuredCount >= MAX_FEATURED) {
      alert(`En fazla ${MAX_FEATURED} hizmet öne çıkan olarak işaretlenebilir.`);
      return;
    }
    const res = await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !service.featured }),
    });
    const updated = await res.json();
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await fetch(`/api/services/${deleteId}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hizmetler</h2>
          <p className="text-sm text-slate-500 mt-1">{services.length} hizmet</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Hizmet
        </button>
      </div>

      <div className={`flex items-center gap-3 rounded-xl px-5 py-3.5 mb-6 text-sm font-medium border ${featuredCount >= MAX_FEATURED ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-cyan-50 text-cyan-700 border-cyan-100"}`}>
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
        Ana sayfada öne çıkan: <strong>{featuredCount} / {MAX_FEATURED}</strong>
        {featuredCount >= MAX_FEATURED && <span className="ml-1">— Yeni öne çıkan eklemek için birini kaldırın.</span>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editing ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}</h3>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Hizmet Başlığı *</span>
                <input
                  name="title"
                  required
                  defaultValue={editing?.title}
                  onChange={(e) => {
                    if (!editing) {
                      const slugField = e.currentTarget.form?.querySelector<HTMLInputElement>('[name="slug"]');
                      if (slugField) slugField.value = generateSlug(e.currentTarget.value);
                    }
                  }}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">URL (slug) *</span>
                <input
                  name="slug"
                  required
                  defaultValue={editing?.slug}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Kısa Açıklama</span>
                <input
                  name="shortDescription"
                  defaultValue={editing?.shortDescription}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Kart ve listelemeler için kısa açıklama"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Detaylı Açıklama</span>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editing?.description}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">İkon</span>
                <select
                  name="icon"
                  defaultValue={editing?.icon || "truck"}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {iconOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <div>
                <span className="text-sm font-medium text-slate-700 block mb-1">
                  Görsel <span className="text-red-500">*</span>
                </span>
                <ImageUpload
                  folder="services"
                  currentImage={imageUrl}
                  onUploaded={(url) => { setImageUrl(url); setImageError(false); }}
                />
                {imageError && <p className="text-red-500 text-xs mt-1">Görsel yüklemek zorunludur.</p>}
              </div>
              <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${!editing?.featured && featuredCount >= MAX_FEATURED ? "bg-amber-50" : "bg-slate-50"}`}>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  defaultChecked={editing?.featured}
                  disabled={!editing?.featured && featuredCount >= MAX_FEATURED}
                  className="w-4 h-4 rounded text-cyan-600 disabled:opacity-40"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                  Öne Çıkan Hizmet
                  <span className="ml-2 text-xs text-slate-400">({featuredCount}/{MAX_FEATURED} dolu)</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                  {editing ? "Güncelle" : "Ekle"}
                </button>
                <button type="button" onClick={closeForm} className="px-6 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors">
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
          <p className="text-slate-500 mb-4">Henüz hizmet eklenmemiş</p>
          <button onClick={() => openForm()} className="text-sm text-cyan-600 font-semibold hover:underline">İlk hizmeti ekle</button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 w-16">Görsel</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Hizmet</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Öne Çıkan</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    {isValidImage(service.image) ? (
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 relative">
                        <Image src={service.image} alt={service.title} fill className="object-cover" sizes="56px" />
                      </div>
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-900 text-sm">{service.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">/{service.slug}</div>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleFeatured(service)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${service.featured ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      title={service.featured ? "Öne çıkandan kaldır" : "Öne çıkan yap"}
                    >
                      <svg className={`w-3.5 h-3.5 ${service.featured ? "fill-amber-500" : "fill-slate-300"}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      {service.featured ? "Öne Çıkan" : "Ekle"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openForm(service)} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors" title="Düzenle">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setDeleteId(service.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteModal
        open={!!deleteId}
        title="Hizmeti Sil"
        message="Bu hizmeti silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

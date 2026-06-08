"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminKategorilerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [specFields, setSpecFields] = useState<string[]>([]);
  const [newSpecField, setNewSpecField] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((data) => { setCategories(data); setLoading(false); });
  }, []);

  async function confirmDelete() {
    if (!deleteId) return;
    await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      image: imageUrl || "/images/categories/placeholder.jpg",
      specFields,
    };

    if (editing) {
      const res = await fetch(`/api/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      if (created.id) setCategories((prev) => [...prev, created]);
    }

    setShowForm(false);
    setEditing(null);
    setImageUrl("");
    setSpecFields([]);
    setNewSpecField("");
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Kategoriler</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setImageUrl(""); setSpecFields([]); setNewSpecField(""); }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Kategori
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {editing ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Adı</label>
                <input
                  name="name"
                  required
                  defaultValue={editing?.name}
                  onChange={(e) => {
                    if (!editing) {
                      const slugField = e.currentTarget.form?.querySelector<HTMLInputElement>('[name="slug"]');
                      if (slugField) slugField.value = generateSlug(e.currentTarget.value);
                    }
                  }}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                <input
                  name="slug"
                  required
                  defaultValue={editing?.slug}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editing?.description}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              <ImageUpload
                folder="categories"
                currentImage={editing?.image}
                onUploaded={(url) => setImageUrl(url)}
              />

              {/* Teknik Özellik Alanları */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Teknik Özellik Alanları</label>
                <p className="text-xs text-slate-400 mb-3">Bu kategorideki ürünlere eklenecek teknik özellik başlıklarını belirleyin.</p>
                
                {specFields.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {specFields.map((field, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-sm text-slate-700 flex-1">{field}</span>
                        <button
                          type="button"
                          onClick={() => setSpecFields((prev) => prev.filter((_, i) => i !== index))}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecField}
                    onChange={(e) => setNewSpecField(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = newSpecField.trim();
                        if (val && !specFields.includes(val)) {
                          setSpecFields((prev) => [...prev, val]);
                          setNewSpecField("");
                        }
                      }
                    }}
                    placeholder="Örn: Malzeme, Ağırlık, Boyut..."
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = newSpecField.trim();
                      if (val && !specFields.includes(val)) {
                        setSpecFields((prev) => [...prev, val]);
                        setNewSpecField("");
                      }
                    }}
                    className="bg-cyan-50 text-cyan-600 hover:bg-cyan-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ekle
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  {editing ? "Güncelle" : "Ekle"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setImageUrl(""); setSpecFields([]); setNewSpecField(""); }} className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-1">{cat.name}</h3>
            <p className="text-sm text-slate-400 mb-1">/{cat.slug}</p>
            <p className="text-sm text-slate-500 mb-2 line-clamp-2">{cat.description}</p>
            {cat.specFields && cat.specFields.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {cat.specFields.map((f) => (
                  <span key={f} className="bg-cyan-50 text-cyan-600 text-xs px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setEditing(cat); setShowForm(true); setImageUrl(cat.image || ""); setSpecFields(cat.specFields || []); setNewSpecField(""); }}
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Düzenle
              </button>
              <button
                onClick={() => setDeleteId(cat.id)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      <DeleteModal
        open={!!deleteId}
        title="Kategoriyi Sil"
        message="Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

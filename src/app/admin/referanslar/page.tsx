"use client";

import { useState, useEffect } from "react";
import type { Reference } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminReferanslarPage() {
  const [references, setReferences] = useState<Reference[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRef, setEditingRef] = useState<Reference | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await fetch("/api/references");
    setReferences(await res.json());
    setLoading(false);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await fetch(`/api/references/${deleteId}`, { method: "DELETE" });
    setReferences((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      sector: form.get("sector"),
      image: imageUrl,
    };

    if (editingRef) {
      const res = await fetch(`/api/references/${editingRef.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setReferences((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const res = await fetch("/api/references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      if (created.id) setReferences((prev) => [...prev, created]);
    }

    setShowForm(false);
    setEditingRef(null);
    setImageUrl("");
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Referanslar</h2>
        <button
          onClick={() => { setShowForm(true); setEditingRef(null); setImageUrl(""); }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Referans
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {editingRef ? "Referans Düzenle" : "Yeni Referans Ekle"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Firma Adı</label>
                <input
                  name="name"
                  required
                  defaultValue={editingRef?.name}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="Örn: Grand Hyatt İstanbul"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sektör</label>
                <input
                  name="sector"
                  defaultValue={editingRef?.sector}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="Örn: Otel, Sağlık, Perakende"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Firma Logosu</label>
                <ImageUpload
                  folder="services"
                  currentImage={editingRef?.image}
                  onUploaded={(url) => setImageUrl(url)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  {editingRef ? "Güncelle" : "Ekle"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingRef(null); setImageUrl(""); }} className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* References Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {references.map((ref) => (
          <div key={ref.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                {ref.image ? (
                  <img src={ref.image} alt={ref.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-slate-300">{ref.name[0]}</span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditingRef(ref); setShowForm(true); setImageUrl(ref.image || ""); }}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium px-2 py-1"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setDeleteId(ref.id)}
                  className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1"
                >
                  Sil
                </button>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-slate-900">{ref.name}</h4>
            {ref.sector && (
              <p className="text-xs text-cyan-600 font-medium mt-0.5">{ref.sector}</p>
            )}
          </div>
        ))}
      </div>

      {references.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          <p className="text-slate-400 text-sm">Henüz referans eklenmemiş.</p>
          <button
            onClick={() => { setShowForm(true); setEditingRef(null); setImageUrl(""); }}
            className="mt-3 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
          >
            İlk referansı ekle →
          </button>
        </div>
      )}

      <DeleteModal
        open={!!deleteId}
        title="Referansı Sil"
        message="Bu referansı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

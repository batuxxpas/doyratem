"use client";

import { useState, useEffect } from "react";
import type { Product, Category } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminUrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [prodRes, catRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
    ]);
    setProducts(await prodRes.json());
    setCategories(await catRes.json());
    setLoading(false);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      categoryId: form.get("categoryId"),
      brand: form.get("brand"),
      image: imageUrl || "/images/products/placeholder.jpg",
      featured: form.get("featured") === "on",
      specs: Object.fromEntries(Object.entries(specs).filter(([, v]) => v.trim() !== "")),
    };

    if (editingProduct) {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      if (created.id) setProducts((prev) => [...prev, created]);
    }

    setShowForm(false);
    setEditingProduct(null);
    setImageUrl("");
    setSpecs({});
    setSelectedCategoryId("");
  }

  function getCategoryName(catId: string) {
    return categories.find((c) => c.id === catId)?.name || "-";
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
        <h2 className="text-2xl font-bold text-slate-900">Ürünler</h2>
        <button
          onClick={() => { setShowForm(true); setEditingProduct(null); setImageUrl(""); setSpecs({}); setSelectedCategoryId(""); }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Ürün
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ürün Adı</label>
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name}
                  onChange={(e) => {
                    if (!editingProduct) {
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
                  defaultValue={editingProduct?.slug}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct?.description}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select
                    name="categoryId"
                    required
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      // Keep existing specs, just let the UI show new fields
                    }}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Seçiniz</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marka</label>
                  <input
                    name="brand"
                    defaultValue={editingProduct?.brand || "Doyratem"}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Teknik Özellikler - Kategoriye göre otomatik */}
              {(() => {
                const selectedCat = categories.find((c) => c.id === selectedCategoryId);
                const fields = selectedCat?.specFields || [];
                if (fields.length === 0) return null;
                return (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Teknik Özellikler
                      <span className="text-xs text-slate-400 font-normal">({selectedCat?.name})</span>
                    </h4>
                    <div className="space-y-3">
                      {fields.map((field) => (
                        <div key={field} className="flex items-center gap-3">
                          <label className="text-sm text-slate-600 w-28 shrink-0">{field}</label>
                          <input
                            type="text"
                            value={specs[field] || ""}
                            onChange={(e) => setSpecs((prev) => ({ ...prev, [field]: e.target.value }))}
                            placeholder={`${field} giriniz...`}
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <ImageUpload
                folder="products"
                currentImage={editingProduct?.image}
                onUploaded={(url) => setImageUrl(url)}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={editingProduct?.featured}
                  className="rounded border-slate-300"
                />
                <label htmlFor="featured" className="text-sm text-slate-700">Öne çıkan ürün</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  {editingProduct ? "Güncelle" : "Ekle"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); setImageUrl(""); setSpecs({}); setSelectedCategoryId(""); }} className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Ürün</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Marka</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Kategori</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Öne Çıkan</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="px-6 py-3.5 text-sm font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-3.5 text-sm text-slate-500">{product.brand}</td>
                <td className="px-6 py-3.5 text-sm text-slate-500">{getCategoryName(product.categoryId)}</td>
                <td className="px-6 py-3.5">
                  {product.featured && (
                    <span className="bg-cyan-50 text-cyan-600 text-xs font-medium px-2 py-1 rounded-full">Evet</span>
                  )}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <button
                    onClick={() => { setEditingProduct(product); setShowForm(true); setImageUrl(product.image || ""); setSpecs(product.specs || {}); setSelectedCategoryId(product.categoryId); }}
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium mr-4"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">Henüz ürün eklenmemiş.</div>
        )}
      </div>

      <DeleteModal
        open={!!deleteId}
        title="Ürünü Sil"
        message="Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

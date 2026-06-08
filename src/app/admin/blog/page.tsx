"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import DeleteModal from "@/components/admin/DeleteModal";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/blog").then((r) => r.json()).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  function openForm(post?: BlogPost) {
    setEditing(post || null);
    setImageUrl(post?.image || "");
    setTags(post?.tags?.join(", ") || "");
    setContent(post?.content || "");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setImageUrl("");
    setTags("");
    setContent("");
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const published = form.get("published") === "on";
    const today = new Date().toISOString().split("T")[0];
    const data = {
      title: form.get("title"),
      slug: form.get("slug") || slugify(form.get("title") as string),
      content,
      excerpt: form.get("excerpt"),
      image: imageUrl,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published,
      publishedAt: published ? (editing?.publishedAt || today) : "",
    };

    if (editing) {
      const res = await fetch(`/api/blog/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      if (created.id) setPosts((prev) => [created, ...prev]);
    }
    closeForm();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await fetch(`/api/blog/${deleteId}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Blog</h2>
          <p className="text-sm text-slate-500 mt-1">{posts.length} yazı</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Yazı
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editing ? "Yazıyı Düzenle" : "Yeni Blog Yazısı"}</h3>
              <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Başlık *</span>
                  <input
                    name="title"
                    required
                    defaultValue={editing?.title}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Blog yazısı başlığı"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">URL (slug)</span>
                  <input
                    name="slug"
                    defaultValue={editing?.slug}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="otomatik-olusturulur"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Etiketler</span>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="temizlik, hijyen, ipuçları"
                  />
                  <p className="text-xs text-slate-400 mt-1">Virgülle ayırın</p>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Özet</span>
                <textarea
                  name="excerpt"
                  rows={2}
                  defaultValue={editing?.excerpt}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Yazının kısa özeti (liste sayfasında görünür)"
                />
              </label>

              <div>
                <span className="text-sm font-medium text-slate-700 block mb-1">İçerik</span>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Blog yazısı içeriğini buraya yazın..."
                />
              </div>

              <div>
                <span className="text-sm font-medium text-slate-700 block mb-2">Kapak Görseli</span>
                <ImageUpload
                  currentImage={imageUrl}
                  onUploaded={setImageUrl}
                  folder="blog"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  defaultChecked={editing?.published}
                  className="w-4 h-4 rounded text-cyan-600"
                />
                <label htmlFor="published" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Yayınla (sitede görünür)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  {editing ? "Güncelle" : "Yayınla"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Table */}
      {posts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
          <svg className="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-slate-500 mb-4">Henüz blog yazısı yok</p>
          <button onClick={() => openForm()} className="text-sm text-cyan-600 font-semibold hover:underline">
            İlk yazıyı ekle
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Başlık</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Etiketler</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Durum</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Tarih</th>
                <th className="px-6 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 text-sm">{post.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">/blog/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Yayında
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        Taslak
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 hidden lg:table-cell">
                    {post.publishedAt || post.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openForm(post)}
                        className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
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
        title="Blog Yazısını Sil"
        message="Bu blog yazısı kalıcı olarak silinecek."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

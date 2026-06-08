"use client";

import { useEffect, useState } from "react";
import type { ContactMessage } from "@/lib/types";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminMesajlarPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.reverse());
        setLoading(false);
      });
  }, []);

  async function markAsRead(id: string) {
    const res = await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/contact/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== deleteId));
    }
    setDeleteId(null);
  }

  const unreadCount = messages.filter((m) => !m.read).length;

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
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Mesajlar</h2>
          {unreadCount > 0 && (
            <span className="bg-cyan-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {unreadCount} yeni
            </span>
          )}
        </div>
        <span className="text-sm text-slate-400">Toplam {messages.length} mesaj</span>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <p className="text-slate-500">Henüz mesaj bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white border rounded-xl transition-all ${
                  msg.read
                    ? "border-slate-200"
                    : "border-cyan-200 bg-cyan-50/30 shadow-sm"
                }`}
              >
                {/* Header - clickable */}
                <button
                  onClick={() => {
                    setExpandedId(isExpanded ? null : msg.id);
                    if (!msg.read) markAsRead(msg.id);
                  }}
                  className="w-full text-left px-6 py-4 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        msg.read ? "bg-slate-300" : "bg-cyan-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <h3 className={`text-sm ${msg.read ? "font-medium text-slate-700" : "font-semibold text-slate-900"}`}>
                        {msg.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {msg.email}{msg.phone ? ` · ${msg.phone}` : ""}
                      </p>
                      <p className={`text-sm mt-1 truncate ${msg.read ? "text-slate-500" : "text-cyan-700 font-medium"}`}>
                        {msg.subject}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                    {!msg.read && (
                      <span className="bg-cyan-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Yeni
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-6 pb-5 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed pt-4 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                      {!msg.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(msg.id);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Okundu İşaretle
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(msg.id);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={!!deleteId}
        title="Mesajı Sil"
        message="Bu mesajı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

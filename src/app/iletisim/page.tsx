"use client";

import { useState } from "react";
import PageBanner from "@/components/ui/PageBanner";

export default function IletisimPage() {
  return (
    <>
      <PageBanner
        title="İletişim"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İletişim" },
        ]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Bizi Ziyaret Edin</h2>
              <div className="bg-slate-100 rounded-2xl overflow-hidden aspect-[4/3] mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3047.5!2d28.9484!3d40.1885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDExJzE4LjYiTiAyOMKwNTYnNTQuMiJF!5e0!3m2!1str!2str!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Doyratem Hijyen Konum"
                />
              </div>

              {/* Contact info cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <h4 className="font-semibold text-slate-900">Telefon</h4>
                  </div>
                  <p className="text-sm text-slate-500">0542 186 16 99</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h4 className="font-semibold text-slate-900">E-posta</h4>
                  </div>
                  <p className="text-sm text-slate-500">u.doyranli@doyratemhijyen.com</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 sm:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h4 className="font-semibold text-slate-900">Adres</h4>
                  </div>
                  <p className="text-sm text-slate-500">Yeni Karaman Mah. 4.Orta Sok No:44/A, Osmangazi / Bursa</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Bize Yazın</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Ad Soyad</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            placeholder="Adınız Soyadınız"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">E-posta</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            placeholder="ornek@mail.com"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Telefon</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            placeholder="+90 5XX XXX XX XX"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">Konu</label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            placeholder="Konu"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">Mesaj</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
          placeholder="Mesajınızı yazın..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white py-3.5 rounded-xl font-semibold transition-colors"
      >
        {status === "loading" ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>

      {status === "success" && (
        <div className="bg-green-50 text-green-700 text-sm rounded-xl p-4 text-center">
          Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 text-red-700 text-sm rounded-xl p-4 text-center">
          Bir hata oluştu. Lütfen tekrar deneyin.
        </div>
      )}
    </form>
  );
}

import Link from "next/link";
import { getProducts, getCategories, getServices, getMessages, getBlogPosts } from "@/lib/data";

export default async function AdminDashboard() {
  const [products, categories, services, messages, blogPosts] = await Promise.all([
    getProducts(),
    getCategories(),
    getServices(),
    getMessages(),
    getBlogPosts(),
  ]);

  const unreadMessages = messages.filter((m) => !m.read).length;
  const recentMessages = [...messages].reverse().slice(0, 5);

  const stats = [
    { label: "Ürünler", value: products.length, href: "/admin/urunler", color: "bg-cyan-50 text-cyan-600" },
    { label: "Kategoriler", value: categories.length, href: "/admin/kategoriler", color: "bg-emerald-50 text-emerald-600" },
    { label: "Blog Yazıları", value: blogPosts.length, href: "/admin/blog", color: "bg-violet-50 text-violet-600" },
    { label: "Mesajlar", value: messages.length, href: "/admin/mesajlar", color: "bg-amber-50 text-amber-600", badge: unreadMessages > 0 ? unreadMessages : undefined },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">{stat.label}</span>
              {stat.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stat.badge} yeni</span>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Hızlı İşlemler</h3>
      <div className="grid sm:grid-cols-4 gap-4 mb-10">
        <Link href="/admin/urunler?action=new" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Yeni Ürün Ekle</div>
            <div className="text-xs text-slate-400">Ürün kataloğuna ekleyin</div>
          </div>
        </Link>
        <Link href="/admin/kategoriler?action=new" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Yeni Kategori</div>
            <div className="text-xs text-slate-400">Kategori oluşturun</div>
          </div>
        </Link>
        <Link href="/admin/blog" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Blog Yazısı</div>
            <div className="text-xs text-slate-400">Yeni içerik ekleyin</div>
          </div>
        </Link>
        <Link href="/admin/mesajlar" className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Mesajlar</div>
            <div className="text-xs text-slate-400">{unreadMessages > 0 ? `${unreadMessages} okunmamış mesaj` : "Tüm mesajları görüntüle"}</div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Son Eklenen Ürünler</h3>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Ürün</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Kategori</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(-5).reverse().map((product) => {
                  const cat = categories.find((c) => c.id === product.categoryId);
                  return (
                    <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900 max-w-[160px] truncate">{product.name}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{cat?.name || "-"}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-400 whitespace-nowrap">{product.createdAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Son Mesajlar</h3>
            {unreadMessages > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadMessages} okunmamış</span>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {recentMessages.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">Henüz mesaj yok</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    href="/admin/mesajlar"
                    className={`block px-5 py-4 hover:bg-slate-50 transition-colors ${!msg.read ? "border-l-2 border-l-cyan-500" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${!msg.read ? "text-slate-900" : "text-slate-600"}`}>{msg.name}</span>
                          {!msg.read && <span className="w-2 h-2 bg-cyan-500 rounded-full shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{msg.subject}</p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">{msg.createdAt}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

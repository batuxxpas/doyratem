/**
 * Turso seed script: JSON verilerini Turso veritabanına aktarır.
 * Kullanım: npx tsx scripts/seed-turso.ts
 */
import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const dataDir = path.join(process.cwd(), "data");

function readJSON<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [] as unknown as T;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

async function main() {
  console.log("🗑️  Mevcut veriler temizleniyor...");
  await client.batch([
    "DELETE FROM products",
    "DELETE FROM categories",
    "DELETE FROM services",
    "DELETE FROM contact_messages",
    "DELETE FROM settings",
    'DELETE FROM "references"',
  ], "write");

  // Seed categories
  console.log("📦 Kategoriler yükleniyor...");
  const categories = readJSON<Array<{
    id: string; name: string; slug: string; description: string;
    image: string; specFields: string[]; order: number;
  }>>("categories.json");

  for (const c of categories) {
    await client.execute({
      sql: `INSERT INTO categories (id, name, slug, description, image, spec_fields, "order") VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [c.id, c.name, c.slug, c.description || "", c.image || "", JSON.stringify(c.specFields || []), c.order],
    });
  }
  console.log(`  ✅ ${categories.length} kategori eklendi`);

  // Seed products
  console.log("📦 Ürünler yükleniyor...");
  const products = readJSON<Array<{
    id: string; name: string; slug: string; description: string;
    categoryId: string; brand: string; image: string; images: string[];
    specs: Record<string, string>; featured: boolean; order: number; createdAt: string;
  }>>("products.json");

  for (const p of products) {
    await client.execute({
      sql: `INSERT INTO products (id, name, slug, description, category_id, brand, image, images, specs, featured, "order", created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id, p.name, p.slug, p.description || "",
        p.categoryId, p.brand || "Doyratem", p.image || "",
        JSON.stringify(p.images || []), JSON.stringify(p.specs || {}),
        p.featured ? 1 : 0, p.order, p.createdAt,
      ],
    });
  }
  console.log(`  ✅ ${products.length} ürün eklendi`);

  // Seed services
  console.log("📦 Hizmetler yükleniyor...");
  const services = readJSON<Array<{
    id: string; title: string; slug: string; description: string;
    shortDescription: string; image: string; icon: string; order: number; featured?: boolean;
  }>>("services.json");

  for (const s of services) {
    await client.execute({
      sql: `INSERT INTO services (id, title, slug, description, short_description, image, icon, "order", featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [s.id, s.title, s.slug, s.description || "", s.shortDescription || "", s.image || "", s.icon || "truck", s.order, s.featured ? 1 : 0],
    });
  }
  console.log(`  ✅ ${services.length} hizmet eklendi`);

  // Seed messages
  console.log("📦 Mesajlar yükleniyor...");
  const messages = readJSON<Array<{
    id: string; name: string; email: string; phone: string;
    subject: string; message: string; createdAt: string; read: boolean;
  }>>("messages.json");

  for (const m of messages) {
    await client.execute({
      sql: `INSERT INTO contact_messages (id, name, email, phone, subject, message, created_at, read) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [m.id, m.name, m.email, m.phone || "", m.subject, m.message, m.createdAt, m.read ? 1 : 0],
    });
  }
  console.log(`  ✅ ${messages.length} mesaj eklendi`);

  // Seed settings
  console.log("📦 Ayarlar yükleniyor...");
  const settingsPath = path.join(dataDir, "settings.json");
  if (fs.existsSync(settingsPath)) {
    const settingsData = fs.readFileSync(settingsPath, "utf-8");
    await client.execute({
      sql: "INSERT OR REPLACE INTO settings (id, data) VALUES (1, ?)",
      args: [settingsData],
    });
    console.log("  ✅ Ayarlar eklendi");
  }

  console.log("\n🎉 Turso veritabanı başarıyla dolduruldu!");
}

main().catch((e) => {
  console.error("❌ Hata:", e);
  process.exit(1);
});

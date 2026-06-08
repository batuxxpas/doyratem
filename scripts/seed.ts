/**
 * Seed script: JSON verilerini SQLite veritabanına aktarır.
 * Kullanım: npx tsx scripts/seed.ts
 */
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "database.db");
const dataDir = path.join(process.cwd(), "data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Delete existing db to start fresh
try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
  if (fs.existsSync(dbPath + "-wal")) fs.unlinkSync(dbPath + "-wal");
  if (fs.existsSync(dbPath + "-shm")) fs.unlinkSync(dbPath + "-shm");
} catch {
  // File might be locked by OneDrive; just overwrite tables
  console.log("⚠️  Mevcut veritabanı dosyası silinemiyor, tablolar sıfırlanacak...");
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Create tables
sqlite.exec(`
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS services;
  DROP TABLE IF EXISTS contact_messages;
  DROP TABLE IF EXISTS settings;
  DROP TABLE IF EXISTS "references";

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    category_id TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'Doyratem',
    image TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    specs TEXT NOT NULL DEFAULT '{}',
    featured INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    spec_fields TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    short_description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT 'truck',
    "order" INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    data TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "references" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sector TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0
  );
`);

function readJSON<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [] as unknown as T;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

// Seed categories
console.log("📦 Kategoriler yükleniyor...");
const categories = readJSON<Array<{
  id: string; name: string; slug: string; description: string;
  image: string; specFields: string[]; order: number;
}>>("categories.json");

const insertCategory = sqlite.prepare(`
  INSERT INTO categories (id, name, slug, description, image, spec_fields, "order")
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const c of categories) {
  insertCategory.run(c.id, c.name, c.slug, c.description || "", c.image || "", JSON.stringify(c.specFields || []), c.order);
}
console.log(`  ✅ ${categories.length} kategori eklendi`);

// Seed products
console.log("📦 Ürünler yükleniyor...");
const products = readJSON<Array<{
  id: string; name: string; slug: string; description: string;
  categoryId: string; brand: string; image: string; images: string[];
  specs: Record<string, string>; featured: boolean; order: number; createdAt: string;
}>>("products.json");

const insertProduct = sqlite.prepare(`
  INSERT INTO products (id, name, slug, description, category_id, brand, image, images, specs, featured, "order", created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const p of products) {
  insertProduct.run(
    p.id, p.name, p.slug, p.description || "",
    p.categoryId, p.brand || "Doyratem", p.image || "",
    JSON.stringify(p.images || []), JSON.stringify(p.specs || {}),
    p.featured ? 1 : 0, p.order, p.createdAt
  );
}
console.log(`  ✅ ${products.length} ürün eklendi`);

// Seed services
console.log("📦 Hizmetler yükleniyor...");
const services = readJSON<Array<{
  id: string; title: string; slug: string; description: string;
  shortDescription: string; image: string; icon: string; order: number;
}>>("services.json");

const insertService = sqlite.prepare(`
  INSERT INTO services (id, title, slug, description, short_description, image, icon, "order")
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const s of services) {
  insertService.run(s.id, s.title, s.slug, s.description || "", s.shortDescription || "", s.image || "", s.icon || "truck", s.order);
}
console.log(`  ✅ ${services.length} hizmet eklendi`);

// Seed messages
console.log("📦 Mesajlar yükleniyor...");
const messages = readJSON<Array<{
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; createdAt: string; read: boolean;
}>>("messages.json");

const insertMessage = sqlite.prepare(`
  INSERT INTO contact_messages (id, name, email, phone, subject, message, created_at, read)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const m of messages) {
  insertMessage.run(m.id, m.name, m.email, m.phone || "", m.subject, m.message, m.createdAt, m.read ? 1 : 0);
}
console.log(`  ✅ ${messages.length} mesaj eklendi`);

// Seed settings
console.log("📦 Ayarlar yükleniyor...");
const settingsPath = path.join(dataDir, "settings.json");
if (fs.existsSync(settingsPath)) {
  const settingsData = fs.readFileSync(settingsPath, "utf-8");
  sqlite.prepare("INSERT INTO settings (id, data) VALUES (1, ?)").run(settingsData);
  console.log("  ✅ Ayarlar eklendi");
}

sqlite.close();
console.log(`\n🎉 Veritabanı başarıyla oluşturuldu: ${dbPath}`);
console.log("   Toplam boyut:", (fs.statSync(dbPath).size / 1024).toFixed(1), "KB");

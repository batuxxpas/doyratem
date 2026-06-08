const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "data", "database.db");
const db = new Database(dbPath);

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      published INTEGER NOT NULL DEFAULT 0,
      published_at TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    )
  `);
  console.log("blog_posts tablosu başarıyla oluşturuldu (veya zaten vardı).");
} catch (e) {
  console.error("Hata:", e.message);
} finally {
  db.close();
}

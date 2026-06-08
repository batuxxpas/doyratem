const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "../data/database.db"));

try {
  db.prepare("ALTER TABLE services ADD COLUMN featured INTEGER NOT NULL DEFAULT 0").run();
  console.log("✅ featured kolonu eklendi.");
} catch (e) {
  if (e.message.includes("duplicate column")) {
    console.log("ℹ️  featured kolonu zaten mevcut.");
  } else {
    throw e;
  }
}

db.close();

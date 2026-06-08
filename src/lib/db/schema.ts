import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  categoryId: text("category_id").notNull(),
  brand: text("brand").notNull().default("Doyratem"),
  image: text("image").notNull().default(""),
  images: text("images").notNull().default("[]"), // JSON string
  specs: text("specs").notNull().default("{}"), // JSON string
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  specFields: text("spec_fields").notNull().default("[]"), // JSON string
  order: integer("order").notNull().default(0),
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  image: text("image").notNull().default(""),
  icon: text("icon").notNull().default("truck"),
  order: integer("order").notNull().default(0),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
});

export const references = sqliteTable("references", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sector: text("sector").notNull().default(""),
  image: text("image").notNull().default(""),
  order: integer("order").notNull().default(0),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey().default(1),
  data: text("data").notNull(), // Full JSON string
});

export const seoPages = sqliteTable("seo_pages", {
  id: text("id").primaryKey(),
  pageKey: text("page_key").notNull().unique(), // e.g. "home", "products", "contact"
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  metaKeywords: text("meta_keywords").notNull().default(""),
  ogTitle: text("og_title").notNull().default(""),
  ogDescription: text("og_description").notNull().default(""),
  ogImage: text("og_image").notNull().default(""),
  canonicalUrl: text("canonical_url").notNull().default(""),
});

export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  image: text("image").notNull().default(""),
  tags: text("tags").notNull().default("[]"), // JSON string
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  publishedAt: text("published_at").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

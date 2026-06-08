import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { products, categories, services, contactMessages, settings, references, seoPages, blogPosts } from "./db/schema";
import type { Product, Category, Service, ContactMessage, SiteSettings, Reference, SeoPage, BlogPost } from "./types";

function rowToProduct(row: typeof products.$inferSelect): Product {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description, categoryId: row.categoryId, brand: row.brand, image: row.image, images: JSON.parse(row.images) as string[], specs: JSON.parse(row.specs) as Record<string, string>, featured: row.featured, order: row.order, createdAt: row.createdAt };
}

function rowToCategory(row: typeof categories.$inferSelect): Category {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description, image: row.image, specFields: JSON.parse(row.specFields) as string[], order: row.order };
}

function rowToService(row: typeof services.$inferSelect): Service {
  return { id: row.id, title: row.title, slug: row.slug, description: row.description, shortDescription: row.shortDescription, image: row.image, icon: row.icon, order: row.order, featured: row.featured };
}

function rowToMessage(row: typeof contactMessages.$inferSelect): ContactMessage {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone, subject: row.subject, message: row.message, createdAt: row.createdAt, read: row.read };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await db.select().from(products);
  return rows.map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return row ? rowToProduct(row) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ? rowToProduct(row) : undefined;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const rows = await db.select().from(products).where(eq(products.categoryId, categoryId));
  return rows.map(rowToProduct);
}

export async function saveProducts(productList: Product[]): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(products);
    for (const p of productList) {
      await tx.insert(products).values({ id: p.id, name: p.name, slug: p.slug, description: p.description, categoryId: p.categoryId, brand: p.brand, image: p.image, images: JSON.stringify(p.images), specs: JSON.stringify(p.specs), featured: p.featured, order: p.order, createdAt: p.createdAt });
    }
  });
}

export async function insertProduct(p: Product): Promise<void> {
  await db.insert(products).values({ id: p.id, name: p.name, slug: p.slug, description: p.description, categoryId: p.categoryId, brand: p.brand, image: p.image, images: JSON.stringify(p.images), specs: JSON.stringify(p.specs), featured: p.featured, order: p.order, createdAt: p.createdAt });
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined> {
  const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!existing) return undefined;
  const values: Record<string, unknown> = {};
  if (data.name !== undefined) values.name = data.name;
  if (data.slug !== undefined) values.slug = data.slug;
  if (data.description !== undefined) values.description = data.description;
  if (data.categoryId !== undefined) values.categoryId = data.categoryId;
  if (data.brand !== undefined) values.brand = data.brand;
  if (data.image !== undefined) values.image = data.image;
  if (data.images !== undefined) values.images = JSON.stringify(data.images);
  if (data.specs !== undefined) values.specs = JSON.stringify(data.specs);
  if (data.featured !== undefined) values.featured = data.featured;
  if (data.order !== undefined) values.order = data.order;
  if (Object.keys(values).length > 0) await db.update(products).set(values).where(eq(products.id, id));
  const [updated] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return updated ? rowToProduct(updated) : undefined;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await db.delete(products).where(eq(products.id, id));
  return (result as unknown as { rowsAffected: number }).rowsAffected > 0;
}

export async function getCategories(): Promise<Category[]> {
  const rows = await db.select().from(categories);
  return rows.map(rowToCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return row ? rowToCategory(row) : undefined;
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ? rowToCategory(row) : undefined;
}

export async function saveCategories(categoryList: Category[]): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(categories);
    for (const c of categoryList) {
      await tx.insert(categories).values({ id: c.id, name: c.name, slug: c.slug, description: c.description, image: c.image, specFields: JSON.stringify(c.specFields), order: c.order });
    }
  });
}

export async function insertCategory(c: Category): Promise<void> {
  await db.insert(categories).values({ id: c.id, name: c.name, slug: c.slug, description: c.description, image: c.image, specFields: JSON.stringify(c.specFields), order: c.order });
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | undefined> {
  const [existing] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!existing) return undefined;
  const values: Record<string, unknown> = {};
  if (data.name !== undefined) values.name = data.name;
  if (data.slug !== undefined) values.slug = data.slug;
  if (data.description !== undefined) values.description = data.description;
  if (data.image !== undefined) values.image = data.image;
  if (data.specFields !== undefined) values.specFields = JSON.stringify(data.specFields);
  if (data.order !== undefined) values.order = data.order;
  if (Object.keys(values).length > 0) await db.update(categories).set(values).where(eq(categories.id, id));
  const [updated] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return updated ? rowToCategory(updated) : undefined;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const result = await db.delete(categories).where(eq(categories.id, id));
  return (result as unknown as { rowsAffected: number }).rowsAffected > 0;
}

export async function getServices(): Promise<Service[]> {
  const rows = await db.select().from(services);
  return rows.map(rowToService);
}

export async function getFeaturedServices(): Promise<Service[]> {
  const rows = await db.select().from(services).where(eq(services.featured, true));
  return rows.map(rowToService).slice(0, 4);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const [row] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return row ? rowToService(row) : undefined;
}

export async function saveServices(serviceList: Service[]): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(services);
    for (const s of serviceList) {
      await tx.insert(services).values({ id: s.id, title: s.title, slug: s.slug, description: s.description, shortDescription: s.shortDescription, image: s.image, icon: s.icon, order: s.order });
    }
  });
}

export async function insertService(s: Service): Promise<void> {
  await db.insert(services).values({ id: s.id, title: s.title, slug: s.slug, description: s.description, shortDescription: s.shortDescription, image: s.image, icon: s.icon, order: s.order, featured: s.featured });
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service | undefined> {
  const [existing] = await db.select().from(services).where(eq(services.id, id)).limit(1);
  if (!existing) return undefined;
  const values: Record<string, unknown> = {};
  if (data.title !== undefined) values.title = data.title;
  if (data.slug !== undefined) values.slug = data.slug;
  if (data.description !== undefined) values.description = data.description;
  if (data.shortDescription !== undefined) values.shortDescription = data.shortDescription;
  if (data.image !== undefined) values.image = data.image;
  if (data.icon !== undefined) values.icon = data.icon;
  if (data.order !== undefined) values.order = data.order;
  if (data.featured !== undefined) values.featured = data.featured;
  if (Object.keys(values).length > 0) await db.update(services).set(values).where(eq(services.id, id));
  const [updated] = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return updated ? rowToService(updated) : undefined;
}

export async function deleteService(id: string): Promise<boolean> {
  const result = await db.delete(services).where(eq(services.id, id));
  return (result as unknown as { rowsAffected: number }).rowsAffected > 0;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const rows = await db.select().from(contactMessages);
  return rows.map(rowToMessage);
}

export async function saveMessages(messageList: ContactMessage[]): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(contactMessages);
    for (const m of messageList) {
      await tx.insert(contactMessages).values({ id: m.id, name: m.name, email: m.email, phone: m.phone, subject: m.subject, message: m.message, createdAt: m.createdAt, read: m.read });
    }
  });
}

export async function insertMessage(m: ContactMessage): Promise<void> {
  await db.insert(contactMessages).values({ id: m.id, name: m.name, email: m.email, phone: m.phone, subject: m.subject, message: m.message, createdAt: m.createdAt, read: m.read });
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
}

export async function deleteMessage(id: string): Promise<void> {
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}

export async function getSettings(): Promise<SiteSettings> {
  const [row] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  if (!row) {
    return { companyName: "Doyratem Hijyen", slogan: "", phone: "", phone2: "", email: "", address: "", whatsapp: "", googleMapsEmbed: "", socialMedia: { facebook: "", twitter: "", instagram: "", linkedin: "", youtube: "" }, about: { title: "", text: "", experience: "", customers: "", products: "", brands: "" } };
  }
  return JSON.parse(row.data) as SiteSettings;
}

export async function saveSettings(s: SiteSettings): Promise<void> {
  const [existing] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  if (existing) {
    await db.update(settings).set({ data: JSON.stringify(s) }).where(eq(settings.id, 1));
  } else {
    await db.insert(settings).values({ id: 1, data: JSON.stringify(s) });
  }
}

export async function getReferences(): Promise<Reference[]> {
  return await db.select().from(references);
}

export async function insertReference(r: Reference): Promise<void> {
  await db.insert(references).values({ id: r.id, name: r.name, sector: r.sector, image: r.image, order: r.order });
}

export async function updateReference(id: string, data: Partial<Reference>): Promise<Reference | undefined> {
  const [existing] = await db.select().from(references).where(eq(references.id, id)).limit(1);
  if (!existing) return undefined;
  const values: Record<string, unknown> = {};
  if (data.name !== undefined) values.name = data.name;
  if (data.sector !== undefined) values.sector = data.sector;
  if (data.image !== undefined) values.image = data.image;
  if (data.order !== undefined) values.order = data.order;
  if (Object.keys(values).length > 0) await db.update(references).set(values).where(eq(references.id, id));
  const [updated] = await db.select().from(references).where(eq(references.id, id)).limit(1);
  return updated || undefined;
}

export async function deleteReference(id: string): Promise<boolean> {
  const result = await db.delete(references).where(eq(references.id, id));
  return (result as unknown as { rowsAffected: number }).rowsAffected > 0;
}

export async function getSeoPages(): Promise<SeoPage[]> {
  return await db.select().from(seoPages);
}

export async function getSeoByPageKey(pageKey: string): Promise<SeoPage | undefined> {
  const [row] = await db.select().from(seoPages).where(eq(seoPages.pageKey, pageKey)).limit(1);
  return row || undefined;
}

export async function upsertSeoPage(seo: SeoPage): Promise<void> {
  const [existing] = await db.select().from(seoPages).where(eq(seoPages.pageKey, seo.pageKey)).limit(1);
  if (existing) {
    await db.update(seoPages).set({ metaTitle: seo.metaTitle, metaDescription: seo.metaDescription, metaKeywords: seo.metaKeywords, ogTitle: seo.ogTitle, ogDescription: seo.ogDescription, ogImage: seo.ogImage, canonicalUrl: seo.canonicalUrl }).where(eq(seoPages.pageKey, seo.pageKey));
  } else {
    await db.insert(seoPages).values({ id: seo.id, pageKey: seo.pageKey, metaTitle: seo.metaTitle, metaDescription: seo.metaDescription, metaKeywords: seo.metaKeywords, ogTitle: seo.ogTitle, ogDescription: seo.ogDescription, ogImage: seo.ogImage, canonicalUrl: seo.canonicalUrl });
  }
}

function rowToBlogPost(row: typeof blogPosts.$inferSelect): BlogPost {
  return { id: row.id, title: row.title, slug: row.slug, content: row.content, excerpt: row.excerpt, image: row.image, tags: JSON.parse(row.tags) as string[], published: row.published, publishedAt: row.publishedAt, createdAt: row.createdAt };
}

export async function getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  const list = rows.map(rowToBlogPost);
  return publishedOnly ? list.filter((p) => p.published) : list;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return row ? rowToBlogPost(row) : undefined;
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return row ? rowToBlogPost(row) : undefined;
}

export async function insertBlogPost(p: BlogPost): Promise<void> {
  await db.insert(blogPosts).values({ id: p.id, title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt, image: p.image, tags: JSON.stringify(p.tags), published: p.published, publishedAt: p.publishedAt, createdAt: p.createdAt });
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
  const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!existing) return undefined;
  const values: Record<string, unknown> = {};
  if (data.title !== undefined) values.title = data.title;
  if (data.slug !== undefined) values.slug = data.slug;
  if (data.content !== undefined) values.content = data.content;
  if (data.excerpt !== undefined) values.excerpt = data.excerpt;
  if (data.image !== undefined) values.image = data.image;
  if (data.tags !== undefined) values.tags = JSON.stringify(data.tags);
  if (data.published !== undefined) values.published = data.published;
  if (data.publishedAt !== undefined) values.publishedAt = data.publishedAt;
  if (Object.keys(values).length > 0) await db.update(blogPosts).set(values).where(eq(blogPosts.id, id));
  const [updated] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return updated ? rowToBlogPost(updated) : undefined;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return (result as unknown as { rowsAffected: number }).rowsAffected > 0;
}

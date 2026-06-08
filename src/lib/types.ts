export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brand: string;
  image: string;
  images: string[];
  specs: Record<string, string>;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  specFields: string[];
  order: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  icon: string;
  order: number;
  featured: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Reference {
  id: string;
  name: string;
  sector: string;
  image: string;
  order: number;
}

export interface SiteSettings {
  companyName: string;
  slogan: string;
  phone: string;
  phone2: string;
  email: string;
  address: string;
  whatsapp: string;
  googleMapsEmbed: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  about: {
    title: string;
    text: string;
    experience: string;
    customers: string;
    products: string;
    brands: string;
  };
}

export interface SeoPage {
  id: string;
  pageKey: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
  createdAt: string;
}

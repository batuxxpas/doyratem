/**
 * Vercel'de /uploads/ yolları çalışmaz (read-only filesystem).
 * Sadece Cloudinary (https://) URL'leri veya /public/ altındaki statik dosyalar geçerlidir.
 */
export function isValidImage(src: string | null | undefined): boolean {
  if (!src || src.trim() === "") return false;
  if (src.startsWith("https://")) return true;
  // /public/ altındaki statik dosyalara izin ver (logo, icon vs.)
  if (src.startsWith("/") && !src.startsWith("/uploads/")) return true;
  return false;
}

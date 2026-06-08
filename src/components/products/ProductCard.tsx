import Link from "next/link";
import Image from "next/image";
import { isValidImage } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  slug: string;
  brand: string;
  image: string;
  categoryName?: string;
}

export default function ProductCard({ name, slug, brand, image, categoryName }: ProductCardProps) {
  const hasImage = isValidImage(image);

  return (
    <Link href={`/urunler/${slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-square bg-slate-50 relative overflow-hidden">
          {hasImage ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
          {categoryName && (
            <span className="absolute top-3 left-3 bg-cyan-600 text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
              {categoryName}
            </span>
          )}
        </div>
        
        {/* Info */}
        <div className="p-5">
          <p className="text-xs text-cyan-600 font-semibold tracking-wide uppercase mb-1">{brand}</p>
          <h3 className="text-sm font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors line-clamp-2 leading-snug">
            {name}
          </h3>
          <div className="mt-3 flex items-center gap-1 text-xs text-cyan-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Detayları Gör</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

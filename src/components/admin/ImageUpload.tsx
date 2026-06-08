"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  folder: "products" | "categories" | "services" | "blog";
  currentImage?: string;
  onUploaded: (url: string) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 4000;

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error("Görsel okunamadı"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function ImageUpload({ folder, currentImage, onUploaded }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(async (file: File): Promise<string | null> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Geçersiz format. Sadece JPG, PNG ve WebP desteklenir.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Dosya çok büyük (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimum 2MB.`;
    }
    if (file.size === 0) {
      return "Dosya boş.";
    }
    try {
      const { width, height } = await getImageDimensions(file);
      if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
        return `Görsel çok küçük (${width}x${height}px). En az ${MIN_DIMENSION}x${MIN_DIMENSION}px olmalı.`;
      }
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        return `Görsel çok büyük (${width}x${height}px). En fazla ${MAX_DIMENSION}x${MAX_DIMENSION}px olabilir.`;
      }
    } catch {
      return "Görsel boyutları okunamadı.";
    }
    return null;
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    const validationError = await validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Show local preview
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const { width, height } = await getImageDimensions(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("width", String(width));
      formData.append("height", String(height));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Yükleme başarısız");
        setPreview(currentImage || null);
        return;
      }

      setPreview(data.url);
      onUploaded(data.url);
    } catch {
      setError("Yükleme sırasında bir hata oluştu.");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  }, [folder, currentImage, onUploaded, validate]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleRemove() {
    setPreview(null);
    setError(null);
    onUploaded("");
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Görsel</label>

      {preview ? (
        <div className="relative group">
          <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src={preview}
              alt="Önizleme"
              width={400}
              height={192}
              className="w-full h-full object-cover"
              unoptimized={preview.startsWith("blob:") || !preview.startsWith("https://")}
            />
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-cyan-600 font-medium">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Yükleniyor...
              </div>
            </div>
          )}
          {!uploading && (
            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Değiştir
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Kaldır
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
            dragActive
              ? "border-cyan-400 bg-cyan-50"
              : "border-slate-200 bg-slate-50 hover:border-cyan-300 hover:bg-cyan-50/50"
          }`}
        >
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-slate-500 font-medium">
            Görsel yüklemek için tıklayın veya sürükleyin
          </span>
          <span className="text-xs text-slate-400">
            JPG, PNG, WebP · Maks 2MB · 200-4000px
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="mt-2 flex items-start gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

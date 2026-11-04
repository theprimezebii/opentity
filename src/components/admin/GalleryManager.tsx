"use client";

import { useState, useTransition } from "react";
import { deleteGalleryImage, moveGalleryImage } from "@/app/actions/gallery";
import { Trash2, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import type { GalleryImage } from "@/lib/queries/gallery";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [isPending, startTransition] = useTransition();
  const [working, setWorking] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setWorking(id);
    startTransition(async () => {
      await deleteGalleryImage(id);
      setWorking(null);
    });
  };

  const handleMove = (id: string, dir: "up" | "down") => {
    setWorking(`${id}-${dir}`);
    startTransition(async () => {
      await moveGalleryImage(id, dir);
      setWorking(null);
    });
  };

  if (images.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <p className="text-slate-500">No gallery images yet. Upload your first image above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img, i) => {
        const isFirst = i === 0;
        const isLast = i === images.length - 1;
        const delWorking = working === img.id;
        const upWorking = working === `${img.id}-up`;
        const downWorking = working === `${img.id}-down`;

        return (
          <div
            key={img.id}
            className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden"
          >
            <div className="aspect-square bg-slate-100">
              <img
                src={img.url}
                alt={img.alt || "Gallery image"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {img.alt && (
              <p className="px-3 py-2 text-xs text-slate-600 truncate border-t border-slate-100">
                {img.alt}
              </p>
            )}

            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleMove(img.id, "up")}
                disabled={isFirst || (isPending && !upWorking)}
                title={isFirst ? "Already first" : "Move up"}
                className="p-2 bg-white text-slate-700 rounded-lg hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {upWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(img.id)}
                disabled={isPending && !delWorking}
                title="Delete"
                className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {delWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleMove(img.id, "down")}
                disabled={isLast || (isPending && !downWorking)}
                title={isLast ? "Already last" : "Move down"}
                className="p-2 bg-white text-slate-700 rounded-lg hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {downWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

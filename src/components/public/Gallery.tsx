"use client";

import { Reveal } from "@/components/ui/Reveal";

const GALLERY = [
  { src: "/images/gallery/hackathon-1.jpg", fallback: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=3840&q=90", alt: "Teams collaborating at a hackathon" },
  { src: "/images/gallery/hackathon-2.jpg", fallback: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=3840&q=90", alt: "Students coding together" },
  { src: "/images/gallery/hackathon-3.jpg", fallback: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=3840&q=90", alt: "Pitch presentation on stage" },
  { src: "/images/gallery/hackathon-4.jpg", fallback: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=3840&q=90", alt: "Conference hall full of students" },
];

type GalleryImageProp = { src: string; fallback: string; alt: string };

export function Gallery({ images }: { images?: GalleryImageProp[] | null } = {}) {
  const list = images && images.length > 0 ? images : GALLERY;
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <Reveal>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-2">Moments</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Real moments from Pakistan&apos;s hackathon scene
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            From late-night coding sessions to pitch-day victories.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {list.map((photo, i) => (
          <Reveal key={i} delay={i * 80} type={i % 2 === 0 ? "up" : "zoom"}>
            <div className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes(photo.fallback)) {
                    target.src = photo.fallback;
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-semibold leading-tight">{photo.alt}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

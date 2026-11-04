"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
  loading?: "lazy" | "eager";
}

/**
 * Renders an <img> that gracefully falls back to `fallback` when:
 *  - src is null/empty
 *  - src fails to load (dead URL, 404, external site taken down)
 * Use instead of raw <img> anywhere an image_url comes from user content.
 */
export function SafeImage({
  src,
  alt,
  className = "",
  fallback,
  loading = "lazy",
}: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) return <>{fallback}</>;

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

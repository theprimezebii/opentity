"use client";

import { useEffect, useRef, useState } from "react";

type AnimType = "up" | "down" | "left" | "right" | "zoom";

export function Reveal({
  children,
  delay = 0,
  type = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  type?: AnimType;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hidden = {
    up: "opacity-0 translate-y-12",
    down: "opacity-0 -translate-y-12",
    left: "opacity-0 translate-x-12",
    right: "opacity-0 -translate-x-12",
    zoom: "opacity-0 scale-95",
  }[type];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-x-0 translate-y-0 scale-100" : hidden
      } ${className}`}
    >
      {children}
    </div>
  );
}

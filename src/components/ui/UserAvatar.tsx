export function UserAvatar({ name, url, size = "md", className = "" }: { name: string, url?: string | null, size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  const sizes = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-20 h-20 text-2xl"
  };

  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className={`rounded-full flex items-center justify-center font-bold uppercase flex-shrink-0 overflow-hidden bg-slate-200 text-slate-600 ring-2 ring-white shadow-sm ${sizes[size]} ${className}`}>
      {url ? (
        <img src={url} alt={name} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}

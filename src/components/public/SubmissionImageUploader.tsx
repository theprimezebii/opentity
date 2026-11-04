"use client";

import { useState, useRef } from "react";
import { X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function SubmissionImageUploader({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [imageUrl, setImageUrl] = useState(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // STRICT IMAGE-ONLY CHECK
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, and GIF images are allowed. Other file types are not permitted.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 5MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in to upload images.");
        setIsUploading(false);
        return;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("submission-images")
        .upload(filename, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("submission-images").getPublicUrl(filename);
      setImageUrl(urlData.publicUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <input type="hidden" name={name} value={imageUrl} />
      
      {imageUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <img src={imageUrl} alt="Event cover" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition ${isUploading ? "border-orange-300 bg-orange-50 dark:bg-orange-500/10" : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:border-orange-400 dark:hover:border-orange-500"}`}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Click to upload cover image</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPEG, PNG, WebP, GIF (max 5MB)</p>
            </>
          )}
        </label>
      )}

      {error && (
        <div className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

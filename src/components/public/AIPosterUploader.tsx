"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, Upload, CheckCircle2, AlertCircle, X } from "lucide-react";
import { parseEventPoster, ParsedEvent } from "@/app/actions/ai-parser";
import { createClient } from "@/lib/supabase/client";

export function AIPosterUploader({ 
  onParsed, 
  onBeforeParse, 
  onExtractingChange,
  disabled 
}: { 
  onParsed: (data: ParsedEvent) => void; 
  onBeforeParse: () => Promise<boolean>;
  onExtractingChange: (isExtracting: boolean) => void;
  disabled?: boolean;
}) {
  const [isParsing, setIsParsing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    // 1. Ask for confirmation BEFORE starting the extraction
    const confirmed = await onBeforeParse();
    if (!confirmed) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsParsing(true);
    onExtractingChange(true);

    try {
      const formData = new FormData();
      formData.append("poster", file);
      const result = await parseEventPoster(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Upload the poster to Supabase Storage for use as cover image
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        
        const { error: uploadError } = await supabase.storage
          .from("submission-images")
          .upload(filename, file, { contentType: file.type, upsert: false });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("submission-images").getPublicUrl(filename);
          result.image_url = urlData.publicUrl;
        }
      }

      onParsed(result);
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsParsing(false);
      onExtractingChange(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 border border-slate-700 shadow-2xl relative overflow-hidden transition-all duration-300 ${disabled ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Auto-fill with AI Poster</h3>
            <p className="text-xs text-slate-400">Upload the event poster to auto-fill</p>
          </div>
        </div>

        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-white/5 transition">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
              className="hidden" 
            />
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-white">Click to upload a poster</p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG (max 10MB)</p>
          </label>
        ) : (
          <div className="relative">
            <img src={preview} alt="Poster preview" className="w-full h-48 object-contain rounded-xl bg-black/30" />
            <button type="button" onClick={() => { setPreview(null); setSuccess(false); setError(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition">
              <X className="w-4 h-4" />
            </button>
            {isParsing && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-2" />
                  <p className="text-white text-sm font-semibold">Analyzing poster...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-emerald-300 font-semibold">Form auto-filled!</p>
          </div>
        )}
      </div>
    </div>
  );
}

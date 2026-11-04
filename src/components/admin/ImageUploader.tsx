"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageIcon, Loader2, X } from "lucide-react";
import { showToast } from "@/components/ui/GlobalToast";

export function ImageUploader({ name, defaultValue }: { name: string, defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { showToast("File is too large. Max size is 2MB.", 'error'); return; }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('event-images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(fileName);
      setUrl(publicUrl);
      showToast("Cover image uploaded!", 'success');
    } catch (error: any) {
      showToast("Error uploading image: " + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input type="hidden" name={name} value={url} />
      
      {url ? (
        <div className="relative w-full h-48 rounded-lg border border-slate-200 overflow-hidden group">
          <img src={url} alt="Event Cover" className="w-full h-full object-cover" />
          <button 
            type="button" 
            onClick={() => setUrl("")} 
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400 mb-3" />
            )}
            <p className="mb-2 text-sm text-slate-500 font-medium">
              {uploading ? "Uploading..." : "Click to upload event cover"}
            </p>
            <p className="text-xs text-slate-400">PNG, JPG or WEBP (MAX. 2MB)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      )}
    </div>
  );
}

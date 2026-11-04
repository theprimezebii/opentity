"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Camera, Loader2, User } from "lucide-react";
import { showToast } from "@/components/ui/GlobalToast";

export function AvatarUploader({ name, userId, defaultValue }: { name: string, userId: string, defaultValue?: string }) {
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
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setUrl(publicUrl);
      showToast("Avatar uploaded!", 'success');
    } catch (error: any) {
      showToast("Error uploading avatar: " + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative flex-shrink-0">
      <input type="hidden" name={name} value={url} />
      <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-lg ring-4 ring-slate-50 group relative">
        {url ? (
          <img src={url} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <User className="w-12 h-12" />
          </div>
        )}
        <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
          {uploading ? <Loader2 className="w-7 h-7 animate-spin" /> : <><Camera className="w-7 h-7 mb-1" /><span className="text-[10px] font-semibold">Upload</span></>}
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

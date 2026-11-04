"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { uploadGalleryImage } from "@/app/actions/gallery";
import { FormMessage } from "@/components/ui/FormMessage";
import { Upload, Loader2, AlertCircle } from "lucide-react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + "MB";
  if (bytes >= 1024) return Math.round(bytes / 1024) + "KB";
  return bytes + "B";
}

export function GalleryUpload() {
  const [state, action, isPending] = useActionState(uploadGalleryImage, null);
  const [preview, setPreview] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setPreview(null);
      setSelectedFile(null);
      setClientError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [state?.success]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      setClientError(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setClientError("Only image files are allowed (JPG, PNG, WebP).");
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setClientError(
        `This image is ${formatSize(file.size)}. Maximum allowed is 5MB. Please compress it or pick a smaller photo.`
      );
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setClientError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitDisabled = isPending || !selectedFile || !!clientError;

  return (
    <form
      ref={formRef}
      action={action}
      className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
    >
      <FormMessage error={state?.error} success={state?.success} />

      {clientError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{clientError}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Image file <span className="text-red-500">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            accept="image/*"
            required
            onChange={handleFile}
            className="w-full text-sm text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
          />
          <p className="text-xs text-slate-500 mt-1.5">Max 5MB. JPG, PNG, WebP supported.</p>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Description (optional)
          </label>
          <input
            type="text"
            name="alt"
            placeholder="e.g. Teams at FAST Innovate 4.0"
            maxLength={120}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-slate-900 text-sm"
          />
          <p className="text-xs text-slate-500 mt-1.5">Shown on hover. Helpful for accessibility.</p>
        </div>
      </div>

      {preview && (
        <div className="flex items-center gap-3 pt-2">
          <img
            src={preview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-slate-200"
          />
          <div>
            <p className="text-xs font-medium text-slate-700">Preview</p>
            {selectedFile && (
              <p className="text-xs text-slate-500">
                {formatSize(selectedFile.size)}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={submitDisabled}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Upload image
            </>
          )}
        </button>
      </div>
    </form>
  );
}

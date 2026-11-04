"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

export function BottomSaveButton() {
  const [isPending, setIsPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsPending(true);
    const handleEnd = () => setIsPending(false);
    const handleSuccess = () => {
      setIsPending(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    };

    window.addEventListener("profile-save-start", handleStart);
    window.addEventListener("profile-save-end", handleEnd);
    window.addEventListener("profile-save-success", handleSuccess);

    return () => {
      window.removeEventListener("profile-save-start", handleStart);
      window.removeEventListener("profile-save-end", handleEnd);
      window.removeEventListener("profile-save-success", handleSuccess);
    };
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-slate-500 flex items-center gap-2">
        {showSuccess ? (
          <><CheckCircle2 className="w-4 h-4 text-orange-400" /> <span className="text-orange-500 font-medium">Profile saved successfully!</span></>
        ) : (
          "Changes are auto-saved as a draft."
        )}
      </p>
      <button
        type="submit"
        form="profile-form"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
      >
        {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Profile</>}
      </button>
    </div>
  );
}

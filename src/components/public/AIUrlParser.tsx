"use client";

import { useState } from "react";
import { Link2, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { parseEventUrl } from "@/app/actions/url-parser";
import { ParsedEvent } from "@/app/actions/ai-parser";

export function AIUrlParser({ 
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
  const [url, setUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExtract = async () => {
    if (!url) return;
    
    // 1. Ask for confirmation BEFORE starting the extraction
    const confirmed = await onBeforeParse();
    if (!confirmed) return;

    setError(null);
    setSuccess(false);
    setIsParsing(true);
    onExtractingChange(true);

    const result = await parseEventUrl(url);
    
    setIsParsing(false);
    onExtractingChange(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onParsed(result);
    setSuccess(true);
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 ${disabled ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Auto-fill with URL</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Paste a link to a Devpost, Luma, or University page</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://devpost.com/hackathons/..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleExtract}
          disabled={isParsing || !url}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
        >
          {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isParsing ? "Analyzing..." : "Extract"}
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Form auto-filled from URL!</p>
        </div>
      )}
    </div>
  );
}

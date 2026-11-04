"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { submitPublicEvent, updatePublicSubmission } from "@/app/actions/submissions";
import { EVENT_TYPES, EVENT_CATEGORIES, EVENT_FORMATS, GLOBAL_CITIES } from "@/lib/constants";
import { CheckCircle2, ShieldCheck, Link2, CalendarDays, MapPin, Trophy, AlertCircle } from "lucide-react";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";
import { SubmissionImageUploader } from "./SubmissionImageUploader";
import { AIPosterUploader } from "./AIPosterUploader";
import { AIUrlParser } from "./AIUrlParser";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputClass = "w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all text-sm";
const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2";

const toDateInput = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  try { return new Date(dateStr).toISOString().split("T")[0]; } catch { return ""; }
};

export function SubmitEventForm({ mode = "create", submission }: { mode?: "create" | "edit"; submission?: any; }) {
  const isEdit = mode === "edit";
  const action = isEdit ? updatePublicSubmission : submitPublicEvent;
  const [state, formAction] = useActionState(action, null);
  const router = useRouter();

  const initialData = (state?.formData as any) || submission || {};
  const formRef = useRef<HTMLFormElement>(null);

  // Date states
  const [startDate, setStartDate] = useState(toDateInput(initialData.start_date));
  const [endDate, setEndDate] = useState(toDateInput(initialData.end_date));
  const [regStart, setRegStart] = useState(toDateInput(initialData.registration_start_date));
  const [regDeadline, setRegDeadline] = useState(toDateInput(initialData.registration_deadline));

  // AI-parsed state
  const [aiParsed, setAiParsed] = useState<any>(null);
  const [parseMethod, setParseMethod] = useState<"none" | "poster" | "url">("none");
  const [isExtracting, setIsExtracting] = useState(false);

  // Confirmation modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmResolver, setConfirmResolver] = useState<((val: boolean) => void) | null>(null);

  // ============================================
  // AUTO-SAVE DRAFTS (only for create mode)
  // ============================================
  useEffect(() => {
    if (isEdit) return;
    const saved = localStorage.getItem("opentity_submit_draft");
    if (saved && formRef.current) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(key => {
          const input = formRef.current?.elements.namedItem(key) as HTMLInputElement;
          if (input && input.type !== 'checkbox' && input.type !== 'file') input.value = parsed[key];
        });
        if (parsed.start_date) setStartDate(parsed.start_date);
        if (parsed.end_date) setEndDate(parsed.end_date);
        if (parsed.registration_start_date) setRegStart(parsed.registration_start_date);
        if (parsed.registration_deadline) setRegDeadline(parsed.registration_deadline);
      } catch (e) {}
    }
  }, [isEdit]);

  const handleFormChange = () => {
    if (isEdit || !formRef.current) return;
    const fd = new FormData(formRef.current);
    localStorage.setItem("opentity_submit_draft", JSON.stringify(Object.fromEntries(fd.entries())));
  };

  // ============================================
  // SUCCESS REDIRECT
  // ============================================
  useEffect(() => {
    if (state?.success) {
      if (!isEdit) localStorage.removeItem("opentity_submit_draft");
      setTimeout(() => router.push("/dashboard/submissions"), 2000);
    }
  }, [state?.success, isEdit, router]);

  // ============================================
  // APPLY AI-PARSED DATA TO FIELDS
  // ============================================
  useEffect(() => {
    if (!aiParsed || !formRef.current) return;
    const form = formRef.current;
    const set = (name: string, value: any) => {
      if (value === undefined || value === null) return;
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (el) el.value = String(value);
    };

    set("title", aiParsed.title);
    set("description", aiParsed.description);
    set("category", aiParsed.category);
    set("format", aiParsed.format);
    set("city", aiParsed.city);
    set("location", aiParsed.location);
    set("start_date", aiParsed.start_date);
    set("end_date", aiParsed.end_date);
    set("registration_deadline", aiParsed.registration_deadline);
    set("prize_pool", aiParsed.prize_pool);
    set("organizer", aiParsed.organizer);
    set("registration_url", aiParsed.registration_url);
    set("event_type", aiParsed.event_type);
    if (aiParsed.image_url) set("image_url", aiParsed.image_url);

    if (aiParsed.start_date) setStartDate(aiParsed.start_date);
    if (aiParsed.end_date) setEndDate(aiParsed.end_date);
    if (aiParsed.registration_deadline) setRegDeadline(aiParsed.registration_deadline);

    // Save to draft
    setTimeout(handleFormChange, 100);
  }, [aiParsed]);

  // ============================================
  // CONFIRMATION LOGIC
  // ============================================
  const checkBeforeParse = () => {
    if (parseMethod === "none") return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
      setConfirmResolver(() => resolve);
      setIsConfirmOpen(true);
    });
  };

  const handleConfirm = () => {
    if (confirmResolver) confirmResolver(true);
    setIsConfirmOpen(false);
    setConfirmResolver(null);
  };

  const handleCancelConfirm = () => {
    if (confirmResolver) confirmResolver(false);
    setIsConfirmOpen(false);
    setConfirmResolver(null);
  };

  const executeParse = (method: "poster" | "url", data: any) => {
    if (formRef.current) {
      formRef.current.reset();
      setStartDate("");
      setEndDate("");
      setRegStart("");
      setRegDeadline("");
      setAiParsed(null);
    }
    setParseMethod(method);
    setAiParsed(data);
  };

  const onPosterParsed = (data: any) => executeParse("poster", data);
  const onUrlParsed = (data: any) => executeParse("url", data);

  // ============================================
  // DATE VALIDATION
  // ============================================
  let dateError = null;
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) dateError = "End date cannot be before the start date.";
  else if (startDate && regDeadline && new Date(regDeadline) > new Date(startDate)) dateError = "Registration deadline cannot be after the event start date.";
  else if (regStart && regDeadline && new Date(regDeadline) < new Date(regStart)) dateError = "Registration deadline cannot be before the registration start date.";

  return (
    <div>
      {/* CONFIRMATION MODAL */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Overwrite Form Data?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              You have already auto-filled the form. Using a new method will <strong className="text-red-500">clear all current form data</strong> and extract fresh information. Proceed?
            </p>
            <div className="flex gap-3">
              <button onClick={handleCancelConfirm} type="button" className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                Cancel
              </button>
              <button onClick={handleConfirm} type="button" className="flex-1 px-4 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/25">
                Yes, Overwrite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS BANNERS */}
      {state?.success && (
        <div className="mb-8 p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-emerald-900 dark:text-emerald-400 text-lg">Success!</h3>
            <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-1">{state.success} Redirecting...</p>
          </div>
        </div>
      )}
      {state?.error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">{state.error}</p>
        </div>
      )}

      {/* AI AUTO-FILL (Vertical Layout) */}
      {!isEdit && (
        <div className="mb-8 space-y-4">
          <AIPosterUploader 
            onParsed={onPosterParsed} 
            onBeforeParse={checkBeforeParse} 
            onExtractingChange={setIsExtracting}
            disabled={isExtracting}
          />
          
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-4 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Or
            </span>
          </div>

          <AIUrlParser 
            onParsed={onUrlParsed} 
            onBeforeParse={checkBeforeParse} 
            onExtractingChange={setIsExtracting}
            disabled={isExtracting}
          />
        </div>
      )}

      {/* REJECTED / PENDING BANNERS */}
      {isEdit && submission?.status === "rejected" && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800 dark:text-red-400">This submission was rejected</p>
            {submission?.reviewer_notes && (
              <p className="text-xs text-red-700 dark:text-red-300 mt-1"><strong>Admin note:</strong> {submission.reviewer_notes}</p>
            )}
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">Fix the issues above and resubmit.</p>
          </div>
        </div>
      )}
      {isEdit && submission?.status === "pending" && (
        <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-orange-800 dark:text-orange-300">You are editing a pending submission</p>
            <p className="text-xs text-orange-700 dark:text-orange-400 mt-0.5">Your changes will be sent back to the admin for re-review.</p>
          </div>
        </div>
      )}

      {/* FORM */}
      <form ref={formRef} onChange={handleFormChange} action={formAction} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-10">
        {isEdit && <input type="hidden" name="submission_id" value={submission?.id || ""} />}

        {/* SECTION 1 */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">1. Basic Details</h3>
          
          <div>
            <label className={labelClass}>Event Cover Image</label>
            <SubmissionImageUploader name="image_url" defaultValue={initialData.image_url as string} />
          </div>

          <div>
            <label className={labelClass}>Event Title <span className="text-red-500">*</span></label>
            <input name="title" defaultValue={initialData.title as string} placeholder="e.g., NUST AI Hackathon 2027" maxLength={100} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Description <span className="text-red-500">*</span></label>
            <textarea name="description" defaultValue={initialData.description as string} rows={6} maxLength={5000} required placeholder="Describe the event, its tracks, and what participants can expect..." className={inputClass} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Category <span className="text-red-500">*</span></label>
              <select name="category" defaultValue={initialData.category || "AI"} className={inputClass}>
                {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Event Type <span className="text-red-500">*</span></label>
              <select name="event_type" defaultValue={initialData.event_type || "Hackathon"} className={inputClass}>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Format <span className="text-red-500">*</span></label>
              <select name="format" defaultValue={initialData.format || "In-person"} className={inputClass}>
                {EVENT_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>City (Optional)</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select name="city" defaultValue={initialData.city || ""} className={`${inputClass} pl-10`}>
                  <option value="">Select City</option>
                  {GLOBAL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className={labelClass}>Venue / Location Details</label>
            <input name="location" defaultValue={initialData.location as string} placeholder="e.g., NUST SEECS, Sector H-12" maxLength={150} className={inputClass} />
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="space-y-6 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Timeline & Links</h3>
            {dateError && (
              <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-md border border-red-200 dark:border-red-500/20 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {dateError}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Registration Opens</label>
              <div className="relative">
                <CalendarDays className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input name="registration_start_date" type="date" value={regStart} onChange={(e) => setRegStart(e.target.value)} className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Registration Deadline</label>
              <div className="relative">
                <CalendarDays className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input name="registration_deadline" type="date" value={regDeadline} onChange={(e) => setRegDeadline(e.target.value)} className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Event Start Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <CalendarDays className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input name="start_date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Event End Date</label>
              <div className="relative">
                <CalendarDays className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input name="end_date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Registration URL <span className="text-red-500">*</span></label>
            <div className="relative">
              <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input name="registration_url" type="url" defaultValue={initialData.registration_url as string} placeholder="https://..." required className={`${inputClass} pl-10`} />
            </div>
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="space-y-6 mt-12 mb-10">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">3. Extra Details (Optional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Prize Pool</label>
              <div className="relative">
                <Trophy className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input name="prize_pool" defaultValue={initialData.prize_pool as string} placeholder="e.g., PKR 500,000" className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Organizer Name</label>
              <input name="organizer" defaultValue={initialData.organizer as string} placeholder="e.g., NUST SEECS" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Organizer Contact (Email / WhatsApp)</label>
            <input name="organizer_contact" defaultValue={initialData.organizer_contact as string} placeholder="e.g., hello@nust.edu.pk" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Eligibility Criteria</label>
            <textarea name="eligibility" defaultValue={initialData.eligibility as string} rows={3} placeholder="e.g., Open to all university students in Pakistan." className={inputClass} />
          </div>
        </div>

        {/* TERMS */}
        {!isEdit && (
          <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" name="terms" required className="mt-1 w-5 h-5 text-orange-500 rounded border-slate-300 dark:border-slate-600 focus:ring-orange-500 dark:bg-slate-900 cursor-pointer" />
              <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                I confirm that the event details are accurate and I have permission to list this event. I agree to Opentity's{" "}
                <Link href="/terms" target="_blank" className="text-orange-500 font-semibold hover:underline">Terms of Service</Link>{" "}
                and <Link href="/privacy" target="_blank" className="text-orange-500 font-semibold hover:underline">Privacy Policy</Link>.
              </span>
            </label>
          </div>
        )}

        <FormSubmitButton 
          loadingText={isEdit ? "Saving Changes..." : "Submitting for Review..."} 
          disabled={!!dateError}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit ? "Save Changes" : "Submit Event for Review"}
        </FormSubmitButton>
      </form>
    </div>
  );
}

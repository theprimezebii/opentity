"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { createEvent } from "@/app/actions/events";
import { EVENT_TYPES, EVENT_CATEGORIES, EVENT_FORMATS, PAKISTAN_CITIES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUploader } from "./ImageUploader";
import { FormMessage } from "@/components/ui/FormMessage";

const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white text-slate-900 placeholder:text-slate-400";
const CURRENCIES = ["PKR", "USD", "EUR", "GBP", "AED", "SAR"];

export function CreateEventForm() {
  const [state, formAction, isPending] = useActionState(createEvent, null);
  const [draft, setDraft] = useState<any>({});
  const [loadingBtn, setLoadingBtn] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [regStart, setRegStart] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const savedDraft = localStorage.getItem("opentity_draft_create");
    if (savedDraft) {
      try { 
        const parsed = JSON.parse(savedDraft);
        setDraft(parsed);
        if (parsed.registration_start_date) setRegStart(parsed.registration_start_date);
        if (parsed.registration_deadline) setDeadline(parsed.registration_deadline);
        if (parsed.start_date) setStartDate(parsed.start_date);
        if (parsed.end_date) setEndDate(parsed.end_date);
      } catch (e) {}
    }
  }, []);

  const handleInput = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem("opentity_draft_create", JSON.stringify(data));
  };

  const val = (key: string) => state?.formData?.[key] ?? draft?.[key] ?? "";
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} onInput={handleInput} action={formAction} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm grid md:grid-cols-2 gap-6">
      <div className="md:col-span-2"><FormMessage error={state?.error} /></div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Event Cover Image (Optional)</label>
        <ImageUploader name="image_url" defaultValue={val("image_url")} />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Event Title <span className="text-red-500">*</span></label>
        <input name="title" defaultValue={val("title")} minLength={3} maxLength={100} required className={inputClass} />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
        <RichTextEditor name="description" defaultValue={val("description")} maxLength={5000} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
        <select name="event_type" defaultValue={val("event_type") || "Hackathon"} className={inputClass}>
          {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <select name="category" defaultValue={val("category")} className={inputClass}>
          {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
        <select name="format" defaultValue={val("format")} className={inputClass}>
          {EVENT_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">City (Optional)</label>
        <select name="city" defaultValue={val("city")} className={inputClass}>
          <option value="">Select City</option>
          {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Venue/Location Details</label>
        <div><input name="location" defaultValue={val("location")} maxLength={150} className={inputClass} /><p className="text-[11px] text-slate-500 mt-1">Max 150 characters.</p></div>
      </div>

      <div className="md:col-span-2 border-t border-slate-100 pt-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Timeline & Deadlines</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Opens <span className="text-red-500">*</span></label>
            <input name="registration_start_date" type="date" min={todayStr} max={deadline || endDate} value={regStart} onChange={(e) => { setRegStart(e.target.value); handleInput(); }} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Deadline <span className="text-red-500">*</span></label>
            <input name="registration_deadline" type="date" min={regStart || todayStr} max={endDate} value={deadline} onChange={(e) => { setDeadline(e.target.value); handleInput(); }} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Starts <span className="text-red-500">*</span></label>
            <input name="start_date" type="date" min={regStart || todayStr} max={endDate} value={startDate} onChange={(e) => { setStartDate(e.target.value); handleInput(); }} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Ends <span className="text-red-500">*</span></label>
            <input name="end_date" type="date" min={startDate || regStart || todayStr} value={endDate} onChange={(e) => { setEndDate(e.target.value); handleInput(); }} required className={inputClass} />
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
          <select name="prize_currency" defaultValue={val("prize_currency") || "PKR"} className={inputClass}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Prize Amount (Optional)</label>
          <input name="prize_amount" type="number" defaultValue={val("prize_amount")} placeholder="e.g. 100000" className={inputClass} />
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Eligibility</label>
        <div><input name="eligibility" defaultValue={val("eligibility")} maxLength={250} placeholder="e.g., University students only" className={inputClass} /><p className="text-[11px] text-slate-500 mt-1">Max 250 characters.</p></div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Registration URL <span className="text-red-500">*</span></label>
        <input name="registration_url" type="url" defaultValue={val("registration_url")} placeholder="https://..." required className={inputClass} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Organizer</label>
        <div><input name="organizer" defaultValue={val("organizer")} maxLength={100} placeholder="e.g., NUST, Google, etc." className={inputClass} /><p className="text-[11px] text-slate-500 mt-1">Max 100 characters.</p></div>
      </div>
      
      <div className="md:col-span-2 pt-4 flex gap-4">
        <button 
          type="submit" 
          name="submit_action" 
          value="draft" 
          formNoValidate 
          disabled={isPending} 
          onClick={() => setLoadingBtn('draft')}
          className={`w-1/3 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium transition flex justify-center items-center ${isPending && loadingBtn === 'draft' ? 'opacity-70 bg-slate-200' : 'hover:bg-slate-200'}`}
        >
          {isPending && loadingBtn === 'draft' ? <><Loader2 className="w-4 h-4 animate-spin mr-2"/> Saving...</> : "Save as Draft"}
        </button>
        <button 
          type="submit" 
          name="submit_action" 
          value="publish" 
          disabled={isPending} 
          onClick={() => setLoadingBtn('publish')}
          className={`w-2/3 bg-brand text-white py-3 rounded-lg font-medium transition flex justify-center items-center gap-2 ${isPending && loadingBtn === 'publish' ? 'opacity-70' : 'hover:bg-orange-600'}`}
        >
          {isPending && loadingBtn === 'publish' ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> : "Publish Event"}
        </button>
      </div>
    </form>
  );
}

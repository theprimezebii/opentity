"use client";

import { useActionState, useEffect, useState } from "react";
import { submitContact } from "@/app/actions/contact";
import { FormMessage } from "@/components/ui/FormMessage";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";
import { Send } from "lucide-react";

const inputClass = "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white text-slate-900 text-sm";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, null);
  const [messageLength, setMessageLength] = useState(0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Send us a message</h2>
      <p className="text-sm text-slate-500 mb-6">We typically respond within 24-48 hours.</p>

      <FormMessage error={state?.error} success={state?.success} />

      <form action={formAction} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input name="name" required maxLength={100} placeholder="Your name" className={inputClass} defaultValue={(state?.formData as any)?.name as string} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
            <input name="email" type="email" required placeholder="you@example.com" className={inputClass} defaultValue={(state?.formData as any)?.email as string} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select name="category" defaultValue={(state?.formData as any)?.category || "general"} className={inputClass}>
              <option value="general">General Question</option>
              <option value="bug">Bug Report</option>
              <option value="event">Event Issue / Removal</option>
              <option value="partnership">Partnership / Collaboration</option>
              <option value="feature">Feature Request</option>
              <option value="account">Account Issue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
            <input name="subject" required maxLength={200} placeholder="Brief subject" className={inputClass} defaultValue={(state?.formData as any)?.subject as string} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-slate-700">Message <span className="text-red-500">*</span></label>
            <span className={`text-xs font-medium ${messageLength > 2000 ? 'text-red-500' : 'text-slate-400'}`}>{messageLength}/2000</span>
          </div>
          <textarea 
            name="message" 
            required 
            rows={6} 
            maxLength={2000}
            onChange={(e) => setMessageLength(e.target.value.length)}
            placeholder="Describe your question, issue, or suggestion in detail..."
            className={inputClass}
            defaultValue={(state?.formData as any)?.message as string}
          ></textarea>
        </div>

        <div className="pt-2">
          <FormSubmitButton 
            loadingText="Sending..."
            className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Send Message
          </FormSubmitButton>
        </div>
      </form>
    </div>
  );
}

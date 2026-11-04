"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/profile";
import { checkUsernameAvailability } from "@/app/actions/username-check";
import { PAKISTAN_CITIES } from "@/lib/constants";
import { getProfileCompleteness } from "@/lib/profile-completeness";
import { FormMessage } from "@/components/ui/FormMessage";
import { AvatarUploader } from "./AvatarUploader";
import { Loader2, CheckCircle2, XCircle, User, Code, Link as LinkIcon, Users, Sparkles } from "lucide-react";
import { generateAIBio } from "@/app/actions/ai";

const inputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none bg-white text-slate-900 transition-all text-sm";

export function ProfileForm({ profile, academicCount = 0 }: { profile: any; academicCount?: number }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);
  const completeness = getProfileCompleteness(profile, academicCount);
  
  const formRef = useRef<HTMLFormElement>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [bioLength, setBioLength] = useState(profile.bio?.length || 0);
  const [skillPills, setSkillPills] = useState<string[]>(profile.skills || []);
  
  const [usernameStatus, setUsernameStatus] = useState<{ available: boolean, message: string } | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isChecking, startUsernameCheck] = useTransition();

  const [showSuccess, setShowSuccess] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const formData = (state as any)?.formData;

  // Dispatch events to external save button + scroll on error + auto-hide success
  useEffect(() => {
    if (state?.error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.dispatchEvent(new Event("profile-save-end"));
    }
    if (state?.success) {
      setShowSuccess(true);
      window.dispatchEvent(new Event("profile-save-success"));
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [state?.error, state?.success]);

  useEffect(() => {
    if (isPending) window.dispatchEvent(new Event("profile-save-start"));
  }, [isPending]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("opentity_profile_draft");
    if (savedDraft && formRef.current) {
      try {
        const parsed = JSON.parse(savedDraft);
        Object.keys(parsed).forEach(key => {
          const input = formRef.current?.elements.namedItem(key) as HTMLInputElement;
          if (input && !input.value && parsed[key]) input.value = parsed[key];
        });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (state?.success) localStorage.removeItem("opentity_profile_draft");
    if (formData?.bio) setBioLength(formData.bio.length);
    if (formData?.skills) setSkillPills(formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean));
  }, [state?.success, formData]);

  const handleInput = () => {
    if (!formRef.current) return;
    setIsSavingDraft(true);
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    localStorage.setItem("opentity_profile_draft", JSON.stringify(data));
    setTimeout(() => setIsSavingDraft(false), 1000);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    e.target.value = cleaned;
    handleInput();
    if (cleaned.length < 3) { setUsernameStatus(null); return; }
    setIsCheckingUsername(true);
    startUsernameCheck(async () => {
      const result = await checkUsernameAvailability(cleaned);
      setUsernameStatus(result);
      setIsCheckingUsername(false);
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInput();
    setSkillPills(e.target.value.split(",").map(s => s.trim()).filter(Boolean));
  };

  const handleAIGenerate = async () => {
    setIsGeneratingBio(true);
    const res = await generateAIBio(profile);
    if (res.bio) {
      const textarea = formRef.current?.elements.namedItem("bio") as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = res.bio;
        setBioLength(res.bio.length);
        handleInput();
      }
    }
    setIsGeneratingBio(false);
  };

  const val = (key: string) => {
    if (formData && formData[key] !== undefined) return formData[key];
    if (key === "skills" && profile.skills) return profile.skills.join(", ");
    return profile[key] || "";
  };

  return (
    <form id="profile-form" ref={formRef} onInput={handleInput} action={formAction} className="space-y-6">
      <FormMessage error={state?.error} success={state?.success} />

      {/* HEADER CARD */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
          <div className="flex-shrink-0">
            <AvatarUploader name="avatar_url" userId={profile.id} defaultValue={formData?.avatar_url || profile.avatar_url} />
          </div>
          <div className="flex-grow text-center sm:text-left min-w-0">
            <h2 className="text-xl font-bold text-slate-900 truncate">{formData?.full_name || profile.full_name}</h2>
            <p className="text-sm text-slate-500 truncate">@{formData?.username || profile.username}</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className={`text-2xl font-bold leading-none ${completeness === 100 ? 'text-orange-400' : 'text-orange-500'}`}>{completeness}%</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Complete</p>
            </div>
            <svg className="w-14 h-14 -rotate-90 flex-shrink-0" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={completeness === 100 ? "#10b981" : "#7c3aed"} strokeWidth="3" strokeDasharray={`${(completeness / 100) * 100} 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
            </svg>
          </div>
        </div>
      </div>

      {/* MAIN FIELDS */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <User className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-900">Personal Details</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input name="full_name" defaultValue={val("full_name")} required maxLength={100} placeholder="e.g., Ali Khan" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
              <input name="username" defaultValue={val("username")} onChange={handleUsernameChange} required placeholder="e.g., alikhan" maxLength={20} className={`${inputClass} pl-8 pr-10 ${usernameStatus ? (usernameStatus.available ? 'border-green-400 focus:ring-orange-400' : 'border-red-400 focus:ring-red-500') : ''}`} />
              {(isCheckingUsername || isChecking) && <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
              {!isCheckingUsername && !isChecking && usernameStatus && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus.available ? <CheckCircle2 className="w-4 h-4 text-orange-400" /> : <XCircle className="w-4 h-4 text-red-500" />}
                </span>
              )}
            </div>
            <p className={`text-[10px] mt-1 font-medium ${usernameStatus ? (usernameStatus.available ? 'text-orange-500' : 'text-red-600') : 'text-slate-400'}`}>
              {usernameStatus ? usernameStatus.message : "Letters, numbers, underscores."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
            <select name="city" defaultValue={val("city")} className={inputClass}>
              <option value="">Select City</option>
              {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-slate-700">Short Bio</label>
                <button type="button" onClick={handleAIGenerate} disabled={isGeneratingBio} className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-orange-100 transition">
                  {isGeneratingBio ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Generate with AI
                </button>
              </div>
              <span className={`text-[10px] font-medium ${bioLength >= 250 ? 'text-red-500' : 'text-slate-400'}`}>{bioLength}/250</span>
            </div>
            <textarea name="bio" defaultValue={val("bio")} rows={3} onChange={(e) => setBioLength(e.target.value.length)} placeholder="Tell us about yourself..." className={inputClass} maxLength={250}></textarea>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <LinkIcon className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-900">Social Links</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
            <input name="linkedin_url" type="url" defaultValue={val("linkedin_url")} maxLength={255} placeholder="https://linkedin.com/in/..." className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
            <input name="github_url" type="url" defaultValue={val("github_url")} maxLength={255} placeholder="https://github.com/..." className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio</label>
            <input name="portfolio_url" type="url" defaultValue={val("portfolio_url")} maxLength={255} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resume / CV Link</label>
            <input name="resume_url" type="url" defaultValue={val("resume_url")} maxLength={255} placeholder="https://drive.google.com/..." className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Twitter / X</label>
            <input name="twitter_url" type="url" defaultValue={val("twitter_url")} maxLength={255} placeholder="https://twitter.com/..." className={inputClass} />
          </div>
        </div>
      </div>

      {/* TEAM & SKILLS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Code className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-slate-900">Skills & Availability</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Skills</label>
          <input name="skills" defaultValue={val("skills")} maxLength={300} onChange={handleSkillsChange} placeholder="e.g., React, Python, UI/UX" className={inputClass} />
          {skillPills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {skillPills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-100">{skill}</span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition">
            <input type="checkbox" name="looking_for_team" defaultChecked={formData ? formData.looking_for_team === "on" : profile.looking_for_team} className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400" />
            <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> I am looking for a team</span>
          </label>
        </div>
      </div>
    </form>
  );
}

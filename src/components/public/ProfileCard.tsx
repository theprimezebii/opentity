"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { PAKISTAN_CITIES } from "@/lib/constants";
import { Loader2, Mail, Building2, MapPin, Pencil, X, CheckCircle2 } from "lucide-react";

export function ProfileCard({ user, profile }: { user: any, profile: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(null, formData);

    setIsPending(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (isEditing) {
    return (
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Edit Profile</h2>
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
            <input name="full_name" defaultValue={profile.full_name || ""} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">University</label>
            <input name="university" defaultValue={profile.university || ""} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
            <select name="city" defaultValue={profile.city || ""} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-sm bg-white">
              <option value="">Select City</option>
              {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" disabled={isPending} className="w-full py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition flex justify-center items-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-slate-900">My Profile</h2>
        <button onClick={() => setIsEditing(true)} className="p-1.5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition" title="Edit Profile">
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {success && (
        <div className="mb-4 p-2 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg border border-orange-100 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Profile updated
        </div>
      )}
      
      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
          <div>
            <p className="font-medium text-slate-900">Email Address</p>
            <p className="text-slate-500 break-all">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
          <div>
            <p className="font-medium text-slate-900">University</p>
            <p className="text-slate-500">{profile?.university || "Not specified"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
          <div>
            <p className="font-medium text-slate-900">City</p>
            <p className="text-slate-500">{profile?.city || "Not specified"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/actions/users";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setIsPending(true);
    
    const res = await updateUserRole(userId, newRole);
    
    setIsPending(false);
    
    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="relative flex items-center justify-end">
      {isPending && <Loader2 className="w-4 h-4 animate-spin text-orange-400 absolute left-2" />}
      <select
        defaultValue={currentRole || 'student'}
        onChange={handleChange}
        disabled={isPending}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-brand ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="student">Student</option>
        <option value="contributor">Contributor (Add Events Only)</option>
        <option value="admin">Admin (Full Access)</option>
      </select>
    </div>
  );
}

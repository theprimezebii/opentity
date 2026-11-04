import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ShieldAlert, User as UserIcon, Mail, Calendar, Star } from "lucide-react";
import { FormMessage } from "@/components/ui/FormMessage";
import { RoleSelector } from "@/components/admin/RoleSelector";
import { connection } from "next/server";
import { Suspense } from "react";

export const instant = false;

async function UsersList({ searchParams }: { searchParams: { success?: string, error?: string } }) {
  await connection();
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return <div className="text-red-500">Error loading users: {error.message}</div>;

  const totalUsers = profiles?.length || 0;
  const totalAdmins = profiles?.filter(p => p.role === 'admin').length || 0;
  const totalContributors = profiles?.filter(p => p.role === 'contributor').length || 0;

  return (
    <div className="max-w-5xl mx-auto">
      <FormMessage success={searchParams.success} autoHide clearUrl />
      {searchParams.error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">{searchParams.error}</div>}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Manage roles for students, contributors, and admins.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-brand-light text-brand rounded-lg"><UserIcon className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-lg"><Star className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Contributors</p>
            <p className="text-2xl font-bold text-slate-900">{totalContributors}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-lg"><ShieldAlert className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Admins</p>
            <p className="text-2xl font-bold text-slate-900">{totalAdmins}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {profiles?.map((profile) => (
              <tr key={profile.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold uppercase">
                      {profile.full_name ? profile.full_name.charAt(0) : profile.email.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 flex items-center gap-2">
                        {profile.full_name || "No Name"}
                        {profile.id === user?.id && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">You</span>}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {profile.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {formatDate(profile.created_at)}</div>
                </td>
                <td className="px-6 py-4">
                  {profile.role === 'admin' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"><ShieldAlert className="w-3.5 h-3.5" /> Admin</span>}
                  {profile.role === 'contributor' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200"><Star className="w-3.5 h-3.5" /> Contributor</span>}
                  {(!profile.role || profile.role === 'student') && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"><UserIcon className="w-3.5 h-3.5" /> Student</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  {profile.id !== user?.id && (
                    <RoleSelector userId={profile.id} currentRole={profile.role} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div className="text-center py-20">Loading users...</div>}>
      <UsersList searchParams={params} />
    </Suspense>
  );
}

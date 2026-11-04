import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import { LayoutDashboard, Calendar, PlusCircle, ShieldAlert, LogOut, Inbox, Users, ArrowLeft, Home, Images } from "lucide-react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { logout } from "@/app/actions/auth";

async function AdminNav() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role || 'student';

  if (role === 'student') redirect("/dashboard");

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 md:min-h-screen md:fixed md:left-0 md:top-0 md:flex md:flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href={role === 'admin' ? "/admin" : "/dashboard"} className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-400" /> {APP_NAME} {role === 'admin' ? 'Admin' : 'Contributor'}
        </Link>
      </div>
      
      <nav className="flex md:flex-col overflow-x-auto md:overflow-visible py-4 px-4 gap-2 md:space-y-1">
        {role === 'admin' ? (
          <>
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap">
              <LayoutDashboard className="w-5 h-5" /> Overview
            </Link>
            <Link href="/admin/homepage" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap">
              <Home className="w-5 h-5" /> Homepage
            </Link>
            <Link href="/admin/homepage/gallery" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap">
              <Images className="w-5 h-5" /> Gallery
            </Link>
            <Link href="/admin/submissions" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap">
              <Inbox className="w-5 h-5" /> Submissions
            </Link>
            <Link href="/admin/events" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap">
              <Calendar className="w-5 h-5" /> Manage Events
            </Link>
            <Link href="/admin/events/create" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap">
              <PlusCircle className="w-5 h-5" /> Add Event
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap">
              <Users className="w-5 h-5" /> Users
            </Link>
          </>
        ) : (
          <>
            <Link href="/admin/events/create" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap bg-slate-800 text-white">
              <PlusCircle className="w-5 h-5" /> Add New Event
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition whitespace-nowrap">
              <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 md:mt-auto border-t border-slate-800">
        <form action={logout}>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition">
            <LogOut className="w-5 h-5" /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Suspense fallback={<div className="w-full md:w-64 bg-slate-900 min-h-16 md:min-h-screen" />}>
        <AdminNav />
      </Suspense>
      <main className="flex-1 w-full md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}

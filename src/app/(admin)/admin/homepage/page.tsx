import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { AdminStatsForm } from "@/components/admin/AdminStatsForm";

export const metadata = { title: "Homepage Settings" };
export const instant = false;

export default async function AdminHomepagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/homepage");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const settings = await getSiteSettings();

  // Real counts for context
  const [{ count: realEvents }, { count: realStudents }] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }).neq("status", "draft"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Admin
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homepage counters</h1>
          <p className="text-sm text-slate-500">
            Set the minimum numbers shown on the homepage. Once real counts pass these, they take over.
          </p>
        </div>
      </div>

      <AdminStatsForm
        initial={settings}
        realEvents={realEvents || 0}
        realStudents={realStudents || 0}
      />
    </main>
  );
}

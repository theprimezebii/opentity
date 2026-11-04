import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { Calendar, Users, Inbox, Clock, FileEdit, Star, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const instant = false;

async function DashboardOverview() {
  await connection();
  const supabase = await createClient();

  // 1. Fetch Counts
  const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: submissionCount } = await supabase.from("event_submissions").select("*", { count: "exact", head: true }).eq("status", "pending");
  const { count: contributorCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "contributor");

  // 2. Fetch Latest Pending Submissions
  const { data: pendingSubs } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(3);

  // 3. Fetch Recently Added Events
  const { data: recentEvents } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  // 4. Fetch Closing Soon Events
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  const { data: closingSoon } = await supabase
    .from("events")
    .select("*")
    .gte("registration_deadline", today.toISOString())
    .lte("registration_deadline", threeDaysFromNow.toISOString())
    .neq("status", "draft")
    .order("registration_deadline", { ascending: true })
    .limit(3);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Platform metrics and recent activity.</p>
        </div>
      </div>

      {/* TOP ROW: Clean, monochromatic stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Events" value={eventCount || 0} icon={<Calendar className="w-4 h-4" />} />
        <StatCard title="Total Users" value={userCount || 0} icon={<Users className="w-4 h-4" />} />
        <StatCard title="Pending Reviews" value={submissionCount || 0} icon={<Inbox className="w-4 h-4" />} highlight={submissionCount && submissionCount > 0 ? true : false} />
        <StatCard title="Contributors" value={contributorCount || 0} icon={<ShieldAlert className="w-4 h-4" />} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Needs Attention */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
              <h2 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-slate-500" /> Pending Submissions
              </h2>
              <Link href="/admin/submissions" className="text-xs font-medium text-brand hover:text-orange-600 flex items-center gap-1 transition">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 flex-grow">
              {!pendingSubs || pendingSubs.length === 0 ? (
                <div className="p-8 text-sm text-slate-500 text-center flex flex-col items-center justify-center h-full">
                  <CheckCircle className="w-8 h-8 text-slate-300 mb-3" />
                  You're all caught up.
                </div>
              ) : (
                pendingSubs.map(sub => (
                  <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition group">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-medium text-slate-900 truncate">{sub.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{sub.submitter_email}</p>
                    </div>
                    <Link href="/admin/submissions" className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition whitespace-nowrap">
                      Review
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Closing Soon */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
              <h2 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" /> Closing Soon
              </h2>
            </div>
            <div className="divide-y divide-slate-100 flex-grow">
              {!closingSoon || closingSoon.length === 0 ? (
                <div className="p-8 text-sm text-slate-500 text-center flex items-center justify-center h-full">
                  No deadlines in the next 3 days.
                </div>
              ) : (
                closingSoon.map(event => (
                  <div key={event.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition group">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                      <p className="text-xs text-red-600 font-medium mt-0.5">Closes {formatDate(event.registration_deadline)}</p>
                    </div>
                    <Link href={`/admin/events/edit/${event.id}`} className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition whitespace-nowrap">
                      Edit
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Recently Added */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
              <h2 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-slate-500" /> Recently Added
              </h2>
              <Link href="/admin/events" className="text-xs font-medium text-brand hover:text-orange-600 flex items-center gap-1 transition">
                Manage All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 flex-grow">
              {recentEvents?.map(event => (
                <div key={event.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition group">
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    {event.status === 'draft' ? (
                      <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md flex-shrink-0"><FileEdit className="w-3.5 h-3.5" /></div>
                    ) : (
                      <div className="p-1.5 bg-orange-50 text-orange-500 rounded-md flex-shrink-0"><CheckCircle className="w-3.5 h-3.5" /></div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate flex items-center gap-2">
                        {event.title}
                        {event.is_featured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{event.category}</span>
                        <span>•</span>
                        <span className={event.status === 'draft' ? 'text-slate-500' : 'text-orange-500 font-medium'}>
                          {event.status === 'draft' ? 'Draft' : 'Published'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/events/edit/${event.id}`} className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition whitespace-nowrap">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, highlight = false }: { title: string, value: number, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${highlight ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
        {icon}
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading overview...</div>}>
      <DashboardOverview />
    </Suspense>
  );
}

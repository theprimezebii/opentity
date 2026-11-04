import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, FileText, ArrowRight, ShieldCheck, Pencil, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "My Submissions" };
export const instant = false;

async function SubmissionsContent() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: submissions } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("submitted_by", user.id)
    .order("created_at", { ascending: false });

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-rose-400" />
        <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No submissions yet</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Found a hackathon that's missing from Opentity? Help the community by adding it.</p>
        <Link href="/submit" className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/25">
          Submit Your First Event
        </Link>
      </div>
    );
  }

  // Stats
  const total = submissions.length;
  const pending = submissions.filter(s => s.status === "pending").length;
  const approved = submissions.filter(s => s.status === "approved").length;
  const rejected = submissions.filter(s => s.status === "rejected").length;

  return (
    <>
      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{total}</p>
          <p className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-1">Total</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-500/30 shadow-sm text-center">
          <p className="text-2xl md:text-3xl font-bold text-yellow-700 dark:text-yellow-400">{pending}</p>
          <p className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-yellow-700 dark:text-yellow-500 mt-1">Pending</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-500/30 shadow-sm text-center">
          <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">{approved}</p>
          <p className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-500 mt-1">Approved</p>
        </div>
        <div className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-4 border border-red-200 dark:border-red-500/30 shadow-sm text-center">
          <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">{rejected}</p>
          <p className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-red-700 dark:text-red-500 mt-1">Rejected</p>
        </div>
      </div>

      {/* SUBMISSIONS LIST */}
      <div className="space-y-4">
        {submissions.map((sub) => {
          const isPending = sub.status === "pending";
          const isApproved = sub.status === "approved";
          const isRejected = sub.status === "rejected";

          return (
            <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2">{sub.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-slate-400" /> {sub.category}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{sub.event_type}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Submitted {formatDate(sub.created_at)}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isPending && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30 text-xs font-bold uppercase rounded-lg">
                        <Clock className="w-3.5 h-3.5" /> Pending Review
                      </span>
                    )}
                    {isApproved && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold uppercase rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Live
                      </span>
                    )}
                    {isRejected && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-xs font-bold uppercase rounded-lg">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Rejection Feedback */}
                {isRejected && sub.reviewer_notes && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-800 dark:text-red-400">Admin Feedback</p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">{sub.reviewer_notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {(isPending || isRejected) && (
                    <Link 
                      href={`/dashboard/submissions/${sub.id}/edit`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
                        isRejected 
                          ? "bg-orange-500 text-white hover:bg-orange-600" 
                          : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                      }`}
                    >
                      <Pencil className="w-4 h-4" /> {isRejected ? "Edit & Resubmit" : "Edit Submission"}
                    </Link>
                  )}
                  {isApproved && (
                    <Link 
                      href={`/events`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-bold text-sm hover:bg-orange-600 transition"
                    >
                      View on Events Page <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg font-medium text-sm border border-slate-200 dark:border-slate-700">
                      <Clock className="w-4 h-4" /> Awaiting admin review
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function SubmissionsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">My Submissions</h1>
          <p className="text-slate-500 dark:text-slate-400">Track, edit, and manage the events you've submitted.</p>
        </div>
        <Link href="/submit" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-md shadow-orange-500/20 shrink-0">
          Submit New Event
        </Link>
      </div>

      <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div><div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div><div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div></div>}>
        <SubmissionsContent />
      </Suspense>
    </div>
  );
}

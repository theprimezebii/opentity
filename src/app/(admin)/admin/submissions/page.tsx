import { createClient } from "@/lib/supabase/server";
import { approveSubmission, rejectSubmission } from "@/app/actions/submissions";
import { formatDate, stripHtml } from "@/lib/utils";
import { Check, X, ExternalLink, Calendar, MapPin, Trophy } from "lucide-react";
import { FormMessage } from "@/components/ui/FormMessage";
import { connection } from "next/server";
import { Suspense } from "react";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";

export const instant = false;

async function SubmissionsQueue({ success }: { success: string }) {
  await connection();
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-5xl mx-auto">
      <FormMessage success={success} autoHide clearUrl />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Pending Submissions</h1>
        <p className="text-slate-500 mt-1">Review events submitted by the community before publishing.</p>
      </div>

      {!submissions || submissions.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <p className="text-slate-500">You're all caught up! No pending submissions.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase rounded-md">{sub.event_type}</span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-md">{sub.category}</span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md">{sub.format}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{sub.title}</h2>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{stripHtml(sub.description)}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(sub.start_date)}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {sub.city || sub.format}</div>
                  {sub.prize_amount && <div className="flex items-center gap-1.5 text-orange-500 font-medium"><Trophy className="w-4 h-4" /> {sub.prize_currency} {sub.prize_amount.toLocaleString()}</div>}
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
                  <p><strong>Submitted by:</strong> {sub.submitter_email}</p>
                  <p className="mt-1"><a href={sub.registration_url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">View Registration Link <ExternalLink className="w-3 h-3" /></a></p>
                </div>
              </div>

              <div className="md:w-48 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col justify-center gap-3">
                <form action={async () => { "use server"; await approveSubmission(sub.id); }}>
                  <FormSubmitButton 
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </FormSubmitButton>
                </form>
                <form action={async () => { "use server"; await rejectSubmission(sub.id); }}>
                  <FormSubmitButton 
                    className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 py-2 rounded-lg font-medium hover:bg-red-50 transition"
                  >
                    <X className="w-4 h-4" /> Reject
                  </FormSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: Promise<{ success: string }> }) {
  const { success } = await searchParams;
  return (
    <Suspense fallback={<div className="text-center py-20">Loading submissions...</div>}>
      <SubmissionsQueue success={success} />
    </Suspense>
  );
}

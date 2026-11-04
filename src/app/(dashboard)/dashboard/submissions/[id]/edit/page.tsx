import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { SubmitEventForm } from "@/components/public/SubmitEventForm";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Edit Submission" };
export const instant = false;

async function EditSubmissionContent({ id }: { id: string }) {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: submission } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) notFound();
  if (submission.submitted_by !== user.id) notFound();
  if (submission.status === "approved") {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto">
        <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Cannot Edit</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          This submission has been approved and is now live. Approved events can only be edited by admins.
        </p>
        <Link href="/dashboard/submissions" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition">
          Back to Submissions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/submissions" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-500 transition mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Submissions
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Edit Submission</h1>
        <p className="text-slate-500 dark:text-slate-400">Update the details of <strong className="text-slate-900 dark:text-white">{submission.title}</strong>.</p>
      </div>
      <SubmitEventForm mode="edit" submission={submission} />
    </div>
  );
}

export default async function EditSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500 animate-pulse">Loading...</div>}>
      <EditSubmissionContent id={id} />
    </Suspense>
  );
}

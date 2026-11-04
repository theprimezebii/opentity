import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { EditEventForm } from "@/components/admin/EditEventForm";
import { connection } from "next/server";
import { Suspense } from "react";

export const instant = false;

async function EditEventContent({ id }: { id: string }) {
  // 1. Call connection() BEFORE any date logic
  await connection();

  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Event</h1>
        <p className="text-slate-500 mt-1">Update the details for "{event.title}".</p>
      </div>
      <EditEventForm event={event} />
    </div>
  );
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    // 2. Wrap in Suspense to allow the page shell to prerender
    <Suspense fallback={<div className="max-w-3xl mx-auto py-12 text-center text-slate-500">Loading event...</div>}>
      <EditEventContent id={id} />
    </Suspense>
  );
}

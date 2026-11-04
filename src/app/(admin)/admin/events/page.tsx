import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { publishDraft, toggleFeaturedEvent } from "@/app/actions/events";
import { formatDate, getEventStatus } from "@/lib/utils";
import { Plus, ExternalLink, Pencil, CheckCircle, FileEdit, Star } from "lucide-react";
import { FormMessage } from "@/components/ui/FormMessage";
import { DraftCleaner } from "@/components/ui/DraftCleaner";
import { connection } from "next/server";
import { Suspense } from "react";
import { EventsFilterBar } from "@/components/admin/EventsFilterBar";
import { Pagination } from "@/components/admin/Pagination";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";

export const instant = false;

async function EventsTable({ searchParams }: { searchParams: any }) {
  await connection();
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  const role = profile?.role || 'student';

  const { success, q, category, reg_status, evt_status, page } = searchParams;
  const currentPage = Number(page) || 1;
  const itemsPerPage = 10;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabase.from("events").select("*", { count: "exact" });
  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category", category);

  const now = new Date().toISOString();
  const twoDaysFromNow = new Date(new Date().getTime() + 2*24*60*60*1000).toISOString();

  if (reg_status === "reg_closed") query = query.lt("registration_deadline", now);
  if (reg_status === "reg_opening") query = query.gt("registration_start_date", now);
  if (reg_status === "reg_open") query = query.lte("registration_start_date", now).gt("registration_deadline", twoDaysFromNow);
  if (reg_status === "reg_closing") query = query.lte("registration_deadline", twoDaysFromNow).gt("registration_deadline", now);
  if (evt_status === "evt_completed") query = query.lt("end_date", now);
  if (evt_status === "evt_ongoing") query = query.lte("start_date", now).gte("end_date", now);
  if (evt_status === "evt_upcoming") query = query.gt("start_date", now);

  const { data: events, count } = await query
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  return (
    <>
      <FormMessage success={success} autoHide clearUrl />
      {success && <DraftCleaner type="create" />}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Events</h1>
          <p className="text-slate-500 mt-1">View, edit, or delete events from the platform.</p>
        </div>
        <Link href="/admin/events/create" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> Add New Event
        </Link>
      </div>

      <EventsFilterBar />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Event Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!events || events.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No events match your criteria.</td></tr>
            ) : (
              events.map((event) => {
                const { regStatus, eventStatus } = getEventStatus(event);
                const isDraft = event.status === 'draft';
                return (
                  <tr key={event.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        {event.title}
                        {event.is_featured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="text-xs text-slate-400 font-normal mt-0.5">{event.category}</div>
                    </td>
                    <td className="px-6 py-4 flex flex-col gap-1 items-start">
                      {isDraft ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold border bg-slate-100 text-slate-600 border-slate-300 flex items-center gap-1">
                          <FileEdit className="w-3 h-3" /> Draft
                        </span>
                      ) : (
                        <>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${regStatus.color}`}>{regStatus.label}</span>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${eventStatus.color}`}>{eventStatus.label}</span>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-slate-900 font-medium">{formatDate(event.start_date)}</div>
                      <div className="text-slate-400">to {formatDate(event.end_date)}</div>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                      {role === 'admin' && !isDraft && (
                        <form action={async () => { "use server"; await toggleFeaturedEvent(event.id, event.is_featured); }}>
                          <FormSubmitButton
                            iconOnly
                            className={`p-2 rounded-lg transition inline-flex items-center justify-center ${event.is_featured ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50' : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                          >
                            <Star className="w-4 h-4" fill={event.is_featured ? "currentColor" : "none"} />
                          </FormSubmitButton>
                        </form>
                      )}
                      {role === 'admin' && isDraft && (
                        <form action={async () => { "use server"; await publishDraft(event.id); }}>
                          <FormSubmitButton
                            className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Publish
                          </FormSubmitButton>
                        </form>
                      )}
                      <Link href={`/admin/events/edit/${event.id}`} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <Link href={`/events/${event.slug}`} target="_blank" className={`p-2 text-slate-400 hover:text-blue-600 transition ${isDraft ? 'hidden' : ''}`} title="View">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      {role === 'admin' && (
                        <DeleteEventButton eventId={event.id} />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination totalPages={totalPages} />
    </>
  );
}

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  return (
    <div className="max-w-6xl mx-auto">
      <Suspense fallback={<div className="text-center py-20">Loading events...</div>}>
        <EventsTable searchParams={params} />
      </Suspense>
    </div>
  );
}

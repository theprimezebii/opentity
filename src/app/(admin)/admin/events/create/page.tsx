import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateEventForm } from "@/components/admin/CreateEventForm";

export const instant = false;

export default function CreateEventPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Add New Event</h1>
        <p className="text-slate-500 mt-1">Fill in the details below to publish a new opportunity.</p>
      </div>
      <CreateEventForm />
    </div>
  );
}

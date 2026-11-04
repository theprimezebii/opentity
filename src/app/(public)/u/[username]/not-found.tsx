import Link from "next/link";
import { UserX, ArrowRight, Compass } from "lucide-react";

export default function UserNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserX className="w-12 h-12 text-slate-300" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile not found</h1>
        <p className="text-slate-500 mb-8">
          This user doesn't exist on Opentity yet. They might have changed their username, or the link might be broken.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/events" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition">
            <Compass className="w-4 h-4" /> Explore Events
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition">
            Join Opentity <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

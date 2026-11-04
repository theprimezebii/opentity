import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import { Mail, AlertCircle, Bug, Handshake, HelpCircle, User as UserIcon } from "lucide-react";
import { FormMessage } from "@/components/ui/FormMessage";

export const instant = false;

const categoryIcons: Record<string, any> = {
  general: HelpCircle,
  bug: Bug,
  event: AlertCircle,
  partnership: Handshake,
  feature: HelpCircle,
  account: UserIcon,
};

const categoryColors: Record<string, string> = {
  general: "text-slate-600 bg-slate-50 border-slate-200",
  bug: "text-red-600 bg-red-50 border-red-200",
  event: "text-orange-600 bg-orange-50 border-orange-200",
  partnership: "text-orange-500 bg-orange-50 border-orange-200",
  feature: "text-blue-600 bg-blue-50 border-blue-200",
  account: "text-amber-600 bg-amber-50 border-amber-200",
};

async function MessagesList() {
  await connection();
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-slate-500 mt-1">All messages submitted via the Contact form.</p>
      </div>

      {!messages || messages.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const Icon = categoryIcons[msg.category] || Mail;
            const colorClass = categoryColors[msg.category] || categoryColors.general;
            return (
              <div key={msg.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{msg.subject}</h3>
                      <p className="text-sm text-slate-500">{msg.name} &lt;{msg.email}&gt;</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded border ${colorClass}`}>
                      {msg.category}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(msg.created_at)}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed pl-11">
                  {msg.message}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-3">
                  <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="text-sm font-semibold text-orange-500 hover:underline">
                    Reply via Email
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const { success } = await searchParams;
  return (
    <Suspense fallback={<div className="text-center py-20">Loading messages...</div>}>
      <FormMessage success={success} autoHide clearUrl />
      <MessagesList />
    </Suspense>
  );
}

"use client";

import { useActionState } from "react";
import { updateStatsFloors } from "@/app/actions/site-settings";
import { FormMessage } from "@/components/ui/FormMessage";
import { Loader2, Save } from "lucide-react";
import type { SiteSettings } from "@/lib/queries/site-settings";

interface Props {
  initial: SiteSettings;
  realEvents: number;
  realStudents: number;
}

export function AdminStatsForm({ initial, realEvents, realStudents }: Props) {
  const [state, action, isPending] = useActionState(updateStatsFloors, null);

  return (
    <form action={action} className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
      <FormMessage error={state?.error} success={state?.success} />

      <Field
        name="events_floor"
        label="Events counter"
        defaultValue={initial.events_floor}
        realCount={realEvents}
        help="Shown as this number (with +) until real events count surpasses it."
      />

      <Field
        name="students_floor"
        label="Students counter"
        defaultValue={initial.students_floor}
        realCount={realStudents}
        help="Shown as this number (with +) until real students count surpasses it."
      />

      <Field
        name="cities_floor"
        label="Cities counter"
        defaultValue={initial.cities_floor}
        realCount={null}
        help="Currently hardcoded. Shown with + suffix always."
        alwaysSuffix
      />

      <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition">
        <input
          type="checkbox"
          name="stats_show_real"
          defaultChecked={initial.show_real}
          className="mt-1 w-4 h-4 text-orange-500 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
        />
        <div>
          <p className="text-sm font-semibold text-slate-900">Show real data only</p>
          <p className="text-xs text-slate-500 mt-0.5">
            When checked, homepage displays actual counts (no floor padding, no + suffix).
            Use this when you want fully honest numbers.
          </p>
        </div>
      </label>

      <div className="flex justify-end pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  realCount,
  help,
  alwaysSuffix = false,
}: {
  name: string;
  label: string;
  defaultValue: number;
  realCount: number | null;
  help: string;
  alwaysSuffix?: boolean;
}) {
  const belowFloor = realCount !== null && realCount < defaultValue;
  const display =
    realCount === null
      ? `${defaultValue}${alwaysSuffix ? "+" : ""}`
      : belowFloor
      ? `${defaultValue}+`
      : `${realCount}${alwaysSuffix ? "+" : ""}`;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          name={name}
          defaultValue={defaultValue}
          min={0}
          step={1}
          required
          className="w-40 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-slate-900"
        />
        <span className="text-sm text-slate-500">
          Currently: <strong className="text-slate-900">{display}</strong>
          {realCount !== null && belowFloor && (
            <span className="text-slate-400"> (real: {realCount})</span>
          )}
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-1.5">{help}</p>
    </div>
  );
}

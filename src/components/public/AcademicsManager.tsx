"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import { addAcademic, updateAcademic, deleteAcademic } from "@/app/actions/profile";
import { Plus, Trash2, GraduationCap, Loader2, Pencil, X } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export function AcademicsManager({ academics }: { academics: any[] }) {
  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [addState, addFormAction, addPending] = useActionState(addAcademic, null);
  const [editState, editFormAction, editPending] = useActionState(
    (prev: any, fd: FormData) => updateAcademic(editingId!, prev, fd),
    null
  );

  const editingRecord = academics.find(a => a.id === editingId);
  const currentState = mode === "edit" ? editState : addState;
  const currentPending = mode === "edit" ? editPending : addPending;
  const formData = (currentState as any)?.formData;

  // Auto-close on success
  useEffect(() => {
    if (currentState?.success) {
      setMode("idle");
      setEditingId(null);
    }
  }, [currentState?.success]);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this academic record? This action cannot be undone.")) return;
    startTransition(async () => {
      await deleteAcademic(id);
    });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setMode("edit");
  };

  const handleCancel = () => {
    setMode("idle");
    setEditingId(null);
  };

  const val = (key: string) => {
    if (formData && formData[key] !== undefined) return formData[key];
    return editingRecord?.[key] || "";
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-slate-400" /> Academic History
        </h3>
        {mode === "idle" && (
          <button onClick={() => setMode("add")} className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Degree
          </button>
        )}
      </div>

      {mode !== "idle" && (
        <form 
          key={editingId || "new"} 
          action={mode === "edit" ? editFormAction : addFormAction} 
          className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {mode === "edit" ? "Edit Degree" : "Add New Degree"}
            </p>
            <button type="button" onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {currentState?.error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{currentState.error}</p>}
          {currentState?.success && <p className="text-xs text-orange-500 bg-orange-50 p-2 rounded border border-orange-200">{currentState.success}</p>}

          <input 
            name="institution" 
            required 
            maxLength={100} 
            defaultValue={val("institution")}
            placeholder="Institution (e.g., NUST)" 
            className="w-full px-3 py-2 border rounded-lg text-sm" 
          />
          <input 
            name="degree" 
            required 
            maxLength={100} 
            defaultValue={val("degree")}
            placeholder="Degree (e.g., BS Computer Science)" 
            className="w-full px-3 py-2 border rounded-lg text-sm" 
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Start Year</label>
              <input 
                name="start_year" 
                type="number" 
                min="1950" 
                max={CURRENT_YEAR} 
                defaultValue={val("start_year")}
                placeholder={`e.g., ${CURRENT_YEAR - 2}`} 
                className="w-full px-3 py-2 border rounded-lg text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">End Year (or Expected)</label>
              <input 
                name="end_year" 
                type="number" 
                min="1950" 
                max={CURRENT_YEAR + 10} 
                defaultValue={val("end_year")}
                placeholder={`e.g., ${CURRENT_YEAR + 2}`} 
                className="w-full px-3 py-2 border rounded-lg text-sm" 
              />
            </div>
          </div>
          
          <button type="submit" disabled={currentPending} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2">
            {currentPending ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "edit" ? "Update Degree" : "Save Degree"}
          </button>
        </form>
      )}

      {academics.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No academic records added yet.</p>
      ) : (
        <div className="space-y-3">
          {academics.map((acad) => (
            <div key={acad.id} className="flex items-start justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900 text-sm">{acad.degree}</p>
                <p className="text-xs text-slate-600">{acad.institution}</p>
                <p className="text-xs text-slate-400 mt-0.5">{acad.start_year || "?"} - {acad.end_year || "Present"}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(acad.id)} className="p-1.5 text-slate-400 hover:text-orange-500 transition">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(acad.id)} disabled={isPending} className="p-1.5 text-slate-400 hover:text-red-600 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

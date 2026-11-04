"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import { addProject, updateProject, deleteProject } from "@/app/actions/profile";
import { Plus, Trash2, ExternalLink, Loader2, Pencil, X } from "lucide-react";

export function ProjectsManager({ projects }: { projects: any[] }) {
  const [mode, setMode] = useState<"idle" | "add" | "edit">("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [addState, addFormAction, addPending] = useActionState(addProject, null);
  const [editState, editFormAction, editPending] = useActionState(
    (prev: any, fd: FormData) => updateProject(editingId!, prev, fd),
    null
  );

  const editingProject = projects.find(p => p.id === editingId);
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
    if (!confirm("Delete this project? This action cannot be undone.")) return;
    startTransition(async () => {
      await deleteProject(id);
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
    return editingProject?.[key] || "";
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h3 className="text-base font-semibold text-slate-900">Past Projects & Hackathons</h3>
        {mode === "idle" && (
          <button onClick={() => setMode("add")} className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Project
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
              {mode === "edit" ? "Edit Project" : "Add New Project"}
            </p>
            <button type="button" onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {currentState?.error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{currentState.error}</p>}
          {currentState?.success && <p className="text-xs text-orange-500 bg-orange-50 p-2 rounded border border-orange-200">{currentState.success}</p>}

          <input name="title" required maxLength={100} defaultValue={val("title")} placeholder="Project Title (e.g., AI Chatbot)" className="w-full px-3 py-2 border rounded-lg text-sm" />
          <input name="hackathon_name" maxLength={100} defaultValue={val("hackathon_name")} placeholder="Hackathon Name (Optional)" className="w-full px-3 py-2 border rounded-lg text-sm" />
          <textarea name="description" maxLength={500} defaultValue={val("description")} placeholder="What did you build?" className="w-full px-3 py-2 border rounded-lg text-sm" rows={2}></textarea>
          <input name="tech_stack" maxLength={150} defaultValue={val("tech_stack")} placeholder="Tech Stack (e.g., React, Python, OpenAI)" className="w-full px-3 py-2 rounded-lg text-sm border" />
          <input name="project_url" type="url" maxLength={255} defaultValue={val("project_url")} placeholder="Link to GitHub/Devpost (Optional)" className="w-full px-3 py-2 border rounded-lg text-sm" />
          
          <button type="submit" disabled={currentPending} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2">
            {currentPending ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "edit" ? "Update Project" : "Save Project"}
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No projects added yet.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="flex items-start justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900 text-sm">{proj.title}</p>
                <p className="text-xs text-orange-500 font-medium">{proj.hackathon_name}</p>
              </div>
              <div className="flex gap-1">
                {proj.project_url && <a href={proj.project_url} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-orange-500 transition"><ExternalLink className="w-4 h-4" /></a>}
                <button onClick={() => handleEdit(proj.id)} className="p-1.5 text-slate-400 hover:text-orange-500 transition">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(proj.id)} disabled={isPending} className="p-1.5 text-slate-400 hover:text-red-600 transition">
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

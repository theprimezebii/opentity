"use client";

import { useState, useActionState, useEffect } from "react";
import { Pencil, Plus, Loader2, Save, X } from "lucide-react";
import { DeleteSquadButton } from "./DeleteSquadButton";
import { addEventSquad, updateEventSquad } from "@/app/actions/teams";
import { FormMessage } from "@/components/ui/FormMessage";
import { useRouter } from "next/navigation";

export function SquadList({ squads, members, availableEvents, isLeader, teamId }: { squads: any[], members: any[], availableEvents: any[], isLeader: boolean, teamId: string }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const [createState, createAction, createPending] = useActionState(addEventSquad.bind(null, teamId), null);
  const [isCreateDirty, setIsCreateDirty] = useState(false);

  useEffect(() => {
    if (createState?.success) { setIsCreateDirty(false); router.refresh(); }
  }, [createState?.success, router]);

  return (
    <div>
      {squads.length > 0 ? (
        <div className="space-y-4 mb-6">
          {squads.map(squad => {
            const event = squad.events as any;
            const participantNames = members?.filter(m => squad.member_ids.includes(m.user_id)).map(m => m.profiles?.full_name).join(", ");
            const isEditing = editingId === squad.id;

            if (isEditing) {
              return <EditSquadForm key={squad.id} squad={squad} members={members} availableEvents={availableEvents} onCancel={() => setEditingId(null)} />;
            }

            return (
              <div key={squad.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">{squad.name || "Untitled Squad"}</p>
                  <p className="text-xs text-slate-500 mt-1">Event: <span className="font-semibold text-orange-500">{event.title}</span></p>
                  <p className="text-xs text-slate-500 mt-1">Participating: {participantNames || "None"}</p>
                </div>
                {isLeader && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingId(squad.id)} className="text-slate-400 hover:text-orange-500 transition" title="Edit Squad"><Pencil className="w-4 h-4" /></button>
                    <DeleteSquadButton squadId={squad.id} squadName={squad.name} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : <p className="text-sm text-slate-500 mb-6">No event squads created yet.</p>}

      {isLeader && (
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Create New Squad</h3>
          
          <FormMessage error={createState?.error} success={createState?.success} />

          <form action={createAction} onChange={() => setIsCreateDirty(true)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Squad Name</label>
              <input name="name" required placeholder="e.g., Alpha Squad" className="w-full px-3 py-2 border rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Event</label>
              <select name="event_id" required className="w-full px-3 py-2 border rounded-lg bg-white text-sm">
                <option value="">Select an Event...</option>
                {availableEvents?.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Participating Members:</p>
              <div className="grid grid-cols-2 gap-2">
                {members?.map(m => (
                  <label key={m.user_id} className="flex items-center gap-2 text-sm text-slate-700 bg-white p-2 rounded border border-slate-200 cursor-pointer">
                    <input type="checkbox" name="member_ids" value={m.user_id} className="w-4 h-4 text-orange-500 rounded" /> {m.profiles?.full_name}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" disabled={!isCreateDirty || createPending} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {createPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Squad
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function EditSquadForm({ squad, members, availableEvents, onCancel }: { squad: any, members: any[], availableEvents: any[], onCancel: () => void }) {
  const [state, formAction, isPending] = useActionState(
    (prev: any, fd: FormData) => updateEventSquad(squad.id, prev, fd),
    null
  );
  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState<string[]>(squad.member_ids || []);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (state?.success) { 
      router.refresh(); 
      setTimeout(() => onCancel(), 1500);
    }
  }, [state?.success, onCancel, router]);

  const toggleMember = (id: string) => {
    setIsDirty(true);
    if (selectedMembers.includes(id)) setSelectedMembers(selectedMembers.filter(m => m !== id));
    else setSelectedMembers([...selectedMembers, id]);
  };

  return (
    <form action={formAction} onChange={() => setIsDirty(true)} className="p-4 bg-white border-2 border-orange-200 rounded-lg space-y-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-sm text-orange-600">Editing Squad</h4>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
      </div>

      <FormMessage error={state?.error} success={state?.success} />

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Squad Name</label>
        <input name="name" defaultValue={squad.name} required className="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Event</label>
        <select name="event_id" defaultValue={squad.event_id} required className="w-full px-3 py-2 border rounded-lg bg-white text-sm">
          {availableEvents?.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Participating Members:</p>
        <div className="grid grid-cols-2 gap-2">
          {members?.map(m => (
            <label key={m.user_id} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 cursor-pointer">
              <input type="checkbox" name="member_ids" value={m.user_id} checked={selectedMembers.includes(m.user_id)} onChange={() => toggleMember(m.user_id)} className="w-4 h-4 text-orange-500 rounded" /> 
              {m.profiles?.full_name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" disabled={!isDirty || isPending} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Squad
        </button>
      </div>
    </form>
  );
}

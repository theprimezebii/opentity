"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteEventSquad } from "@/app/actions/teams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { showToast } from "@/components/ui/GlobalToast";

export function DeleteSquadButton({ squadId, squadName }: { squadId: string, squadName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteEventSquad(squadId);
      setIsOpen(false);
      if (res?.success) showToast(res.success, 'success');
      if (res?.error) showToast(res.error, 'error');
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-slate-400 hover:text-red-600 transition">
        <Trash2 className="w-4 h-4" />
      </button>
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Squad"
        description={`Are you sure you want to delete "${squadName}"?`}
        isPending={isPending}
        confirmText="Delete"
      />
    </>
  );
}

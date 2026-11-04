"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteTeam } from "@/app/actions/teams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { showToast } from "@/components/ui/GlobalToast";

export function DeleteTeamButton({ teamId, teamName }: { teamId: string, teamName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteTeam(teamId);
      setIsOpen(false);
      if (res?.success) showToast(res.success, 'success');
      if (res?.error) showToast(res.error, 'error');
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-2">
        <Trash2 className="w-4 h-4" /> Delete Team
      </button>
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Team"
        description={`Are you sure you want to delete "${teamName}"? All members and squads will be removed.`}
        isPending={isPending}
        confirmText="Delete Team"
      />
    </>
  );
}

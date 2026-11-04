"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteEvent } from "@/app/actions/events";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteEvent(eventId);
      setIsOpen(false);
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-red-600 transition" 
        title="Delete Event"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        isPending={isPending}
        confirmText="Delete"
      />
    </>
  );
}

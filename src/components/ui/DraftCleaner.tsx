"use client";

import { useEffect } from "react";

export function DraftCleaner({ type, id }: { type: "create" | "edit", id?: string }) {
  useEffect(() => {
    if (type === "create") {
      localStorage.removeItem("opentity_draft_create");
    } else if (type === "edit" && id) {
      localStorage.removeItem(`opentity_draft_edit_${id}`);
    }
  }, [type, id]);

  return null;
}

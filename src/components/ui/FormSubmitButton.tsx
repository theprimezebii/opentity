"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface FormSubmitButtonProps {
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  iconOnly?: boolean;
}

/**
 * Universal submit button that auto-detects form pending state.
 * Place inside any <form> to automatically show a spinner during submission.
 * - iconOnly: only shows the spinner (hides children) for compact icon buttons.
 */
export function FormSubmitButton({ 
  children, 
  loadingText = "Please wait...", 
  className = "",
  disabled = false,
  iconOnly = false,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending || disabled} 
      className={`${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {!iconOnly && <span>{loadingText}</span>}
        </>
      ) : children}
    </button>
  );
}

"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isPending?: boolean;
  confirmText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isPending = false,
  confirmText = "Delete",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Force left alignment globally inside this container */}
        <div className="p-6 text-left">
          
          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
          
          {/* Description - NO padding, perfectly left-aligned with the icon */}
          <p className="text-sm text-slate-500 leading-relaxed text-left">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            disabled={isPending}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
            ) : (
              confirmText
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}

"use client";

import { CheckCircle2, Circle } from "lucide-react";

const requirements = [
  { id: "length", label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { id: "letter", label: "Contains a letter (a-z, A-Z)", test: (p: string) => /[a-zA-Z]/.test(p) },
  { id: "number", label: "Contains a number (0-9)", test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "Contains a special character (!@#$%...)", test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <div className="mt-2 space-y-1">
      {requirements.map((req) => {
        const passed = req.test(password);
        return (
          <div key={req.id} className="flex items-center gap-2 text-xs">
            {passed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            )}
            <span className={passed ? "text-orange-500 font-medium" : "text-slate-500"}>
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function isPasswordValid(password: string): boolean {
  return requirements.every((req) => req.test(password));
}

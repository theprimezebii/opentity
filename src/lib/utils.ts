import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
}

// SMART STATUS CALCULATOR (Separated)
export function getEventStatus(event: any) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const regStart = event.registration_start_date ? new Date(event.registration_start_date) : new Date(event.created_at);
  regStart.setHours(0, 0, 0, 0);
  
  const regEnd = new Date(event.registration_deadline);
  regEnd.setHours(0, 0, 0, 0);

  const start = new Date(event.start_date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(event.end_date);
  end.setHours(0, 0, 0, 0);

  // 1. REGISTRATION STATUS
  let regStatus = { label: "", color: "" };
  
  if (now > regEnd) {
    regStatus = { label: "Registration Closed", color: "bg-red-50 text-red-700 border-red-200" };
  } else {
    const twoDaysBefore = new Date(regEnd);
    twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
    
    if (now >= twoDaysBefore && now <= regEnd) {
      regStatus = { label: "Registration Closing Soon", color: "bg-orange-50 text-orange-700 border-orange-200" };
    } else if (now < regStart) {
      regStatus = { label: "Registration Opens Soon", color: "bg-purple-50 text-purple-700 border-purple-200" };
    } else {
      regStatus = { label: "Registration Open", color: "bg-blue-50 text-blue-700 border-blue-200" };
    }
  }

  // 2. EVENT STATUS
  let eventStatus = { label: "", color: "" };
  
  if (now > end) {
    eventStatus = { label: "Event Completed", color: "bg-slate-100 text-slate-600 border-slate-200" };
  } else if (now >= start && now <= end) {
    eventStatus = { label: "Event Ongoing", color: "bg-green-50 text-green-700 border-green-200" };
  } else {
    eventStatus = { label: "Event Upcoming", color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
  }

  return { regStatus, eventStatus };
}

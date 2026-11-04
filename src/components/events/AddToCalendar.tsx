"use client";

import { CalendarPlus } from "lucide-react";

export function AddToCalendar({ event }: { event: any }) {
  const generateICS = () => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const start = formatDate(event.start_date);
    const end = event.end_date 
      ? formatDate(event.end_date) 
      : formatDate(new Date(new Date(event.start_date).getTime() + 2 * 60 * 60 * 1000).toISOString());

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Opentity//Event//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@opentity.com`,
      `DTSTAMP:${formatDate(new Date().toISOString())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description ? event.description.replace(/(<([^>]+)>)/gi, "").slice(0, 200) + "..." : "Join this event on Opentity!"}`,
      `LOCATION:${event.location || event.city || "Online"}`,
      `URL:${window.location.href}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={generateICS}
      className="flex items-center justify-center gap-2 w-full bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition shadow-sm border border-slate-800 dark:border-slate-700"
    >
      <CalendarPlus className="w-5 h-5" />
      Add to Calendar
    </button>
  );
}

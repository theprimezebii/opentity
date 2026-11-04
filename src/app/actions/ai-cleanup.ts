"use server";

import Groq from "groq-sdk";
import { EVENT_CATEGORIES, EVENT_FORMATS, EVENT_TYPES, GLOBAL_CITIES } from "@/lib/constants";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export interface CleanedEvent {
  title: string;
  description: string;
  category: string;
  format: string;
  city: string | null;
  event_type: string;
  error?: string;
}

export async function cleanupEventData(raw: {
  title: string;
  description: string;
  category?: string;
  format?: string;
  city?: string;
  event_type?: string;
}): Promise<CleanedEvent> {
  try {
    const prompt = `You are a data cleaning assistant for a Pakistani tech events platform.

Given this raw event data:
Title: ${raw.title}
Description: ${raw.description}
Category (raw): ${raw.category || "unknown"}
Format (raw): ${raw.format || "unknown"}
City (raw): ${raw.city || "unknown"}
Event Type (raw): ${raw.event_type || "unknown"}

Return ONLY valid JSON with these EXACT values:
{
  "title": "cleaned title (proper case, no ALL CAPS, no excessive punctuation)",
  "description": "2-3 sentence summary, professional, no emojis",
  "category": "must be exactly one of: ${EVENT_CATEGORIES.join(", ")}",
  "format": "must be exactly one of: ${EVENT_FORMATS.join(", ")}",
  "city": "must be exactly one of: ${GLOBAL_CITIES.join(", ")} or null",
  "event_type": "must be exactly one of: ${EVENT_TYPES.join(", ")}"
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content) as CleanedEvent;

    // Safety validation
    if (!EVENT_CATEGORIES.includes(parsed.category as any)) parsed.category = "Other";
    if (!EVENT_FORMATS.includes(parsed.format as any)) parsed.format = "In-person";
    if (!EVENT_TYPES.includes(parsed.event_type as any)) parsed.event_type = "Other";
    if (parsed.city && !GLOBAL_CITIES.includes(parsed.city as any)) parsed.city = null;

    return parsed;
  } catch (err) {
    console.error("AI cleanup error:", err);
    return {
      title: raw.title,
      description: raw.description,
      category: "Other",
      format: "In-person",
      city: null,
      event_type: "Other",
      error: "AI cleanup failed, using raw data.",
    };
  }
}

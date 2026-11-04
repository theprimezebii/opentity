"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ParsedEvent {
  title?: string;
  description?: string;
  category?: string;
  format?: string;
  city?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  prize_pool?: string;
  organizer?: string;
  registration_url?: string;
  event_type?: string;
  image_url?: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are an event data extractor. Analyze the event poster/flyer and extract structured information.

Return ONLY a valid JSON object with these fields (omit fields you cannot determine):
{
  "title": "event name",
  "description": "a 2-3 sentence description",
  "category": "one of: AI, Web Development, Mobile, Data Science, Cybersecurity, Blockchain, IoT, Game Development, Other",
  "format": "one of: Online, In-person, Hybrid",
  "city": "city name (e.g., Karachi, Lahore, Islamabad) or null",
  "location": "venue name or address or null",
  "start_date": "YYYY-MM-DD or null",
  "end_date": "YYYY-MM-DD or null",
  "registration_deadline": "YYYY-MM-DD or null",
  "prize_pool": "prize amount with currency (e.g., PKR 500,000) or null",
  "organizer": "organizing body (e.g., NUST SEECS) or null",
  "registration_url": "URL if visible or null",
  "event_type": "one of: Hackathon, Webinar, Workshop, Competition, Conference, Bootcamp, Other"
}

Do NOT include any text outside the JSON. If the image is not an event poster, return {"error": "Not an event poster"}.`;

export async function parseEventPoster(formData: FormData): Promise<ParsedEvent> {
  try {
    const file = formData.get("poster") as File;
    if (!file || file.size === 0) return { error: "No image provided." };
    if (!file.type.startsWith("image/")) return { error: "File must be an image." };
    if (file.size > 10 * 1024 * 1024) return { error: "Image too large. Max 10MB." };

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ]);

    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned) as ParsedEvent;

    if (parsed.error) return { error: parsed.error };
    return parsed;
  } catch (err: any) {
    console.error("AI parse error:", err);
    return { error: "Failed to analyze the image. Please try again or fill the form manually." };
  }
}

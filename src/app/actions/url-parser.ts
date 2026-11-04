"use server";

import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ParsedEvent } from "./ai-parser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function parseEventUrl(url: string): Promise<ParsedEvent> {
  try {
    if (!url || !url.startsWith("http")) {
      return { error: "Please enter a valid URL starting with http or https." };
    }

    // 1. Fetch the webpage
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return { error: `Failed to load the page (Status: ${response.status}). Please check the URL.` };
    }

    const html = await response.text();

    // 2. Extract clean text and og:image using Cheerio
    const $ = cheerio.load(html);
    const ogImage = $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content");
    
    $("script, style, nav, footer, header, iframe, svg, noscript").remove();
    const pageText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 25000); // Limit to ~25k chars for Gemini

    if (pageText.length < 50) {
      return { error: "Could not extract enough text from this URL. Please fill the form manually." };
    }

    // 3. Send to Gemini for extraction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are an event data extractor. Analyze the following webpage text and extract structured information about the event.

Return ONLY a valid JSON object with these fields (omit fields you cannot determine):
{
  "title": "event name",
  "description": "a 2-3 sentence description",
  "category": "one of: AI, Web Development, Mobile, Data Science, Cybersecurity, Blockchain, IoT, Game Development, Other",
  "format": "one of: Online, In-person, Hybrid",
  "city": "city name (e.g., Karachi, Lahore, Islamabad, Dubai) or null",
  "location": "venue name or address or null",
  "start_date": "YYYY-MM-DD or null",
  "end_date": "YYYY-MM-DD or null",
  "registration_deadline": "YYYY-MM-DD or null",
  "prize_pool": "prize amount with currency (e.g., PKR 500,000) or null",
  "organizer": "organizing body (e.g., NUST SEECS) or null",
  "registration_url": "the original URL provided",
  "event_type": "one of: Hackathon, Webinar, Workshop, Competition, Conference, Bootcamp, Other"
}

Do NOT include any text outside the JSON.

Webpage Text:
${pageText}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const parsed = JSON.parse(cleaned) as ParsedEvent;
    parsed.registration_url = url;
    if (ogImage) parsed.image_url = ogImage.startsWith("http") ? ogImage : new URL(ogImage, url).href;

    return parsed;
  } catch (err: any) {
    console.error("URL parse error:", err);
    return { error: "Failed to analyze the URL. The site might be blocking bots, or the page is not an event page." };
  }
}

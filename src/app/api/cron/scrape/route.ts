import { NextResponse } from "next/server";
import { cleanupEventData } from "@/app/actions/ai-cleanup";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const BRIGHT_DATA_TOKEN = process.env.BRIGHT_DATA_TOKEN;
    if (!BRIGHT_DATA_TOKEN) {
      return NextResponse.json({ error: "BRIGHT_DATA_TOKEN not configured" }, { status: 500 });
    }

    // Trigger Devpost scraper
    const scrapeRes = await fetch("https://api.brightdata.com/datasets/v3/trigger", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BRIGHT_DATA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataset_id: "gd_lgv2dvz92m4l6e8jf",
        include_errors: true,
      }),
    });

    if (!scrapeRes.ok) {
      return NextResponse.json({ error: "Scrape failed", details: await scrapeRes.text() }, { status: 500 });
    }

    return NextResponse.json({ status: "triggered", timestamp: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

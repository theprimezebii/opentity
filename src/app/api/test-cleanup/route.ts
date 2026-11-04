import { NextResponse } from "next/server";
import { cleanupEventData } from "@/app/actions/ai-cleanup";

export async function GET() {
  const result = await cleanupEventData({
    title: "NUST AI HACKATHON 2026!!! BEST EVER!!!",
    description: "Join us for a 48hr hack where we build AI stuffs. Great prizes!!!",
    category: "artificial intelligence",
    format: "physical",
    city: "islamabad",
    event_type: "hack",
  });
  return NextResponse.json(result);
}

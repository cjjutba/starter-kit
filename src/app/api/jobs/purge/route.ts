import { NextResponse } from "next/server";
import { purgeRateLimits } from "@/lib/guard/rate-limit";
import { purgeMailLog } from "@/lib/mail/purge";

// The example cron job. Vercel calls it on the schedule in vercel.ts and
// sends CRON_SECRET as a bearer token. Anything else gets a 401. Mail older
// than thirty days goes, and abuse counters whose hour is a day gone.

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const mail = await purgeMailLog(30);
  const counters = await purgeRateLimits(60 * 60 * 24);
  return NextResponse.json({ mail, counters });
}

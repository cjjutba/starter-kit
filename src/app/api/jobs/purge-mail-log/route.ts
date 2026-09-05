import { NextResponse } from "next/server";
import { purgeMailLog } from "@/lib/mail/purge";

// The example cron job. Vercel calls it on the schedule in vercel.ts and
// sends CRON_SECRET as a bearer token. Anything else gets a 401.

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const deleted = await purgeMailLog(30);
  return NextResponse.json({ deleted });
}

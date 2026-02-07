import { NextResponse } from "next/server";
import { getStats } from "@/lib/agent-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

/**
 * GET /api/stats
 *
 * Returns aggregate stats across all tracked agents.
 */
export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[api/stats] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats", detail: String(err) },
      { status: 500 },
    );
  }
}

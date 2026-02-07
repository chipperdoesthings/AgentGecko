import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { refreshAgents, forceInvalidate } from "@/lib/agent-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const bodySchema = z
  .object({
    force: z.boolean().optional().default(false),
  })
  .optional()
  .default({ force: false });

/**
 * POST /api/refresh
 *
 * Triggers a full refresh of agent data from Nad.fun.
 * Optional body: { force: true } to invalidate cache first.
 *
 * Returns the refresh result including duration and any errors.
 */
export async function POST(request: NextRequest) {
  try {
    let force = false;
    try {
      const body = await request.json();
      const parsed = bodySchema.safeParse(body);
      if (parsed.success) {
        force = parsed.data.force;
      }
    } catch {
      // no body is fine — use defaults
    }

    if (force) {
      forceInvalidate();
    }

    const result = await refreshAgents();

    return NextResponse.json({
      success: true,
      agentCount: result.agents.length,
      errors: result.errors,
      durationMs: result.duration,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[api/refresh] Error:", err);
    return NextResponse.json(
      { error: "Refresh failed", detail: String(err) },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAgentDetail } from "@/lib/agent-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/agent/:address
 *
 * Returns full agent detail including trades, score breakdown,
 * strengths/weaknesses, and risk level.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  try {
    const { address } = await params;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: "Invalid address format. Expected 0x + 40 hex chars." },
        { status: 400 },
      );
    }

    const agent = await getAgentDetail(address);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found", address },
        { status: 404 },
      );
    }

    return NextResponse.json({ agent });
  } catch (err) {
    console.error("[api/agent] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch agent detail", detail: String(err) },
      { status: 500 },
    );
  }
}

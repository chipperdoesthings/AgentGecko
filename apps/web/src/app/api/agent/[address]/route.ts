import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAgentDetail } from "@/lib/agent-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format (expected 0x + 40 hex chars)");

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
    const parsed = addressSchema.safeParse(address);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid address format" },
        { status: 400 },
      );
    }

    const agent = await getAgentDetail(parsed.data);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found", address: parsed.data },
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

import { NextRequest, NextResponse } from "next/server";
import { getAgents, searchAgents } from "@/lib/agent-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "score";
    const order = searchParams.get("order") || "desc";
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let agents = q || category !== "all"
      ? await searchAgents(q, category)
      : await getAgents();

    // Sort
    const sortKey = sort as keyof typeof agents[0];
    if (agents.length > 0 && sortKey in agents[0]) {
      agents = [...agents].sort((a, b) => {
        const av = a[sortKey] as number;
        const bv = b[sortKey] as number;
        return order === "asc" ? av - bv : bv - av;
      });
    }

    const total = agents.length;
    const paginated = agents.slice(offset, offset + limit);

    return NextResponse.json({
      agents: paginated,
      total,
      offset,
      limit,
      hasMore: offset + limit < total,
    });
  } catch (err) {
    console.error("[api/agents] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch agents", detail: String(err) },
      { status: 500 },
    );
  }
}

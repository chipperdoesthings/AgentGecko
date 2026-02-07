import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAgents, searchAgents } from "@/lib/agent-service";
import type { SortField } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30; // Allow up to 30s for initial data fetch

const querySchema = z.object({
  q: z.string().max(200).optional().default(""),
  category: z.string().max(50).optional().default("all"),
  sort: z
    .enum(["rank", "name", "score", "marketCap", "price", "priceChange24h", "volume24h", "holderCount"])
    .optional()
    .default("score"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = querySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { q, category, sort, order, limit, offset } = parsed.data;

    let agents =
      q || category !== "all"
        ? await searchAgents(q, category)
        : await getAgents();

    // Sort
    const sortKey = sort as SortField;
    if (agents.length > 0 && sortKey in agents[0]) {
      agents = [...agents].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === "string" && typeof bv === "string") {
          return order === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        }
        return order === "asc"
          ? (av as number) - (bv as number)
          : (bv as number) - (av as number);
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

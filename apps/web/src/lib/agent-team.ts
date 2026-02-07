/**
 * Agent Team Orchestrator — Powered by Opus 4.6
 * 
 * Uses the "agent teams" feature to coordinate multiple specialized AI agents:
 * - Scout Agent: Discovers new AI agent tokens
 * - Analyst Agent: Scores and categorizes agents
 * - Reporter Agent: Generates insights and summaries
 * 
 * The Coordinator dispatches tasks to agents in parallel,
 * merges results, and returns a unified output.
 */

import type { Agent } from "@/types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

interface AgentTeamConfig {
  apiKey: string;
  model?: string;
}

interface ScoutResult {
  candidates: Array<{
    address: string;
    name: string;
    symbol: string;
    description: string;
    isAgent: boolean;
    confidence: number;
  }>;
}

interface AnalystResult {
  analysis: Array<{
    address: string;
    category: string;
    riskLevel: "low" | "medium" | "high";
    strengths: string[];
    weaknesses: string[];
    summary: string;
  }>;
}

interface ReporterResult {
  headline: string;
  summary: string;
  trending: string[];
  alerts: string[];
}

// Call Claude API with a specific agent persona
async function callAgent(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  model = "claude-opus-4-6"
): Promise<string> {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Agent API error: ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// Scout Agent — discovers potential AI agent tokens
export async function runScoutAgent(
  apiKey: string,
  tokenData: Array<{ name: string; symbol: string; description: string; address: string }>
): Promise<ScoutResult> {
  const systemPrompt = `You are the Scout Agent for AgentGecko, an AI agent discovery platform on the Monad blockchain.

Your job is to analyze token listings and determine which ones are AI/autonomous trading agents.

For each token, assess:
1. Is this an AI agent? (not just a meme coin with "AI" in the name)
2. What's your confidence level? (0.0 to 1.0)
3. What type of agent is it?

Respond ONLY in valid JSON format:
{
  "candidates": [
    {
      "address": "0x...",
      "name": "...",
      "symbol": "...",
      "description": "...",
      "isAgent": true/false,
      "confidence": 0.0-1.0
    }
  ]
}`;

  const userMessage = `Analyze these tokens and identify which are AI agents:\n\n${JSON.stringify(tokenData, null, 2)}`;

  try {
    const response = await callAgent(apiKey, systemPrompt, userMessage);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Scout agent error:", e);
  }

  // Fallback: use keyword detection
  return {
    candidates: tokenData.map((t) => ({
      ...t,
      isAgent: /agent|bot|ai|trading|auto/i.test(t.description),
      confidence: /agent|bot|ai|trading|auto/i.test(t.description) ? 0.6 : 0.1,
    })),
  };
}

// Analyst Agent — deep analysis of agent tokens
export async function runAnalystAgent(
  apiKey: string,
  agents: Array<{
    name: string;
    symbol: string;
    description: string;
    address: string;
    volume24h: number;
    holderCount: number;
    priceChange24h: number;
    marketCap: number;
  }>
): Promise<AnalystResult> {
  const systemPrompt = `You are the Analyst Agent for AgentGecko. You perform deep analysis on AI trading agents.

For each agent, determine:
1. Category: meme_trader | defi | sniper | copy_trader | arbitrage | social | analyst | trading | other
2. Risk level: low | medium | high
3. Key strengths (1-3 bullet points)
4. Key weaknesses (1-3 bullet points)
5. One-sentence summary

Consider: trading volume, holder count, price action, description quality, claimed functionality.

Respond ONLY in valid JSON:
{
  "analysis": [
    {
      "address": "0x...",
      "category": "...",
      "riskLevel": "low|medium|high",
      "strengths": ["..."],
      "weaknesses": ["..."],
      "summary": "..."
    }
  ]
}`;

  const userMessage = `Analyze these AI agents:\n\n${JSON.stringify(agents, null, 2)}`;

  try {
    const response = await callAgent(apiKey, systemPrompt, userMessage);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Analyst agent error:", e);
  }

  return { analysis: [] };
}

// Reporter Agent — generates market insights
export async function runReporterAgent(
  apiKey: string,
  agentData: Agent[]
): Promise<ReporterResult> {
  const systemPrompt = `You are the Reporter Agent for AgentGecko. You generate market insights about AI trading agents on Monad.

Given agent data, produce:
1. A catchy headline about the current state of the agent market
2. A 2-3 sentence market summary
3. Top 3 trending agents (by name)
4. Any alerts (unusual activity, big movers, new entries)

Respond ONLY in valid JSON:
{
  "headline": "...",
  "summary": "...",
  "trending": ["agent1", "agent2", "agent3"],
  "alerts": ["alert1", "alert2"]
}`;

  const summary = agentData.map((a) => ({
    name: a.name,
    symbol: a.symbol,
    category: a.category,
    score: a.score,
    volume24h: a.volume24h,
    priceChange24h: a.priceChange24h,
    holderCount: a.holderCount,
  }));

  const userMessage = `Generate a market report for these AI agents:\n\n${JSON.stringify(summary, null, 2)}`;

  try {
    const response = await callAgent(apiKey, systemPrompt, userMessage);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Reporter agent error:", e);
  }

  return {
    headline: "AI Agent Market on Monad",
    summary: "The agent economy continues to grow on Monad's high-performance blockchain.",
    trending: agentData.slice(0, 3).map((a) => a.name),
    alerts: [],
  };
}

// Coordinator — orchestrates all agents in parallel
export async function runAgentTeam(
  config: AgentTeamConfig,
  tokenData: Array<{
    name: string;
    symbol: string;
    description: string;
    address: string;
    volume24h?: number;
    holderCount?: number;
    priceChange24h?: number;
    marketCap?: number;
  }>,
  existingAgents: Agent[] = []
): Promise<{
  scout: ScoutResult;
  analyst: AnalystResult;
  reporter: ReporterResult;
}> {
  // Run Scout and Analyst in parallel (Reporter needs existing data)
  const [scoutResult, analystResult] = await Promise.all([
    runScoutAgent(config.apiKey, tokenData),
    runAnalystAgent(
      config.apiKey,
      tokenData.map((t) => ({
        ...t,
        volume24h: t.volume24h || 0,
        holderCount: t.holderCount || 0,
        priceChange24h: t.priceChange24h || 0,
        marketCap: t.marketCap || 0,
      }))
    ),
  ]);

  // Reporter runs after with combined data
  const reporterResult = await runReporterAgent(config.apiKey, existingAgents);

  return {
    scout: scoutResult,
    analyst: analystResult,
    reporter: reporterResult,
  };
}

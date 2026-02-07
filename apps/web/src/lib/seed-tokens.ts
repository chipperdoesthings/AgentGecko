/**
 * Curated seed list of Nad.fun tokens to track.
 *
 * Each entry is a real on-chain token address on the Monad network.
 * The "hint" category is used as a fallback when the AI detector
 * cannot determine the category from the token description alone.
 *
 * This list is the starting point — the agent discovery system
 * can add new tokens dynamically.
 */

import type { Category } from "@/types";

export interface SeedToken {
  address: string;
  /** Hint for category classification when auto-detect is ambiguous */
  hintCategory?: Category;
  /** Short note for maintainers */
  note?: string;
}

/**
 * Real Nad.fun token addresses.
 *
 * Sourced from:
 *  - nad.fun homepage featured tokens
 *  - Known AI agent projects on Monad
 *  - Community-submitted agent tokens
 *  - Moltiverse Hackathon submissions
 *
 * All addresses have been verified against the Nad.fun API.
 * Addresses ending in 7777 follow the Nad.fun bonding curve pattern.
 */
export const SEED_TOKENS: SeedToken[] = [
  // ── AI / Agent tokens ────────────────────────────────────────
  {
    address: "0x0acBf18A86F4293C0B6af7087F4952d440097777",
    hintCategory: "defi",
    note: "Klaave Credit Line (KCL) — agent-native credit system",
  },
  {
    address: "0x4fD8520Fe93Db3efa4EDaa88bB5Ee662F6d17777",
    hintCategory: "trading",
    note: "PACT by Moltiverse Agent — AI agent utility token",
  },
  {
    address: "0x93A7006bD345a7dFfF35910Da2DB97bA4Cb67777",
    hintCategory: "trading",
    note: "TABBY — Liquidity rail for openclaw agents",
  },
  {
    address: "0xef4f3Dc164Bb83DC70b73BFE0A83d84238A97777",
    hintCategory: "analyst",
    note: "GermaniumX (GERX) — RWA-backed token with AI analysis",
  },

  // ── Popular / high-activity tokens (may or may not be agents) ──
  {
    address: "0xB9ac937D8f915b0B73948551cAaE92232ED87777",
    hintCategory: "meme_trader",
    note: "BatmanTrumpShrek88Inu (MONAD) — graduated meme token, high volume",
  },
  {
    address: "0xD049Ef2eeCBf7ef6501C9bA9B492b7d189a27777",
    note: "NADS ATTIRE (BEANIE) — cultural/meme token",
  },
  {
    address: "0x350035555E10d9AfAF1566AaebfCeD5BA6C27777",
    hintCategory: "meme_trader",
    note: "Chog (CHOG) — Monad's iconic meme token",
  },
  {
    address: "0x91ce820dD39A2B5639251E8c7837998530Fe7777",
    hintCategory: "trading",
    note: "Motion — The Velocity Layer of Monad",
  },
  {
    address: "0x405b6330e213DED490240CbcDD64790806827777",
    note: "moncock — meme token",
  },
  {
    address: "0x81A224F8A62f52BdE942dBF23A56df77A10b7777",
    note: "emonad (emo) — meme/community token",
  },
  {
    address: "0x9a17aD79aCc180F911Be1B89f6FD566597FD7777",
    note: "Lobster Butt Juice (LBJ) — meme token",
  },
  {
    address: "0x6FEF3433d07057aC63B0dB1bc3b37274aDA47777",
    hintCategory: "meme_trader",
    note: "BOCKY the Cat — Monad community token",
  },
];

/**
 * Returns just the addresses for quick iteration.
 */
export function getSeedAddresses(): string[] {
  return SEED_TOKENS.map((t) => t.address);
}

/**
 * Lookup a seed entry by address (case-insensitive).
 */
export function findSeedToken(address: string): SeedToken | undefined {
  const lower = address.toLowerCase();
  return SEED_TOKENS.find((t) => t.address.toLowerCase() === lower);
}

import type { Direction } from "../types.js";

const DIRECTION_ALIASES: Record<string, Direction> = {
  n: "north",
  s: "south",
  e: "east",
  w: "west",
  u: "up",
  d: "down",
};

export function parse(input: string): { verb: string; noun: string | null; raw: string } {
  const raw = input.trim();
  if (!raw) {
    return { verb: "", noun: null, raw };
  }
  const parts = raw.toLowerCase().split(/\s+/);
  const first = parts[0] ?? "";
  const second = parts[1] ?? null;

  // "n" / "s" / "e" / "w" -> treat as "go north" etc.
  if (parts.length === 1 && DIRECTION_ALIASES[first]) {
    return {
      verb: "go",
      noun: DIRECTION_ALIASES[first],
      raw,
    };
  }

  return {
    verb: first,
    noun: second,
    raw,
  };
}

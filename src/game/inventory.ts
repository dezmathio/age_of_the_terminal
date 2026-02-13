import type { GameState, SlotId } from "../types.js";
import { getItem } from "./world.js";

export function hasItem(state: GameState, itemId: string): boolean {
  return state.inventory.has(itemId);
}

export function addItem(state: GameState, itemId: string): void {
  state.inventory.add(itemId);
}

export function removeItem(state: GameState, itemId: string): boolean {
  return state.inventory.delete(itemId);
}

export function equip(state: GameState, itemId: string, slot: SlotId): boolean {
  const def = getItem(itemId);
  if (!def || !state.inventory.has(itemId)) return false;
  if (def.slot && def.slot !== slot) return false;
  state.equipped.set(slot, itemId);
  return true;
}

export function unequip(state: GameState, slot: SlotId): string | null {
  const itemId = state.equipped.get(slot) ?? null;
  if (itemId) state.equipped.delete(slot);
  return itemId;
}

export function getEquipped(state: GameState, slot: SlotId): string | null {
  return state.equipped.get(slot) ?? null;
}

export function hasLight(state: GameState): boolean {
  const lightId = state.equipped.get("light");
  return lightId != null;
}

export function formatInventory(state: GameState): string {
  const lines: string[] = [];
  if (state.inventory.size === 0) {
    return "You carry nothing.";
  }
  const bag = Array.from(state.inventory)
    .map((id) => getItem(id)?.name ?? id)
    .join(", ");
  lines.push(`You carry: ${bag}.`);
  if (state.equipped.size > 0) {
    const slots: string[] = [];
    state.equipped.forEach((itemId, slot) => {
      const name = getItem(itemId)?.name ?? itemId;
      slots.push(`${slot} → ${name}`);
    });
    lines.push(`Wielded: ${slots.join(", ")}`);
  }
  return lines.join("\n");
}

import type { GameState, Direction, RoomId } from "../types.js";
import { getRoom, getRoomExits, getItem, getMaxScore } from "./world.js";
import * as inv from "./inventory.js";
import { ROOM_DIVIDER } from "./ascii.js";

const DIRECTION_WORDS: Set<string> = new Set([
  "north",
  "south",
  "east",
  "west",
  "up",
  "down",
  "n",
  "s",
  "e",
  "w",
  "u",
  "d",
]);

const SANCTUM_DOOR_FLAG = "sanctum_door_open";

function canSeeInRoom(state: GameState, roomId: RoomId): boolean {
  const room = getRoom(roomId);
  if (!room) return true;
  if (!room.dark) return true;
  return inv.hasLight(state);
}

function describeRoom(state: GameState, roomId: RoomId): string {
  const room = getRoom(roomId);
  if (!room) return "You are nowhere.";
  const dark = room.dark && !inv.hasLight(state);
  const lines: string[] = [ROOM_DIVIDER, room.name, ROOM_DIVIDER, ""];
  if (dark) {
    lines.push("It is too dark to see. Light a torch or find another source of light.");
    return lines.join("\n");
  }
  lines.push(room.description);
  lines.push("");
  if (room.items.length > 0) {
    const itemNames = room.items
      .map((id) => getItem(id)?.name ?? id)
      .join(", ");
    lines.push(`You see: ${itemNames}.`);
    lines.push("");
  }
  const exits = getRoomExits(room);
  if (exits.length > 0) {
    lines.push(`Exits: ${exits.join(", ")}.`);
  }
  return lines.join("\n");
}

function tryGo(state: GameState, dir: string): string {
  const room = getRoom(state.currentRoomId);
  if (!room) return "You are nowhere.";
  const dirNorm =
    dir === "n"
      ? "north"
      : dir === "s"
        ? "south"
        : dir === "e"
          ? "east"
          : dir === "w"
            ? "west"
            : dir === "u"
              ? "up"
              : dir === "d"
                ? "down"
                : dir;
  const nextId = room.exits[dirNorm as Direction];
  if (!nextId) return `You cannot go ${dirNorm}.`;
  if (nextId === "sanctum" && room.id === "hall" && !state.globalFlags.has(SANCTUM_DOOR_FLAG)) {
    return "The door to the north is locked. You need a key.";
  }
  state.currentRoomId = nextId;
  return describeRoom(state, state.currentRoomId);
}

function tryTake(state: GameState, noun: string): string {
  const room = getRoom(state.currentRoomId);
  if (!room) return "You are nowhere.";
  if (room.dark && !inv.hasLight(state)) return "It is too dark to see.";
  const id = resolveItemId(noun, room.items);
  if (!id) return `You don't see "${noun}" here.`;
  if (state.inventory.has(id)) return `You already have the ${getItem(id)?.name ?? id}.`;
  state.inventory.add(id);
  state.score += 2;
  const idx = room.items.indexOf(id);
  if (idx !== -1) room.items.splice(idx, 1);
  if (state.currentRoomId === "sanctum" && id === "jewel") {
    state.won = true;
    state.gameOver = true;
    state.score += 3;
  }
  return `Taken.`;
}

function resolveItemId(noun: string, itemIds: string[]): string | null {
  const lower = noun.toLowerCase().replace(/\s+/g, "_");
  for (const id of itemIds) {
    const def = getItem(id);
    if (!def) continue;
    if (id === lower || def.name.toLowerCase() === noun.toLowerCase()) return id;
    if (def.name.toLowerCase().replace(/\s+/g, "_").includes(lower)) return id;
  }
  return null;
}

function tryDrop(state: GameState, noun: string): string {
  const room = getRoom(state.currentRoomId);
  if (!room) return "You are nowhere.";
  const id = resolveItemIdFromInventory(state, noun);
  if (!id) return `You don't have "${noun}".`;
  inv.removeItem(state, id);
  room.items.push(id);
  return `Dropped.`;
}

function resolveItemIdFromInventory(state: GameState, noun: string): string | null {
  const lower = noun.toLowerCase().replace(/\s+/g, "_");
  for (const id of state.inventory) {
    const def = getItem(id);
    if (!def) continue;
    if (id === lower || def.name.toLowerCase() === noun.toLowerCase()) return id;
    if (def.name.toLowerCase().includes(noun.toLowerCase())) return id;
  }
  return null;
}

function tryExamine(state: GameState, noun: string): string {
  const room = getRoom(state.currentRoomId);
  if (!room) return "You are nowhere.";
  const inRoom = room.dark && !inv.hasLight(state) ? null : resolveItemId(noun, room.items);
  const inInv = resolveItemIdFromInventory(state, noun);
  const id = inRoom ?? inInv;
  if (!id) return `You don't see "${noun}" here.`;
  const def = getItem(id);
  return def?.description ?? "You see nothing special.";
}

function tryOpen(state: GameState, noun: string): string {
  if (!noun || !noun.toLowerCase().includes("door")) return "Open what?";
  const room = getRoom(state.currentRoomId);
  if (!room || room.id !== "hall") return "There is no door to open here.";
  if (state.globalFlags.has(SANCTUM_DOOR_FLAG)) return "The door is already open.";
  if (!inv.hasItem(state, "brass_key")) return "You don't have the key.";
  state.globalFlags.add(SANCTUM_DOOR_FLAG);
  state.score += 3;
  return "You unlock the heavy door with the brass key. It swings open.";
}

function tryWield(state: GameState, noun: string): string {
  const id = resolveItemIdFromInventory(state, noun);
  if (!id) return `You don't have "${noun}".`;
  const def = getItem(id);
  if (!def) return "You can't wield that.";
  const slot = def.slot === "weapon" ? "weapon" : def.slot === "light" ? "light" : null;
  if (!slot) return "You can't wield that.";
  inv.equip(state, id, slot);
  return `You ${slot === "weapon" ? "wield" : "light"} the ${def.name}.`;
}

export function runCommand(
  state: GameState,
  verb: string,
  noun: string | null
): { message: string; state: GameState } {
  const v = verb.toLowerCase();
  const n = (noun ?? "").trim() || null;

  if (v === "go" && n && DIRECTION_WORDS.has(n)) {
    return { message: tryGo(state, n), state };
  }
  if (v === "n" || v === "s" || v === "e" || v === "w" || v === "u" || v === "d") {
    return { message: tryGo(state, v), state };
  }
  if (v === "take" || v === "get") {
    if (!n) return { message: "Take what?", state };
    return { message: tryTake(state, n), state };
  }
  if (v === "drop") {
    if (!n) return { message: "Drop what?", state };
    return { message: tryDrop(state, n), state };
  }
  if (v === "examine" || v === "x") {
    if (!n) return { message: "Examine what?", state };
    return { message: tryExamine(state, n), state };
  }
  if (v === "inventory" || v === "i") {
    return { message: inv.formatInventory(state), state };
  }
  if (v === "open") {
    return { message: tryOpen(state, n ?? ""), state };
  }
  if (v === "wield" || v === "wear" || v === "light") {
    if (!n) return { message: "Wield what?", state };
    return { message: tryWield(state, n), state };
  }
  if (v === "look" || v === "l") {
    return { message: describeRoom(state, state.currentRoomId), state };
  }
  if (v === "score") {
    return {
      message: `Your score: ${state.score} / ${getMaxScore()}.`,
      state,
    };
  }
  if (v === "") {
    return { message: "", state };
  }
  return { message: `I don't understand "${verb}${n ? " " + n : ""}".`, state };
}

export function getRoomDescription(state: GameState): string {
  return describeRoom(state, state.currentRoomId);
}

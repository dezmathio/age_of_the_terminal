export type Direction = "north" | "south" | "east" | "west" | "up" | "down";

export type RoomId = string;

export interface Room {
  id: RoomId;
  name: string;
  description: string;
  exits: Partial<Record<Direction, RoomId>>;
  items: string[];
  dark?: boolean;
}

export interface ItemDef {
  id: string;
  name: string;
  description: string;
  slot?: "weapon" | "armor" | "light" | "relic";
}

export interface ParsedCommand {
  verb: string;
  noun: string | null;
  raw: string;
}

export type MapId = string;

/** Win condition: taking this item in this room completes the map. */
export interface MapWinCondition {
  roomId: RoomId;
  itemId: string;
}

/** A locked exit: requires key + flag to pass. */
export interface LockedExit {
  fromRoomId: RoomId;
  toRoomId: RoomId;
  direction: Direction;
  keyId: string;
  flag: string;
}

export interface GameState {
  currentMapId: MapId;
  currentRoomId: RoomId;
  inventory: Set<string>;
  equipped: Map<string, string>;
  roomFlags: Map<string, Set<string>>;
  globalFlags: Set<string>;
  score: number;
  maxScore: number;
  gameOver: boolean;
  won: boolean;
}

export type SlotId = "weapon" | "armor" | "light" | "relic";

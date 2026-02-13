import type { Room, ItemDef, RoomId, Direction } from "../types.js";

export const ITEMS: Record<string, ItemDef> = {
  torch: {
    id: "torch",
    name: "torch",
    description: "A crude torch that casts a flickering light.",
    slot: "light",
  },
  broadsword: {
    id: "broadsword",
    name: "broadsword",
    description: "A Cimmerian broadsword, heavy and sharp.",
    slot: "weapon",
  },
  brass_key: {
    id: "brass_key",
    name: "brass key",
    description: "An ancient brass key, green with age.",
  },
  jewel: {
    id: "jewel",
    name: "jewel of the serpent",
    description: "A blood-red jewel carved in the shape of a serpent.",
  },
};

const WORLD_ROOMS: Room[] = [
  {
    id: "field",
    name: "West of the Ruined Tower",
    description:
      "You stand in a windswept field. To the east, a crumbling tower rises against the sky. The grass is brown and dead. Something stirs in the shadows.",
    exits: { east: "tower_entrance" },
    items: [],
  },
  {
    id: "tower_entrance",
    name: "Tower Entrance",
    description:
      "The door of the tower hangs open. Dust and bones litter the threshold. Stairs lead down into darkness. A rusty sconce holds an unlit torch.",
    exits: { west: "field", down: "hall" },
    items: ["torch", "broadsword"],
  },
  {
    id: "hall",
    name: "Hall of Serpents",
    description:
      "A long hall. Serpents are carved into the walls, their eyes seeming to follow you. To the north, a heavy door bars the way. To the east, an antechamber. To the south, the stairs lead back up.",
    exits: { south: "tower_entrance", north: "sanctum", east: "antechamber" },
    items: [],
    dark: true,
  },
  {
    id: "antechamber",
    name: "Antechamber",
    description:
      "A small room. Skeletons in rusted mail lie against the walls. A brass key glints on the floor.",
    exits: { west: "hall" },
    items: ["brass_key"],
    dark: true,
  },
  {
    id: "sanctum",
    name: "The Sanctum",
    description:
      "A circular chamber. An altar of black stone stands in the center. Upon it rests a blood-red jewel. The walls bear runes that make your head ache to look upon.",
    exits: { south: "hall" },
    items: ["jewel"],
  },
];

const ROOM_MAP = new Map<RoomId, Room>(WORLD_ROOMS.map((r) => [r.id, r]));

export function getRoom(id: RoomId): Room | undefined {
  return ROOM_MAP.get(id);
}

export function getItem(id: string): ItemDef | undefined {
  return ITEMS[id];
}

export function getRoomExits(room: Room): Direction[] {
  return Object.keys(room.exits) as Direction[];
}

export function getStartRoomId(): RoomId {
  return "field";
}

export function getMaxScore(): number {
  return 12; // torch 2, key 2, open door 3, jewel 2+3
}

import type {
  Room,
  ItemDef,
  RoomId,
  Direction,
  MapId,
  MapWinCondition,
  LockedExit,
} from "../types.js";

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
  iron_key: {
    id: "iron_key",
    name: "iron key",
    description: "A cold iron key, stained with dried blood.",
  },
  crown: {
    id: "crown",
    name: "crown of the serpent king",
    description: "A crown of black iron and rubies, worn by the serpent cult's high priest.",
  },
};

export interface MapDef {
  id: MapId;
  name: string;
  rooms: Room[];
  startRoomId: RoomId;
  winCondition: MapWinCondition;
  maxScore: number;
  lockedExits?: LockedExit[];
}

const MAP_TOWER: MapDef = {
  id: "tower",
  name: "The Ruined Tower",
  rooms: [
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
  ],
  startRoomId: "field",
  winCondition: { roomId: "sanctum", itemId: "jewel" },
  maxScore: 12,
  lockedExits: [
    {
      fromRoomId: "hall",
      toRoomId: "sanctum",
      direction: "north",
      keyId: "brass_key",
      flag: "sanctum_door_open",
    },
  ],
};

const MAP_VAULT: MapDef = {
  id: "vault",
  name: "The Serpent Vault",
  rooms: [
    {
      id: "passage",
      name: "Dark Passage",
      description:
        "A narrow passage hewn from rock. To the north, a heavy iron door bars the way. A rusty sconce holds an unlit torch. An iron key hangs on a hook.",
      exits: { north: "chamber" },
      items: ["torch", "iron_key"],
    },
    {
      id: "chamber",
      name: "Chamber of Echoes",
      description:
        "A vast chamber. Your footsteps echo. Bones and broken weapons litter the floor. To the south, the passage back. To the west, an archway leads deeper.",
      exits: { south: "passage", west: "altar_room" },
      items: [],
      dark: true,
    },
    {
      id: "altar_room",
      name: "Altar of the Serpent",
      description:
        "A smaller chamber. An altar of obsidian gleams in the torchlight. Upon it rests a crown of black iron and rubies—the crown of the serpent king.",
      exits: { east: "chamber" },
      items: ["crown"],
      dark: true,
    },
  ],
  startRoomId: "passage",
  winCondition: { roomId: "altar_room", itemId: "crown" },
  maxScore: 14,
  lockedExits: [
    {
      fromRoomId: "passage",
      toRoomId: "chamber",
      direction: "north",
      keyId: "iron_key",
      flag: "vault_door_open",
    },
  ],
};

/** Ordered list of maps. Players progress through these in sequence. */
const MAP_ORDER: MapId[] = ["tower", "vault"];

const MAP_REGISTRY = new Map<MapId, MapDef>();
MAP_REGISTRY.set("tower", MAP_TOWER);
MAP_REGISTRY.set("vault", MAP_VAULT);

const ROOM_MAPS = new Map<MapId, Map<RoomId, Room>>();
for (const [mapId, def] of MAP_REGISTRY) {
  const roomMap = new Map<RoomId, Room>();
  for (const r of def.rooms) {
    roomMap.set(r.id, { ...r, items: [...r.items] }); // copy for mutable item lists
  }
  ROOM_MAPS.set(mapId, roomMap);
}

export function getMap(mapId: MapId): MapDef | undefined {
  return MAP_REGISTRY.get(mapId);
}

export function getRoom(mapId: MapId, roomId: RoomId): Room | undefined {
  return ROOM_MAPS.get(mapId)?.get(roomId);
}

export function getItem(id: string): ItemDef | undefined {
  return ITEMS[id];
}

export function getRoomExits(room: Room): Direction[] {
  return Object.keys(room.exits) as Direction[];
}

export function getFirstMapId(): MapId {
  return MAP_ORDER[0];
}

export function getNextMapId(currentMapId: MapId): MapId | null {
  const idx = MAP_ORDER.indexOf(currentMapId);
  if (idx === -1 || idx >= MAP_ORDER.length - 1) return null;
  return MAP_ORDER[idx + 1];
}

export function getStartRoomId(mapId: MapId): RoomId {
  const def = MAP_REGISTRY.get(mapId);
  return def?.startRoomId ?? "field";
}

export function getMaxScore(mapId: MapId): number {
  const def = MAP_REGISTRY.get(mapId);
  return def?.maxScore ?? 0;
}

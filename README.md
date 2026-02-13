# Age of the Terminal

A Conan-themed terminal-style text RPG. Type commands like `go north`, `take torch`, `inventory`, and `open door` to explore a ruined tower and claim the jewel of the serpent.

**Unofficial fan game.** Conan and the Hyborian Age are trademarks of their respective rights holders. Non-commercial.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Build & deploy

```bash
npm run build
```

Output is in `dist/`. With GitHub Pages (Source: GitHub Actions) enabled, pushing the `main` branch builds and deploys automatically.

## Commands

- **go** *direction* (or **n**, **s**, **e**, **w**) — move
- **take** *item* — pick up an item
- **drop** *item* — drop an item
- **examine** *item* (or **x** *item*) — describe an item
- **inventory** (or **i**) — list carried items and wielded gear
- **wield** *item* — equip weapon or light (e.g. torch)
- **open door** — use the brass key on the locked door
- **look** (or **l**) — re-describe the current room
- **score** — show score

## Tech

TypeScript, Vite, no framework. Inventory uses a `Set` (bag) and `Map` (equipped slots).

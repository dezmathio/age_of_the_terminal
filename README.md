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

Output is in `dist/`. To deploy to GitHub Pages:

1. Create a repo named `age-of-the-terminal` (or change `base` in `vite.config.ts` to match your repo name).
2. Enable GitHub Pages in the repo: **Settings → Pages → Source: GitHub Actions**.
3. Push the `main` branch; the workflow will build and deploy.

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

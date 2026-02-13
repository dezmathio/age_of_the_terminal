import { parse } from "./game/parser.js";
import { runCommand, getRoomDescription } from "./game/commands.js";
import { getStartRoomId, getMaxScore } from "./game/world.js";
import { TITLE, GAME_OVER, YOU_WIN } from "./game/ascii.js";
import type { GameState } from "./types.js";

const outputEl = document.getElementById("output") as HTMLDivElement;
const inputEl = document.getElementById("input") as HTMLInputElement;

function createState(): GameState {
  return {
    currentRoomId: getStartRoomId(),
    inventory: new Set(),
    equipped: new Map(),
    roomFlags: new Map(),
    globalFlags: new Set(),
    score: 0,
    maxScore: getMaxScore(),
    gameOver: false,
    won: false,
  };
}

let state = createState();

function write(text: string, className?: string): void {
  const div = document.createElement("div");
  div.className = className ?? "line";
  div.textContent = text;
  outputEl.appendChild(div);
}

function writeLines(text: string, className?: string): void {
  text.split("\n").forEach((line) => write(line, className));
}

function showTitle(): void {
  writeLines(TITLE.trim(), "line title");
  write("");
  write("Type a command and press Enter. Try: go east, take torch, inventory, look.");
  write("");
}

function showStart(): void {
  showTitle();
  writeLines(getRoomDescription(state));
}

function scrollToBottom(): void {
  const last = outputEl.lastElementChild;
  if (last) {
    last.scrollIntoView({ block: "end", behavior: "auto" });
  } else {
    outputEl.scrollTop = outputEl.scrollHeight;
  }
}

function handleInput(raw: string): void {
  const trimmed = raw.trim();
  if (!trimmed) return;

  const echo = document.createElement("div");
  echo.className = "input-echo";
  echo.textContent = `> ${trimmed}`;
  outputEl.appendChild(echo);

  const { verb, noun } = parse(trimmed);
  const { message, state: nextState } = runCommand(state, verb, noun);
  state = nextState;

  if (message) {
    writeLines(message);
  }

  if (state.gameOver) {
    write("");
    writeLines(state.won ? YOU_WIN.trim() : GAME_OVER.trim());
    write("");
    write("Refresh the page to play again.");
    inputEl.disabled = true;
    inputEl.placeholder = "";
    return;
  }

  scrollToBottom();
}

function onSubmit(e: Event): void {
  e.preventDefault();
  const value = inputEl.value;
  inputEl.value = "";
  handleInput(value);
}

showStart();
inputEl.focus();
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    onSubmit(e);
  }
});
scrollToBottom();

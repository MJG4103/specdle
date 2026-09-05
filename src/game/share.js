// The share text is the growth engine (see actorle-review). One emoji per hint cell,
// one line per guess, header with the puzzle number and score, footer with the URL.
import { SITE_NAME, SITE_URL, MAX_GUESSES } from "../config.js";

const EMOJI = {
  exact: "🟩",
  close: "🟨",
  unknown: "⬜",
  up: "⬆️",
  down: "⬇️",
  far: "🟥",
};

export function cellEmoji(cell) {
  if (cell.state === "exact" || cell.state === "close" || cell.state === "unknown") return EMOJI[cell.state];
  return cell.dir ? EMOJI[cell.dir] : EMOJI.far;
}

export function shareText({ number, type, rows, won, streak = 0 }) {
  const score = won ? `${rows.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const streakText = won && streak >= 2 ? ` · 🔥 ${streak}-day streak` : "";
  const grid = rows.map((row) => row.map(cellEmoji).join("")).join("\n");
  return `${SITE_NAME} #${number} ${type.toUpperCase()} ${score}${streakText}\n${grid}\n${SITE_URL}`;
}

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

export function shareText({ number, type, rows, won }) {
  const score = won ? `${rows.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const grid = rows.map((row) => row.map(cellEmoji).join("")).join("\n");
  return `${SITE_NAME} #${number} ${type.toUpperCase()} ${score}\n${grid}\n${SITE_URL}`;
}

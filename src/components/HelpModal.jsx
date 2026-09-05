import Modal from "./Modal.jsx";
import { MAX_GUESSES } from "../config.js";

export default function HelpModal({ onClose }) {
  return (
    <Modal title="How to play" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <p>Guess the day's graphics card or processor in {MAX_GUESSES} tries. GPU days and CPU days alternate; the board tells you which.</p>
        <p>Type any real part. Each guess shows how it compares to the answer on every spec:</p>
        <ul className="space-y-1">
          <li><span className="inline-block w-6 rounded bg-green-600 text-center text-white">✓</span> exact match</li>
          <li><span className="inline-block w-6 rounded bg-yellow-500 text-center">~</span> close: within a year, or within 10% on price and power</li>
          <li><span className="inline-block w-6 rounded bg-zinc-300 text-center dark:bg-zinc-700">↑</span> the answer is higher (newer, pricier, more memory or cores, more power, higher tier)</li>
          <li><span className="inline-block w-6 rounded bg-zinc-300 text-center dark:bg-zinc-700">↓</span> the answer is lower</li>
        </ul>
        <p><strong>Tier</strong> is the digit in the model name: an RTX 3070 is 70-class, a Ryzen 5 is 5-series. Parts named without one (Titan, Core 2) have no tier.</p>
        <p><strong>Launch price</strong> is the US launch price. <strong>Rated power</strong> is the maker's power figure (TDP, board power, or base power depending on era).</p>
        <p>A new puzzle every day at midnight, your time. Streaks count only the day's puzzle, not the archive.</p>
      </div>
    </Modal>
  );
}

// All persistence is localStorage: per-day guesses and the stats block. Nothing leaves the
// browser. Every access is wrapped because private windows and some embeds throw.
const STATS_KEY = "specdle:stats";
const DAY_PREFIX = "specdle:day:";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the game still plays, it just won't remember */
  }
}

export function emptyStats() {
  return { played: 0, won: 0, streak: 0, maxStreak: 0, dist: [0, 0, 0, 0, 0, 0, 0, 0], lastPlayed: null };
}

export function loadStats() {
  return { ...emptyStats(), ...read(STATS_KEY, {}) };
}

export function loadDay(dateKey) {
  return read(DAY_PREFIX + dateKey, { guesses: [], done: false, won: false });
}

export function saveDay(dateKey, state) {
  write(DAY_PREFIX + dateKey, state);
}

/**
 * Record a finished puzzle. Only today's puzzle touches the streak; archive plays are
 * saved per day but never counted. `yesterdayKey` is passed in so this stays pure.
 */
export function recordResult(stats, { dateKey, yesterdayKey, won, guessCount }) {
  const s = { ...stats, dist: [...stats.dist] };
  if (s.lastPlayed === dateKey) return s; // already recorded (double submit / re-render)
  s.played += 1;
  if (won) {
    s.won += 1;
    s.streak = s.lastPlayed === yesterdayKey ? s.streak + 1 : 1;
    s.maxStreak = Math.max(s.maxStreak, s.streak);
    s.dist[guessCount - 1] += 1;
  } else {
    s.streak = 0;
  }
  s.lastPlayed = dateKey;
  write(STATS_KEY, s);
  return s;
}

/** A streak survives only if the last play was yesterday or today. */
export function effectiveStreak(stats, todayKey, yesterdayKey) {
  if (stats.lastPlayed === todayKey || stats.lastPlayed === yesterdayKey) return stats.streak;
  return 0;
}

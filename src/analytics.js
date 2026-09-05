// Optional GoatCounter events. No-op unless GOATCOUNTER_CODE is set and the script loaded.
import { GOATCOUNTER_CODE } from "./config.js";

export function installAnalytics() {
  if (!GOATCOUNTER_CODE || document.getElementById("gc-script")) return;
  const s = document.createElement("script");
  s.id = "gc-script";
  s.async = true;
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  s.src = "https://gc.zgo.at/count.js";
  document.head.appendChild(s);
}

export function track(event, data = {}) {
  try {
    const parts = Object.entries(data).map(([k, v]) => `${k}=${v}`).join(",");
    window.goatcounter?.count?.({ path: `event/${event}${parts ? "/" + parts : ""}`, title: event, event: true });
  } catch { /* never let analytics break the game */ }
}

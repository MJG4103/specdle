import { useEffect, useRef } from "react";

/**
 * PCB-trace background. A grid of copper traces with 45° bends and round pads, with
 * signal pulses running along them. Canvas, one requestAnimationFrame loop, capped at
 * ~30 fps, paused when the tab is hidden, static (no pulses) under prefers-reduced-motion.
 * Sits behind everything at low contrast so the hint grid stays readable.
 */
export default function TechBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let traces = [];
    let pulses = [];
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, running = true;
    const CELL = 28;              // grid pitch in CSS px
    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function palette() {
      const dark = darkQuery.matches;
      return dark
        ? { trace: "rgba(34, 197, 94, 0.2)", pad: "rgba(34, 197, 94, 0.34)", padHole: "#09090b", pulse: "rgba(134, 239, 172, 1)", glow: "rgba(34, 197, 94, 0.55)", via: "rgba(56, 189, 248, 0.22)" }
        : { trace: "rgba(22, 163, 74, 0.14)", pad: "rgba(22, 163, 74, 0.26)", padHole: "#fafafa", pulse: "rgba(21, 128, 61, 1)", glow: "rgba(34, 197, 94, 0.45)", via: "rgba(2, 132, 199, 0.18)" };
    }
    let colors = palette();

    // Build one trace: a random walk on the grid using the 8 PCB directions, preferring to
    // keep going straight so it reads as routing rather than noise.
    function makeTrace() {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
      let x = Math.round(rand(0, w / CELL)) * CELL;
      let y = Math.round(rand(0, h / CELL)) * CELL;
      let d = pick(dirs);
      const pts = [[x, y]];
      const segs = Math.floor(rand(3, 8));
      for (let s = 0; s < segs; s++) {
        if (Math.random() < 0.55) {
          // turn 45° left or right
          const i = dirs.findIndex(([a, b]) => a === d[0] && b === d[1]);
          const order = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
          const j = order.findIndex(([a, b]) => a === d[0] && b === d[1]);
          d = order[(j + (Math.random() < 0.5 ? 1 : 7)) % 8];
          void i;
        }
        const len = Math.floor(rand(2, 7)) * CELL;
        x += d[0] * len; y += d[1] * len;
        pts.push([x, y]);
      }
      // path length for pulse travel
      let total = 0;
      const cum = [0];
      for (let i = 1; i < pts.length; i++) {
        total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        cum.push(total);
      }
      return { pts, cum, total, via: Math.random() < 0.3 };
    }

    function build() {
      const area = (w * h) / (1000 * 1000);
      const n = Math.max(16, Math.min(70, Math.round(area * 32)));
      traces = Array.from({ length: n }, makeTrace);
      pulses = [];
      drawStatic();
    }

    function pointAt(t, dist) {
      const { pts, cum } = t;
      let i = 1;
      while (i < cum.length && cum[i] < dist) i++;
      if (i >= cum.length) return pts[pts.length - 1];
      const f = (dist - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
    }

    // Static layer (traces + pads) drawn once per resize onto an offscreen canvas.
    const staticLayer = document.createElement("canvas");
    function drawStatic() {
      staticLayer.width = w * dpr; staticLayer.height = h * dpr;
      const s = staticLayer.getContext("2d");
      s.scale(dpr, dpr);
      s.lineCap = "round"; s.lineJoin = "round";
      for (const t of traces) {
        s.strokeStyle = t.via ? colors.via : colors.trace;
        s.lineWidth = 2;
        s.beginPath();
        t.pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
        s.stroke();
        for (const [x, y] of [t.pts[0], t.pts[t.pts.length - 1]]) {
          s.fillStyle = t.via ? colors.via : colors.pad;
          s.beginPath(); s.arc(x, y, 4.5, 0, Math.PI * 2); s.fill();
          s.fillStyle = colors.padHole;
          s.beginPath(); s.arc(x, y, 1.8, 0, Math.PI * 2); s.fill();
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduceMotion) frame(0, true);
    }

    function spawn() {
      const t = pick(traces);
      pulses.push({ t, dist: 0, speed: rand(70, 160), tail: rand(40, 90) });
    }

    function frame(ts, once = false) {
      if (!running && !once) return;
      raf = once ? 0 : requestAnimationFrame(frame);
      if (!once && ts - last < 33) return;           // ~30 fps cap
      const dt = last ? Math.min((ts - last) / 1000, 0.1) : 0.016;
      last = ts;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(staticLayer, 0, 0, w, h);
      if (once) return;
      if (pulses.length < Math.max(3, traces.length / 5) && Math.random() < 0.08) spawn();
      ctx.lineCap = "round";
      for (const p of pulses) {
        p.dist += p.speed * dt;
        const head = pointAt(p.t, p.dist);
        const tail = pointAt(p.t, Math.max(0, p.dist - p.tail));
        // tail: a short gradient stroke along the trace path
        const grad = ctx.createLinearGradient(tail[0], tail[1], head[0], head[1]);
        grad.addColorStop(0, "rgba(34,197,94,0)");
        grad.addColorStop(1, colors.glow);
        ctx.strokeStyle = grad; ctx.lineWidth = 2.5;
        ctx.beginPath();
        // walk the polyline between tail and head distances
        const { pts, cum } = p.t;
        const from = Math.max(0, p.dist - p.tail), to = p.dist;
        ctx.moveTo(tail[0], tail[1]);
        for (let i = 1; i < cum.length; i++) if (cum[i] > from && cum[i] < to) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.lineTo(head[0], head[1]);
        ctx.stroke();
        ctx.fillStyle = colors.pulse;
        ctx.shadowColor = colors.glow; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(head[0], head[1], 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      pulses = pulses.filter((p) => p.dist < p.t.total + p.tail);
    }

    const onVisibility = () => {
      running = !document.hidden && !reduceMotion;
      if (running && !raf) { last = 0; raf = requestAnimationFrame(frame); }
      if (!running && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    const onTheme = () => { colors = palette(); drawStatic(); if (reduceMotion) frame(0, true); };

    let resizeTimer = 0;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); };

    resize();
    running = !reduceMotion;
    if (running) raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    darkQuery.addEventListener("change", onTheme);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      darkQuery.removeEventListener("change", onTheme);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />;
}

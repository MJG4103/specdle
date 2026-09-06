#!/usr/bin/env python3
"""
Blender Open Data -> data/perf.json

Joins the Blender Benchmark results (opendata.blender.org, CC0) to data/items.json so every
part that people actually benchmark gets a licensed performance number. The score is the one
Blender's own site shows: samples per minute summed over the monster, junkshop and classroom
scenes, one device per run. It is a *rendering* score. It is never a gaming figure and no
page may present it as one.

Usage:
  python data/blender_perf.py            # uses data/raw/blender-opendata-latest.zip (downloads if missing)
  python data/blender_perf.py --refresh  # re-download the ~100 MB daily snapshot first

Method, so the numbers can be defended:
  - Only runs with all three scenes and exactly one distinct compute device count.
  - Scores are grouped by Blender *major* version; majors are not comparable to each other.
    The primary major is the one with the most runs (4.x as of 2026-09). Every median in
    perf.json says which major it came from.
  - A device needs at least MIN_RUNS runs to get a median. Laptop/mobile variants are kept
    in the device list but never joined to a desktop part.
  - Blender's device strings are messy ("13th Gen Intel Core i9-13900K", "Radeon(TM)"); a
    normaliser handles the common cases and data/perf-overrides.json maps the rest by hand.
    When several Blender strings map to one part the one with the most runs wins.
  - Nvidia parts prefer the OPTIX backend, AMD parts HIP, CPUs CPU. CUDA medians are kept in
    the device list but only used when no OPTIX median exists.

Outputs: data/perf.json (joined medians + the full device table for the primary major) and
data/review-perf.md (coverage, a hand-check sample, the unmatched names worth mapping).
Deterministic for a given snapshot. Never deploys.
"""
from __future__ import annotations

import argparse
import io
import json
import re
import statistics
import sys
import time
import zipfile
from collections import Counter, defaultdict
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
SNAPSHOT_URL = "https://opendata.blender.org/snapshots/opendata-latest.zip"
SNAPSHOT = RAW / "blender-opendata-latest.zip"
UA = "Specdle-dataset-builder/0.1 (https://specdle.com; tylerhill1997@gmail.com) python-urllib"
SCENES = {"monster", "junkshop", "classroom"}
MIN_RUNS = 5
BACKEND_PREF = {"OPTIX": 0, "HIP": 0, "ONEAPI": 0, "METAL": 0, "CPU": 0, "CUDA": 1}
# Laptop/mobile parts never join to a desktop row: explicit words, plus the CPU suffixes the
# vendors use for mobile chips (i7-12700H, i9-13980HX, Ryzen 7 5800H/HS, Ryzen 5 7640U, Core
# Ultra 7 155H/V, Ryzen AI 9 HX 370). Server parts (Threadripper, EPYC, Xeon) and Apple silicon
# are not in items.json at all; they stay in the device table for later modes.
LAPTOP = re.compile(r"laptop|mobile|max-q|\bmax q\b"
                    r"|\bi[3579]-\d{4,5}[A-Z]*?(?:H|HX|HK|HQ|U|P|G\d)\b"
                    r"|\bultra [3579] \d{3}[HUV]X?\b"
                    r"|\bryzen (?:[3579]|ai [3579]) (?:HX )?\d{3,4}[HUS]X?S?\b", re.I)


def download(refresh: bool) -> Path:
    RAW.mkdir(exist_ok=True)
    if SNAPSHOT.exists() and not refresh:
        return SNAPSHOT
    print(f"downloading {SNAPSHOT_URL} ...", file=sys.stderr)
    req = Request(SNAPSHOT_URL, headers={"User-Agent": UA})
    with urlopen(req, timeout=600) as r, open(SNAPSHOT, "wb") as f:
        while chunk := r.read(1 << 20):
            f.write(chunk)
    return SNAPSHOT


def normalise(name: str) -> str:
    """'13th Gen Intel(R) Core(TM) i9-13900K' -> 'i9 13900k'; 'NVIDIA GeForce RTX 3070' -> 'rtx 3070'.
    Same function is applied to both sides of the join."""
    s = name.lower()
    s = re.sub(r"\(r\)|\(tm\)|®|™", " ", s)
    s = re.sub(r"\b\d+(st|nd|rd|th) gen\b", " ", s)
    s = re.sub(r"\bw/.*$|\bwith .*$|@.*$", " ", s)
    s = re.sub(r"\b(two|four|six|eight|twelve|sixteen|\d+)-cores?\b", " ", s)
    s = re.sub(r"\b(nvidia|amd|intel|geforce|radeon|core|ryzen|processor|cpu|graphics|edition|desktop)\b", " ", s)
    s = re.sub(r"\b(\d+)\s*gb\b", r"\1 gb", s)   # '6GB' -> '6 gb' so 'GTX 1060 6GB' meets 'GTX 1060 6 GB'
    s = re.sub(r"[^a-z0-9]+", " ", s).strip()
    return re.sub(r"\s+", " ", s)


def aggregate(path: Path):
    """Stream the JSONL inside the zip. Returns (runs_by_key, snapshot_date, counters)."""
    agg: dict[tuple[str, str, str], list[float]] = defaultdict(list)
    stats = Counter()
    t0 = time.time()
    with zipfile.ZipFile(path) as zf:
        member = next(n for n in zf.namelist() if n.endswith(".jsonl"))
        m = re.search(r"(\d{4}-\d{2}-\d{2})", member)
        snapshot_date = m.group(1) if m else time.strftime("%Y-%m-%d")
        with zf.open(member) as raw:
            for line in io.TextIOWrapper(raw, encoding="utf-8"):
                stats["records"] += 1
                try:
                    rec = json.loads(line)
                except json.JSONDecodeError:
                    stats["unparsable"] += 1
                    continue
                entries = rec.get("data")
                if not isinstance(entries, list):
                    continue
                per: dict[tuple[str, str, str], dict[str, float]] = {}
                for e in entries:
                    spm = (e.get("stats") or {}).get("samples_per_minute")
                    if spm is None:
                        continue
                    major = ((e.get("blender_version") or {}).get("version") or "").split(".")[0]
                    di = e.get("device_info") or {}
                    names = sorted({(d.get("name") or "").strip() for d in (di.get("compute_devices") or []) if isinstance(d, dict)})
                    if len(names) != 1 or not names[0]:
                        continue
                    scene = ((e.get("scene") or {}).get("label") or "")
                    per.setdefault((major, di.get("device_type") or "", names[0]), {})[scene] = float(spm)
                for key, scenes in per.items():
                    if SCENES <= set(scenes):
                        agg[key].append(sum(scenes[s] for s in SCENES))
                        stats["runs"] += 1
    stats["seconds"] = round(time.time() - t0)
    return agg, snapshot_date, stats


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()
    path = download(args.refresh)
    agg, snapshot_date, stats = aggregate(path)
    print(f"snapshot {snapshot_date}: {stats['records']} records, {stats['runs']} complete runs, {stats['seconds']} s", file=sys.stderr)

    runs_by_major = Counter()
    for (major, _, _), xs in agg.items():
        runs_by_major[major] += len(xs)
    primary = max(runs_by_major, key=runs_by_major.get)

    devices = []
    for (major, dtype, name), xs in agg.items():
        if major != primary or len(xs) < MIN_RUNS:
            continue
        xs = sorted(xs)
        devices.append({
            "name": name, "backend": dtype, "runs": len(xs),
            "median": round(statistics.median(xs), 1),
            "p25": round(xs[len(xs) // 4], 1), "p75": round(xs[(3 * len(xs)) // 4], 1),
            "laptop": bool(LAPTOP.search(name)),
        })
    devices.sort(key=lambda d: -d["median"])

    items = json.loads((ROOT / "items.json").read_text())["items"]
    by_norm: dict[str, list[dict]] = defaultdict(list)
    for it in items:
        by_norm[normalise(it["name"])].append(it)
    overrides = json.loads((ROOT / "perf-overrides.json").read_text()) if (ROOT / "perf-overrides.json").exists() else {}

    joined: dict[str, dict] = {}
    unmatched = Counter()
    for d in devices:
        if d["laptop"]:
            continue
        if d["name"] in overrides:
            target = overrides[d["name"]]
            hits = [it for it in items if it["id"] == target] if target else []
            if target and not hits:
                print(f"perf-overrides.json: unknown id {target}", file=sys.stderr)
        else:
            hits = by_norm.get(normalise(d["name"]), [])
        if not hits:
            unmatched[(d["backend"], d["name"])] += d["runs"]
            continue
        for it in hits:
            if (it["type"] == "cpu") != (d["backend"] == "CPU"):
                continue
            cur = joined.get(it["id"])
            rank = (BACKEND_PREF.get(d["backend"], 9), -d["runs"])
            if cur is None or rank < (BACKEND_PREF.get(cur["backend"], 9), -cur["runs"]):
                joined[it["id"]] = {"blender_major": primary, "backend": d["backend"], "median": d["median"],
                                    "p25": d["p25"], "p75": d["p75"], "runs": d["runs"], "device_name": d["name"]}

    payload = {
        "generated": time.strftime("%Y-%m-%d"),
        "snapshot_date": snapshot_date,
        "license": "CC0 1.0",
        "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
        "source": "Blender Open Data",
        "source_url": "https://opendata.blender.org/",
        "score": "samples per minute, monster + junkshop + classroom, single device; Blender rendering only, not game performance",
        "blender_major": primary,
        "min_runs": MIN_RUNS,
        "runs_by_major": dict(sorted(runs_by_major.items())),
        "items": dict(sorted(joined.items())),
        "devices": devices,
    }
    (ROOT / "perf.json").write_text(json.dumps(payload, indent=1, ensure_ascii=False) + "\n")
    write_review(items, joined, devices, unmatched, payload, stats)
    print(f"wrote data/perf.json: {len(joined)} parts joined, {len(devices)} devices (Blender {primary}.x, >= {MIN_RUNS} runs); data/review-perf.md")
    return 0


def write_review(items, joined, devices, unmatched, payload, stats) -> None:
    import random
    by_id = {it["id"]: it for it in items}
    lines = ["# Performance join review", "",
             f"Generated {payload['generated']} by `data/blender_perf.py` from the Blender Open Data snapshot of "
             f"{payload['snapshot_date']} ({stats['records']} submissions, {stats['runs']} complete runs). "
             f"Primary Blender major: **{payload['blender_major']}.x**; runs by major: "
             + ", ".join(f"{k}.x {v}" for k, v in payload["runs_by_major"].items()) + ".", "",
             "The score is a **Blender rendering score** (samples/minute over three scenes). Check the sample rows",
             "against opendata.blender.org's own device page: the median there should match within a few percent",
             "(they include multi-device runs and all versions; we don't). A wrong join is a naming problem: fix",
             "it in `perf-overrides.json` (Blender device string -> item id, or null to ignore).", "",
             "## Coverage", "", "| Slice | Parts | With a score | Share |", "|---|---|---|---|"]
    def cov(label, sub):
        n = len(sub); k = sum(1 for i in sub if i["id"] in joined)
        lines.append(f"| {label} | {n} | {k} | {100 * k // n if n else 0}% |")
    for kind, since in (("gpu", 2016), ("cpu", 2017)):
        for vendor in ("Nvidia", "AMD", "Intel"):
            sub = [i for i in items if i["type"] == kind and i["vendor"] == vendor]
            if sub:
                cov(f"{vendor} {kind.upper()}, all", sub)
                cov(f"{vendor} {kind.upper()}, {since}+", [i for i in sub if i["year"] >= since and not i["oem"]])
    cov("Daily pool, all", [i for i in items if i["daily"]])
    lines += ["", "## Twenty joined rows to hand-check", "",
              "| ✓ | Part | Year | MSRP | Blender device string | Backend | Median | p25–p75 | Runs |",
              "|---|---|---|---|---|---|---|---|---|"]
    rng = random.Random(42)
    ids = rng.sample(sorted(joined), min(20, len(joined)))
    for i in ids:
        it, j = by_id[i], joined[i]
        price = f"${it['msrp_usd']}" if it["msrp_usd"] else "—"
        lines.append(f"| [ ] | {it['name']} | {it['year']} | {price} | {j['device_name']} | {j['backend']} | {j['median']} | {j['p25']}–{j['p75']} | {j['runs']} |")
    lines += ["", "## Unmatched desktop device strings with the most runs (candidates for `perf-overrides.json`)", "",
              "| Runs | Backend | Blender device string |", "|---|---|---|"]
    for (backend, name), n in unmatched.most_common(40):
        lines.append(f"| {n} | {backend} | {name} |")
    lines += ["", f"Devices with a median in the primary major: {len(devices)}; laptop/mobile variants among them: "
              f"{sum(1 for d in devices if d['laptop'])} (kept in `perf.json` → `devices`, never joined to a desktop part)."]
    (ROOT / "review-perf.md").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())

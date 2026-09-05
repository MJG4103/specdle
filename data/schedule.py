#!/usr/bin/env python3
"""
Specdle puzzle schedule.

Writes data/schedule.json: {"start": "YYYY-MM-DD", "days": {"YYYY-MM-DD": item_id, ...}}
for 24 months from the start date. Even days from the start are GPU days, odd days CPU.
Answers come from the daily pool in items.json, shuffled with a fixed seed and cycled, so
nothing repeats until the pool is exhausted (about 17 months for GPUs, longer for CPUs).

Idempotent: dates already in the file are never changed, only missing dates are filled.
That keeps the past stable when the dataset is rebuilt monthly. Delete the file to start
over before launch (nothing has shipped yet).

Puzzle number = days since start + 1. Change START before launch, never after.
"""
from __future__ import annotations

import json
import random
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent
START = date(2026, 9, 5)
DAYS = 730
SEED = 20260905


def main() -> None:
    items = json.loads((ROOT / "items.json").read_text())["items"]
    pools = {k: sorted(i["id"] for i in items if i["daily"] and i["type"] == k) for k in ("gpu", "cpu")}
    path = ROOT / "schedule.json"
    sched = json.loads(path.read_text()) if path.exists() else {"start": START.isoformat(), "days": {}}
    start = date.fromisoformat(sched["start"])
    used = set(sched["days"].values())
    rng = random.Random(SEED)
    queues = {}
    for kind, ids in pools.items():
        order = ids[:]
        rng.shuffle(order)
        # already-scheduled answers go to the back of the queue so they repeat last
        queues[kind] = [i for i in order if i not in used] + [i for i in order if i in used]
    added = 0
    for n in range(DAYS):
        d = (start + timedelta(days=n)).isoformat()
        if d in sched["days"]:
            continue
        kind = "gpu" if n % 2 == 0 else "cpu"
        q = queues[kind]
        item_id = q.pop(0)
        q.append(item_id)
        sched["days"][d] = item_id
        added += 1
    sched["days"] = dict(sorted(sched["days"].items()))
    path.write_text(json.dumps(sched, indent=1) + "\n")
    print(f"schedule: {len(sched['days'])} days from {sched['start']}, {added} added; "
          f"pools gpu={len(pools['gpu'])} cpu={len(pools['cpu'])}")


if __name__ == "__main__":
    main()

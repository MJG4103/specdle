#!/usr/bin/env python3
"""
Consistency checks across data/items.json, data/perf.json and data/cpi.json. Run after any
rebuild; exits non-zero on a hard failure. Prints the coverage numbers the plan quotes so a
rebuild that silently loses coverage is noticed.

  python data/check.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
failures: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)
    print("FAIL", msg)


def main() -> int:
    items = json.loads((ROOT / "items.json").read_text())["items"]
    perf = json.loads((ROOT / "perf.json").read_text())
    cpi = json.loads((ROOT / "cpi.json").read_text())
    by_id = {i["id"]: i for i in items}

    # items.json: ids unique, required fields, plausible ranges for the new fields
    if len(by_id) != len(items):
        fail("duplicate ids in items.json")
    for i in items:
        if i["type"] not in ("gpu", "cpu") or not i["name"] or not i["year"]:
            fail(f"{i.get('id')}: missing type/name/year")
        if i.get("msrp_usd") is not None and not (5 <= i["msrp_usd"] <= 20000):
            fail(f"{i['id']}: msrp {i['msrp_usd']}")
        if i["type"] == "gpu":
            for k, lo, hi in (("fp32_tflops", 0.01, 300), ("bandwidth_gbs", 1, 20000), ("bus_width_bit", 32, 8192),
                              ("clock_mhz", 100, 5000), ("boost_mhz", 100, 5000), ("transistors_m", 50, 500000),
                              ("die_mm2", 10, 1500), ("fab_nm", 2, 130)):
                v = i.get(k)
                if v is not None and not (lo <= v <= hi):
                    fail(f"{i['id']}: {k}={v} outside {lo}-{hi}")
            if i.get("boost_mhz") and i.get("clock_mhz") and i["boost_mhz"] < i["clock_mhz"]:
                fail(f"{i['id']}: boost {i['boost_mhz']} below base {i['clock_mhz']}")
        else:
            for k, lo, hi in (("clock_ghz", 0.5, 7), ("boost_ghz", 0.5, 7), ("cache_mb", 0.1, 1024), ("power_max_w", 10, 600)):
                v = i.get(k)
                if v is not None and not (lo <= v <= hi):
                    fail(f"{i['id']}: {k}={v} outside {lo}-{hi}")
            if i.get("boost_ghz") and i.get("clock_ghz") and i["boost_ghz"] < i["clock_ghz"]:
                fail(f"{i['id']}: boost {i['boost_ghz']} below base {i['clock_ghz']}")

    # perf.json: every joined id exists, type matches backend, scores positive
    for pid, j in perf["items"].items():
        it = by_id.get(pid)
        if not it:
            fail(f"perf.json: unknown id {pid}")
            continue
        if (it["type"] == "cpu") != (j["backend"] == "CPU"):
            fail(f"perf.json: {pid} joined to a {j['backend']} device")
        if not (j["median"] > 0 and j["runs"] >= perf["min_runs"]):
            fail(f"perf.json: {pid} median/runs {j['median']}/{j['runs']}")
    if perf["license"] != "CC0 1.0":
        fail("perf.json license changed")

    # cpi.json: covers every launch year
    years = {int(y) for y in cpi["years"]}
    for i in items:
        if i["year"] not in years:
            fail(f"cpi.json has no year {i['year']} (needed by {i['id']})")
    if cpi["latest_year"] != max(years):
        fail("cpi.json latest_year inconsistent")

    # coverage report
    def cov(label, sub, pred):
        n = len(sub); k = sum(1 for i in sub if pred(i))
        print(f"  {label:42s} {k:4d}/{n:<4d} {100 * k // n if n else 0:3d}%")
    gpu16 = [i for i in items if i["type"] == "gpu" and i["year"] >= 2016 and not i["oem"]]
    cpu17 = [i for i in items if i["type"] == "cpu" and i["year"] >= 2017]
    print("coverage:")
    cov("GPUs 2016+ with MSRP", gpu16, lambda i: i["msrp_usd"] is not None)
    cov("GPUs 2016+ with Blender score", gpu16, lambda i: i["id"] in perf["items"])
    cov("GPUs 2016+ with MSRP and score", gpu16, lambda i: i["msrp_usd"] is not None and i["id"] in perf["items"])
    cov("GPUs 2016+ with FP32 TFLOPS", gpu16, lambda i: i.get("fp32_tflops") is not None)
    cov("CPUs 2017+ with MSRP", cpu17, lambda i: i["msrp_usd"] is not None)
    cov("CPUs 2017+ with Blender score", cpu17, lambda i: i["id"] in perf["items"])
    cov("CPUs 2017+ with MSRP and score", cpu17, lambda i: i["msrp_usd"] is not None and i["id"] in perf["items"])
    cov("All parts with MSRP (a price page)", items, lambda i: i["msrp_usd"] is not None)
    cov("All parts with MSRP or score (a real page)", items, lambda i: i["msrp_usd"] is not None or i["id"] in perf["items"])
    print(f"  Blender {perf['blender_major']}.x devices in the table: {len(perf['devices'])}; snapshot {perf['snapshot_date']}")
    print(f"  CPI {min(years)}–{cpi['latest_year']} ({cpi['latest_months']} months of {cpi['latest_year']})")
    if failures:
        print(f"{len(failures)} failure(s)")
        return 1
    print("ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())

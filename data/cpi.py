#!/usr/bin/env python3
"""
FRED CPI -> data/cpi.json

Annual averages of CPIAUCSL (Consumer Price Index for All Urban Consumers: All Items in
U.S. City Average, seasonally adjusted, index 1982-1984=100), published by the Bureau of
Labor Statistics and served by FRED. A US federal government work: public domain.

Usage:
  python data/cpi.py            # uses data/raw/CPIAUCSL.csv if present
  python data/cpi.py --refresh  # re-download from FRED (no API key needed)

"Launch price in today's dollars" = msrp × cpi[latest_year] / cpi[launch_year]. The latest
year is usually partial; cpi.json records how many months it covers so pages can say
"2026 dollars (Jan–Jul average)". Annual averages, not launch-month values, on purpose: a
GPU's MSRP holds for its whole first year and month-level precision would be false accuracy.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
import time
from collections import defaultdict
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
SERIES = "CPIAUCSL"
URL = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={SERIES}"
UA = "Specdle-dataset-builder/0.1 (https://specdle.com; tylerhill1997@gmail.com) python-urllib"


def fetch(refresh: bool) -> Path:
    RAW.mkdir(exist_ok=True)
    path = RAW / f"{SERIES}.csv"
    if path.exists() and not refresh:
        return path
    with urlopen(Request(URL, headers={"User-Agent": UA}), timeout=60) as r:
        path.write_bytes(r.read())
    return path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()
    path = fetch(args.refresh)
    sums, counts = defaultdict(float), defaultdict(int)
    with path.open() as f:
        for row in csv.DictReader(f):
            v = row.get(SERIES, "").strip()
            if not v or v == ".":
                continue
            y = int(row["observation_date"][:4])
            sums[y] += float(v)
            counts[y] += 1
    years = sorted(sums)
    latest = years[-1]
    payload = {
        "generated": time.strftime("%Y-%m-%d"),
        "series": SERIES,
        "title": "Consumer Price Index for All Urban Consumers: All Items in U.S. City Average",
        "source": "U.S. Bureau of Labor Statistics via FRED, Federal Reserve Bank of St. Louis",
        "source_url": f"https://fred.stlouisfed.org/series/{SERIES}",
        "license": "public domain (US federal government work)",
        "base": "1982-1984=100",
        "method": "calendar-year average of monthly seasonally adjusted values",
        "latest_year": latest,
        "latest_months": counts[latest],
        "years": {str(y): round(sums[y] / counts[y], 1) for y in years},
    }
    (ROOT / "cpi.json").write_text(json.dumps(payload, indent=1) + "\n")
    print(f"wrote data/cpi.json: {years[0]}–{latest} ({counts[latest]} months of {latest}); "
          f"$100 in 2014 = ${100 * payload['years'][str(latest)] / payload['years']['2014']:.0f} in {latest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

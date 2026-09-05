#!/usr/bin/env python3
"""
Specdle dataset builder.

Pulls the Wikipedia hardware list tables (CC BY-SA 4.0) through the MediaWiki API,
normalizes them into one JSON file of guessable GPUs and CPUs, and writes a review
sample. Deterministic: same Wikipedia revision in, same JSON out. Never deploys.

Usage:
  python data/build.py --inspect      # dump flattened table headers per section
  python data/build.py                # build data/items.json + data/review-sample.md
  python data/build.py --refresh      # ignore the raw cache and refetch

Raw API responses are cached in data/raw/ (gitignored) so re-runs are offline and
Wikipedia is hit at most once per section per run.
"""
from __future__ import annotations

import argparse
import html as htmlmod
import json
import re
import sys
import time
from dataclasses import dataclass
from io import StringIO
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import pandas as pd
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
API = "https://en.wikipedia.org/w/api.php"
# Wikimedia asks for a descriptive User-Agent with contact info.
UA = "Specdle-dataset-builder/0.1 (https://specdle.com; tylerhill1997@gmail.com) python-urllib"


@dataclass(frozen=True)
class Source:
    page: str          # Wikipedia page title
    section: int       # MediaWiki section index (from prop=sections)
    kind: str          # "gpu" | "cpu"
    vendor: str        # Nvidia | AMD | Intel
    label: str         # human series label, e.g. "GeForce RTX 30 series"
    keep_subsections: bool = False  # keep deeper subsections (Intel codename tables) or cut at the first one (AMD IGP)


# Desktop parts only. Section indices verified against prop=sections on 2026-09-05.
SOURCES: list[Source] = []


def _add(page, kind, vendor, items, keep_subsections=False):
    for idx, label in items:
        SOURCES.append(Source(page, idx, kind, vendor, label, keep_subsections))


_add("List of Nvidia graphics processing units", "gpu", "Nvidia", [
    (11, "GeForce 8 series"), (12, "GeForce 9 series"), (13, "GeForce 100 series"),
    (14, "GeForce 200 series"), (15, "GeForce 300 series"), (16, "GeForce 400 series"),
    (17, "GeForce 500 series"), (18, "GeForce 600 series"), (19, "GeForce 700 series"),
    (20, "GeForce 900 series"), (21, "GeForce 10 series"), (22, "Volta"),
    (23, "GeForce GTX 16 series"), (24, "GeForce RTX 20 series"), (25, "GeForce RTX 30 series"),
    (26, "GeForce RTX 40 series"), (27, "GeForce RTX 50 series"),
])
_add("List of AMD graphics processing units", "gpu", "AMD", [
    (22, "Radeon HD 2000 series"), (23, "Radeon HD 3000 series"), (26, "Radeon HD 4000 series"),
    (28, "Radeon HD 5000 series"), (29, "Radeon HD 6000 series"), (31, "Radeon HD 7000 series"),
    (33, "Radeon HD 8000 series"), (34, "Radeon 200 series"), (35, "Radeon 300 series"),
    (36, "Radeon 400 series"), (37, "Radeon 500 series"), (38, "Radeon RX Vega series"),
    (39, "Radeon VII series"), (40, "Radeon RX 5000 series"), (41, "Radeon RX 6000 series"),
    (42, "Radeon RX 7000 series"), (43, "Radeon RX 9000 series"),
])
# Ryzen: codename (level-3) sections fetched directly so Threadripper stays out.
_add("List of AMD Ryzen processors", "cpu", "AMD", [
    (3, "Ryzen 1000 series"), (6, "Ryzen 2000 series (APU)"), (7, "Ryzen 2000 series"),
    (10, "Ryzen 3000 series (APU)"), (11, "Ryzen 3000 series"), (14, "Ryzen 4000 series"),
    (15, "Ryzen 4000 series (APU)"), (17, "Ryzen 5000 series"), (18, "Ryzen 5000 series"),
    (19, "Ryzen 5000 series (APU)"), (22, "Ryzen 7000 series"), (25, "Ryzen 8000 series"),
    (26, "Ryzen 8000 series (APU)"), (28, "Ryzen 9000 series"),
], keep_subsections=True)
# Intel: generation sections; each holds codename subsections and some Xeon tables,
# which are filtered out by name later.
_add("List of Intel Core desktop processors", "cpu", "Intel", [
    (1, "Core 2"), (14, "Core i 1st gen"), (19, "Core i 2nd gen"), (21, "Core i 3rd gen"),
    (24, "Core i 4th gen"), (28, "Core i 5th gen"), (31, "Core i 6th gen"), (35, "Core i 7th gen"),
    (39, "Core i 8th gen"), (41, "Core i 9th gen"), (44, "Core i 10th gen"), (48, "Core i 11th gen"),
    (51, "Core i 12th gen"), (53, "Core i 13th gen"), (55, "Core i 14th gen"), (57, "Core Ultra Series 2"),
], keep_subsections=True)


# ----------------------------------------------------------------------------- fetch

def fetch_section(page: str, section: int, refresh: bool = False) -> dict:
    """Return the MediaWiki parse result ({title, revid, text}) for one page section,
    cached under data/raw/ so re-runs are offline. revid pins the exact Wikipedia
    revision each table came from, which the attribution page cites."""
    RAW.mkdir(exist_ok=True)
    cache = RAW / f"{page.replace(' ', '_')}__{section}.json"
    if cache.exists() and not refresh:
        return json.loads(cache.read_text())
    q = urlencode({"action": "parse", "page": page, "section": section, "prop": "text|revid",
                   "format": "json", "formatversion": 2, "disabletoc": 1, "redirects": 1})
    req = Request(f"{API}?{q}", headers={"User-Agent": UA})
    with urlopen(req, timeout=60) as r:
        data = json.load(r)["parse"]
    out = {"title": data["title"], "revid": data["revid"], "text": data["text"]}
    cache.write_text(json.dumps(out))
    time.sleep(0.5)  # be polite; the whole run is ~65 requests
    return out


# ----------------------------------------------------------------------------- tables

FOOTNOTE = re.compile(r"\[\s*[\w ]{1,4}\s*\]")


def section_tables(section_html: str, keep_subsections: bool) -> list[BeautifulSoup]:
    """All wikitables in a section. Unless keep_subsections, stop at the first heading
    deeper than the section's own, so a series' IGP subsection doesn't leak into the
    desktop table set. The section's own heading is the first .mw-heading in the HTML."""
    soup = BeautifulSoup(section_html, "lxml")
    if not keep_subsections:
        headings = soup.select("div.mw-heading")
        if headings:
            own = _heading_level(headings[0])
            for h in headings[1:]:
                if _heading_level(h) > own:
                    for el in list(h.find_all_next()):
                        el.decompose()
                    h.decompose()
                    break
    tables = soup.find_all("table", class_="wikitable")
    # Wikipedia wraps citation/footnote text in <sup>; drop it so cells parse clean.
    # Editors also typo span attributes (rowspan="2'" in the RTX 40 table), which makes
    # pandas raise; keep only the leading digits.
    for t in tables:
        for cell in t.find_all(["td", "th"]):
            for attr in ("rowspan", "colspan"):
                v = cell.get(attr)
                if v is not None:
                    m = re.match(r"\s*(\d+)", str(v))
                    if m:
                        cell[attr] = m.group(1)
                    else:
                        del cell[attr]
        for sup in t.find_all("sup"):
            sup.decompose()
        for s in t.find_all("style"):
            s.decompose()
        for br in t.find_all("br"):
            br.replace_with(" ")
    return tables


def _heading_level(div) -> int:
    for c in div.get("class", []):
        m = re.fullmatch(r"mw-heading(\d)", c)
        if m:
            return int(m.group(1))
    return 9


def flatten_columns(df: pd.DataFrame) -> list[str]:
    """Collapse a MultiIndex header into 'Top > Sub' strings, dropping repeats and
    the 'Unnamed: 3_level_1' noise pandas adds for colspans."""
    cols = []
    for col in df.columns:
        parts = col if isinstance(col, tuple) else (col,)
        seen = []
        for p in parts:
            p = str(p).strip()
            if p.startswith("Unnamed") or p in seen or not p:
                continue
            seen.append(p)
        cols.append(" > ".join(seen))
    return cols


def read_table(table) -> pd.DataFrame | None:
    try:
        dfs = pd.read_html(StringIO(str(table)))
    except ValueError:
        return None
    if not dfs:
        return None
    df = dfs[0]
    df.columns = flatten_columns(df)
    return df


# ----------------------------------------------------------------------------- inspect

def inspect(refresh: bool) -> None:
    for src in SOURCES:
        html = fetch_section(src.page, src.section, refresh)["text"]
        tables = section_tables(html, src.keep_subsections)
        print(f"\n### {src.vendor} {src.kind} | {src.label} | section {src.section} | {len(tables)} table(s)")
        for ti, t in enumerate(tables):
            df = read_table(t)
            if df is None:
                print(f"  [{ti}] unreadable")
                continue
            print(f"  [{ti}] {len(df)} rows")
            for c in df.columns:
                print(f"      - {c}")
            with pd.option_context("display.max_colwidth", 40, "display.width", 250):
                print("      " + df.head(2).to_string(index=False).replace("\n", "\n      "))


# ----------------------------------------------------------------------------- static maps

# GPU architecture. Resolved per row: Nvidia from the chip codename prefix (GM107 ->
# Maxwell, so the GTX 750 in the "700 series" section is labelled correctly), AMD from
# the table's Architecture column. GPU_ARCH is only the fallback for tables without either.
NVIDIA_ARCH_PREFIX = [
    ("GB", "Blackwell"), ("AD", "Ada Lovelace"), ("GA", "Ampere"), ("TU", "Turing"),
    ("GV", "Volta"), ("GP", "Pascal"), ("GM", "Maxwell"), ("GK", "Kepler"), ("GF", "Fermi"),
    ("GT", "Tesla"), ("G", "Tesla"), ("C", "Tesla"),
]
AMD_ARCH_CELL = re.compile(r"(TeraScale|Terascale|GCN|RDNA)\s*(\d(?:\.\d)?)?", re.I)
GPU_ARCH = {
    "GeForce 8 series": "Tesla", "GeForce 9 series": "Tesla", "GeForce 100 series": "Tesla",
    "GeForce 200 series": "Tesla", "GeForce 300 series": "Tesla",
    "GeForce 400 series": "Fermi", "GeForce 500 series": "Fermi",
    "GeForce 600 series": "Kepler", "GeForce 700 series": "Kepler",
    "GeForce 900 series": "Maxwell", "GeForce 10 series": "Pascal", "Volta": "Volta",
    "GeForce GTX 16 series": "Turing", "GeForce RTX 20 series": "Turing",
    "GeForce RTX 30 series": "Ampere", "GeForce RTX 40 series": "Ada Lovelace",
    "GeForce RTX 50 series": "Blackwell",
    "Radeon HD 2000 series": "TeraScale", "Radeon HD 3000 series": "TeraScale",
    "Radeon HD 4000 series": "TeraScale", "Radeon HD 5000 series": "TeraScale 2",
}
# CPU socket by series label. Mainstream desktop socket; HEDT parts in the same
# section (Core i7 Extreme, X-series) are corrected by the per-name rules below.
CPU_SOCKET = {
    "Core 2": "LGA 775", "Core i 1st gen": "LGA 1156", "Core i 2nd gen": "LGA 1155",
    "Core i 3rd gen": "LGA 1155", "Core i 4th gen": "LGA 1150", "Core i 5th gen": "LGA 1150",
    "Core i 6th gen": "LGA 1151", "Core i 7th gen": "LGA 1151", "Core i 8th gen": "LGA 1151",
    "Core i 9th gen": "LGA 1151", "Core i 10th gen": "LGA 1200", "Core i 11th gen": "LGA 1200",
    "Core i 12th gen": "LGA 1700", "Core i 13th gen": "LGA 1700", "Core i 14th gen": "LGA 1700",
    "Core Ultra Series 2": "LGA 1851",
    "Ryzen 1000 series": "AM4", "Ryzen 2000 series": "AM4", "Ryzen 2000 series (APU)": "AM4",
    "Ryzen 3000 series": "AM4", "Ryzen 3000 series (APU)": "AM4", "Ryzen 4000 series": "AM4",
    "Ryzen 4000 series (APU)": "AM4", "Ryzen 5000 series": "AM4", "Ryzen 5000 series (APU)": "AM4",
    "Ryzen 7000 series": "AM5", "Ryzen 8000 series": "AM5", "Ryzen 8000 series (APU)": "AM5",
    "Ryzen 9000 series": "AM5",
}
# Intel HEDT parts share a generation section with mainstream chips but use a different
# socket. Matched against the model number.
INTEL_HEDT = [
    (re.compile(r"\b9[2-9]\d(X|XE)?\b|\b980X\b|\b975\b|\b965\b|\b960\b|\b950\b|\b940\b|\b930\b|\b920\b"), "LGA 1366"),
    (re.compile(r"\b(3820|3930K|3960X|3970X|4820K|4930K|4960X)\b"), "LGA 2011"),
    (re.compile(r"\b(5820K|5930K|5960X|6800K|6850K|6900K|6950X)\b"), "LGA 2011-3"),
    (re.compile(r"\b(7640X|7740X|7800X|7820X|7900X|7920X|7940X|7960X|7980XE|9800X|9820X|99\d0XE?|109\d0XE?)\b"), "LGA 2066"),
]

MONTHS = {m: i for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}


# ----------------------------------------------------------------------------- cell parsers

def clean(v) -> str | None:
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    s = htmlmod.unescape(str(v))
    s = FOOTNOTE.sub("", s)
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"^(—|–|-)?\s*N/?a\b.*$", "", s, flags=re.I).strip()
    if s in {"", "—", "–", "-", "?", "TBA", "TBD", "Unknown", "Unreleased", "N/A"}:
        return None
    return s


def parse_date(s: str | None) -> tuple[int | None, int | None, int | None, str | None]:
    """-> (year, month, quarter, precision). Handles 'September 17, 2020', 'Sep 2020',
    'Q3 2010', '2008'. A quarter-only date keeps month None; precision says which
    fields are real so nothing downstream mistakes an estimate for a release month."""
    if not s:
        return None, None, None, None
    m = re.search(r"\b([A-Za-z]{3,9})\.?\s+(?:\d{1,2},?\s+)?((?:19|20)\d{2})\b", s)
    if m and m.group(1)[:3].lower() in MONTHS:
        mo = MONTHS[m.group(1)[:3].lower()]
        return int(m.group(2)), mo, (mo + 2) // 3, "month"
    m = re.search(r"\bQ([1-4])\s*((?:19|20)\d{2})\b", s)
    if m:
        return int(m.group(2)), None, int(m.group(1)), "quarter"
    m = re.search(r"\b((?:19|20)\d{2})\b", s)
    if m:
        return int(m.group(1)), None, None, "year"
    return None, None, None, None


NON_USD = re.compile(r"CN¥|¥|RMB|€|£|₹|₩|CAD|AUD", re.I)


def parse_price(s: str | None) -> int | None:
    """First dollar amount in the cell. 'OEM' and blanks -> None. A cell priced in another
    currency ('CN¥16,499 (USD $2,299)') -> None: the dollar figure there is a conversion,
    not a launch MSRP; the raw cell is kept in price_local instead."""
    if not s or NON_USD.search(s):
        return None
    m = re.search(r"\$\s?(\d[\d,]*)", s)
    if m:
        return int(m.group(1).replace(",", ""))
    if re.fullmatch(r"\d[\d,]*", s):          # bare number under a price header
        return int(s.replace(",", ""))
    return None


def parse_first_number(s: str | None) -> float | None:
    if not s:
        return None
    m = re.search(r"\d+(?:\.\d+)?", s.replace(",", ""))
    return float(m.group()) if m else None


def parse_memory_mb(s: str | None, header: str) -> list[int]:
    """Every VRAM capacity the row lists, in MiB (written MB, the graphics-card
    convention), exact so 320 MB stays 320 MB. Unit comes from the cell if present,
    else the header. '256 512 1024' -> [256, 512, 1024]; the first is the base
    configuration and becomes memory_mb, the full list memory_variants_mb."""
    if not s or "shared" in s.lower():
        return []
    mult = 1
    dual = re.match(r"\s*(\d)\s*[×x]\s*(?=\d)", s)      # dual-GPU boards: "2 × 6 GB"
    if dual:
        mult = int(dual.group(1))
        s = s[dual.end():]
    h = header.lower()
    out = []
    for m in re.finditer(r"(\d+(?:\.\d+)?)\s*(GB|GiB|MB|MiB)?", s, flags=re.I):
        n = float(m.group(1)) * mult
        unit = (m.group(2) or "").lower()
        if unit in ("gb", "gib") or (not unit and ("(gb)" in h or "(gib)" in h)):
            out.append(round(n * 1024))
        elif unit in ("mb", "mib") or (not unit and ("(mb)" in h or "(mib)" in h)):
            out.append(round(n))
        else:
            out.append(round(n * 1024) if n < 64 else round(n))   # unlabelled: >=64 must be MB
    return out


def parse_cores(cells: list[str | None]) -> tuple[int | None, int | None]:
    """Sum the first integer of each cores cell (P-core + E-core), threads likewise
    from the parenthesised number."""
    cores = threads = 0
    seen = False
    for s in cells:
        if not s:
            continue
        m = re.match(r"\s*(\d+)\s*(?:\(\s*(\d+)\s*\))?", s)
        if not m:
            continue
        seen = True
        cores += int(m.group(1))
        threads += int(m.group(2)) if m.group(2) else int(m.group(1))
    return (cores, threads) if seen else (None, None)


def gpu_tier(name: str, vendor: str) -> int | None:
    """0-9 from the model number, following each vendor's naming scheme.
    Nvidia: 3-digit (GTX 970, GTX 280) -> second digit; legacy 4-digit 8xxx/9xxx
    (8800, 9600) -> second digit; modern 4-digit (1080, 1650, 2080, 5090) -> third digit.
    AMD: second digit unless it is 0 (RX 9070 -> 7); HD 7970 -> 9, RX 6800 -> 8.
    Titan, Vega 64, Radeon VII carry no number and get no tier (hint hidden)."""
    m = re.search(r"(?<!\d)(\d{3,4})(?!\d)", name)
    if not m:
        return None
    d = m.group(1)
    if vendor == "Nvidia":
        if len(d) == 3 or d[0] in "89":
            return int(d[1])
        return int(d[2])
    return int(d[1]) if d[1] != "0" else int(d[2])


def nvidia_arch(codename: str | None) -> str | None:
    if not codename:
        return None
    c = re.sub(r"^\d\s*[×x]\s*", "", codename.strip())   # dual-GPU "2× GK104"
    for prefix, arch in NVIDIA_ARCH_PREFIX:
        if c.upper().startswith(prefix) and re.match(rf"{prefix}\s?\d", c, re.I):
            return arch
    return None


def amd_arch(cell: str | None) -> str | None:
    """'GCN 1 gen' / 'GCN 4' / 'Terascale 2' / 'RDNA 2 TSMC N6' -> 'GCN 1', 'GCN 4', 'TeraScale 2', 'RDNA 2'."""
    if not cell:
        return None
    m = AMD_ARCH_CELL.search(cell)
    if not m:
        return None
    fam = {"terascale": "TeraScale", "gcn": "GCN", "rdna": "RDNA"}[m.group(1).lower()]
    return f"{fam} {m.group(2)}" if m.group(2) else fam


def cpu_tier(name: str) -> int | None:
    m = re.search(r"(?:Core i|Core Ultra |Ryzen |Ryzen AI )(\d)", name)
    return int(m.group(1)) if m else None


def slug(s: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


# ----------------------------------------------------------------------------- column mapping

def pick(cols: list[str], must: list[str], forbid: list[str] = (), prefer: list[str] = ()) -> str | None:
    """First header containing every `must` word and no `forbid` word; among several,
    the first that also contains a `prefer` word wins."""
    hits = [c for c in cols if all(w in c.lower() for w in must) and not any(w in c.lower() for w in forbid)]
    for w in prefer:
        for c in hits:
            if w in c.lower():
                return c
    return hits[0] if hits else None


def map_columns(cols: list[str], kind: str) -> dict:
    lc = [c.lower() for c in cols]
    m: dict = {}
    m["name"] = [c for c in cols if re.match(r"^(model|processor branding|branding)", c.lower())
                 and "gpu" not in c.lower() and "integrated" not in c.lower()]
    date_col = pick(cols, ["date"], forbid=["price"]) or pick(cols, ["launch"], forbid=["price"])
    m["date"] = date_col
    m["date_price"] = None
    if date_col is None:
        # AMD's newer tables merge the two: "Release Date & Price"
        m["date_price"] = pick(cols, ["release"], prefer=["price"]) or pick(cols, ["launch"])
    m["price"] = pick(cols, ["price"], forbid=["founders"], prefer=["msrp"]) or pick(cols, ["msrp"], forbid=["founders"])
    if m["price"] and m["date_price"] == m["price"]:
        m["price"] = None
    # Titan cards were sold only by Nvidia, so their price sits in the Founders column.
    m["price_alt"] = pick(cols, ["founders"])
    # Prefer a clean max/base column; fall back to a merged "Idle Max" header, whose
    # cells hold two numbers and are read from the right (see rows_from_table).
    m["tdp"] = (pick(cols, ["tdp"], forbid=["idle", "turbo"], prefer=["base", "max"])
                or pick(cols, ["tbp"]) or pick(cols, ["tgp"])
                or pick(cols, ["tdp"], forbid=["turbo"]))
    m["codename"] = pick(cols, ["code name"]) or pick(cols, ["codename"])
    m["arch"] = next((c for c in cols if c.lower().startswith("architecture")), None)
    m["socket"] = pick(cols, ["socket"])
    if kind == "gpu":
        m["memory"] = pick(cols, ["memory", "size"], forbid=["cache", "bandwidth"])
    else:
        m["cores"] = [c for c in cols if "cores" in c.lower() and "config" not in c.lower()]
    return m


# ----------------------------------------------------------------------------- rows -> items

# Whole series sold only to OEMs. GeForce 100 and 300: the Wikipedia section text says
# "All models are OEM only". Radeon HD 8000: per the Radeon HD 8000 series article, the
# desktop line was OEM-only rebrands.
OEM_SERIES = {"GeForce 100 series", "GeForce 300 series", "Radeon HD 8000 series"}
# Guessable but never the answer: re-releases and regional/OEM variants of another row.
NOT_DAILY = re.compile(r"Rev\. ?\d|Mac Edition|\bOEM\b|\bPCI\b|Green Edition|Core 216|\b\d{4} D\b|\bLHR\b", re.I)
DROP_NAME = re.compile(r"xeon|pentium|celeron|nforce|mgpu|\bmodel\b|branding|\bigp\b", re.I)


def rows_from_table(df: pd.DataFrame, src: Source) -> list[dict]:
    cols = list(df.columns)
    cm = map_columns(cols, src.kind)
    if not cm["name"]:
        return []
    items = []
    for _, row in df.iterrows():
        parts = []
        for c in cm["name"]:
            v = clean(row[c])
            if v and v not in parts:
                parts.append(v)
        raw_name = " ".join(parts)
        if not raw_name or DROP_NAME.search(raw_name):
            continue
        if not re.search(r"\d", raw_name) and "titan" not in raw_name.lower() and "vii" not in raw_name.lower():
            continue
        codename = None
        name = raw_name
        # AMD folds the chip codename into the model cell: "Radeon RX 6800 XT (Navi 21)"
        pm = re.search(r"\(([^)]*)\)\s*$", name)
        if pm and src.kind == "gpu":
            codename = pm.group(1).strip()
            name = name[:pm.start()].strip()
        if cm["codename"]:
            codename = clean(row[cm["codename"]]) or codename
        # Intel and Ryzen tables put the family in one cell and the number in the next.
        if src.kind == "cpu":
            name = re.sub(r"\s+", " ", name)
            if src.vendor == "Intel" and not name.startswith("Core"):
                name = "Core " + name
        if src.kind == "gpu" and not re.match(r"(GeForce|Radeon|Titan|Nvidia|ATI)", name, re.I):
            name = ("GeForce " if src.vendor == "Nvidia" else "Radeon ") + name

        date_cell = clean(row[cm["date"]]) if cm["date"] else clean(row[cm["date_price"]]) if cm["date_price"] else None
        year, month, quarter, date_precision = parse_date(date_cell)
        price_cell = clean(row[cm["price"]]) if cm["price"] else date_cell if cm["date_price"] else None
        msrp = parse_price(price_cell)
        if msrp is None and cm.get("price_alt"):
            msrp = parse_price(clean(row[cm["price_alt"]]))
        price_local = price_cell if (price_cell and NON_USD.search(price_cell)) else None
        oem = (bool(price_cell and re.search(r"\bOEM\b", price_cell)) or bool(re.search(r"\bOEM\b", name))
               or src.label in OEM_SERIES)
        tdp_cell = clean(row[cm["tdp"]]) if cm["tdp"] else None
        if cm["tdp"] and "idle" in cm["tdp"].lower() and tdp_cell:
            nums = re.findall(r"\d+(?:\.\d+)?", tdp_cell)
            tdp = float(nums[-1]) if nums else None
        else:
            tdp = parse_first_number(tdp_cell)

        # The source table's column heading for the power figure. Manufacturers use their
        # own terms (Nvidia: "Graphics Card Power"); the game shows it as "Rated power (W)".
        power_column = None
        if cm["tdp"]:
            h = cm["tdp"].lower()
            power_column = ("TBP" if "tbp" in h else "TGP" if "tgp" in h
                            else "base power" if "base" in h else "TDP")
        item = {
            "id": slug(f"{src.vendor} {name}"),
            "type": src.kind,
            "vendor": src.vendor,
            "name": name,
            "series": src.label,
            "year": year,
            "month": month,
            "quarter": quarter,
            "date_precision": date_precision,
            "msrp_usd": msrp,
            "price_local": price_local,
            "power_w": round(tdp) if tdp else None,
            "power_column": power_column,
            "oem": oem,
            "source_section": src.section,
        }
        if src.kind == "gpu":
            mems = parse_memory_mb(clean(row[cm["memory"]]) if cm["memory"] else None, cm["memory"] or "")
            item["memory_mb"] = mems[0] if mems else None
            item["memory_variants_mb"] = mems if len(mems) > 1 else None
            item["tier"] = gpu_tier(name, src.vendor)
            arch_cell = clean(row[cm["arch"]]) if cm["arch"] else None
            item["arch"] = ((nvidia_arch(codename) if src.vendor == "Nvidia" else amd_arch(arch_cell))
                            or GPU_ARCH.get(src.label))
            item["codename"] = codename
        else:
            cores, threads = parse_cores([clean(row[c]) for c in cm["cores"]])
            item["cores"] = cores
            item["threads"] = threads
            item["tier"] = cpu_tier(name)
            socket = (clean(row[cm["socket"]]) if cm["socket"] else None) or CPU_SOCKET.get(src.label)
            if src.vendor == "Intel":
                for rx, sock in INTEL_HEDT:
                    if rx.search(name):
                        socket = sock
                        break
            item["arch"] = socket
        items.append(item)
    return items


def apply_overrides(items: dict[str, dict]) -> None:
    """data/overrides.json: {id: {"fields": {...}, "disputed": [...], "verified": [...],
    "source": "url", "note": "..."}}. Applied after parsing so a rebuild never loses them.
    - fields: hand corrections, each entry citing its source
    - verified: field names the cited source independently confirms
    - disputed: field names with conflicting evidence; the row leaves the daily pool
    Unknown ids are reported, not silently ignored."""
    path = ROOT / "overrides.json"
    if not path.exists():
        return
    for item_id, ov in json.loads(path.read_text()).items():
        if item_id not in items:
            print(f"override for unknown id: {item_id}", file=sys.stderr)
            continue
        it = items[item_id]
        it.update(ov.get("fields", {}))
        it["override_source"] = ov["source"]
        if ov.get("verified"):
            it["verified"] = sorted(ov["verified"])
        if ov.get("disputed"):
            it["disputed"] = sorted(ov["disputed"])


def completeness(it: dict) -> int:
    keys = ["year", "msrp_usd", "power_w", "memory_mb" if it["type"] == "gpu" else "cores"]
    return sum(1 for k in keys if it.get(k) is not None)


def build(refresh: bool) -> None:
    items: dict[str, dict] = {}
    sources: dict[str, dict] = {}
    dropped_no_year = 0
    for src in SOURCES:
        res = fetch_section(src.page, src.section, refresh)
        sources.setdefault(src.page, {"title": res["title"], "revid": res["revid"], "sections": []})
        sources[src.page]["sections"].append(src.label)
        for t in section_tables(res["text"], src.keep_subsections):
            df = read_table(t)
            if df is None:
                continue
            for it in rows_from_table(df, src):
                if it["year"] is None:
                    dropped_no_year += 1
                    continue
                prev = items.get(it["id"])
                # Variant rows (GDDR5 vs DDR4 GT 1010) share an id: keep the fuller one.
                if prev is None or completeness(it) > completeness(prev):
                    items[it["id"]] = it
    apply_overrides(items)
    out = sorted(items.values(), key=lambda x: (x["type"], x["vendor"], x["year"], x["month"] or 0, x["name"]))
    for it in out:
        variant = bool(NOT_DAILY.search(it["name"]))
        it["daily"] = (not it["oem"] and not variant and not it.get("disputed") and it["msrp_usd"] is not None
                       and it["power_w"] is not None
                       and (it.get("memory_mb") if it["type"] == "gpu" else it.get("cores")) is not None)

    payload = {
        "generated": time.strftime("%Y-%m-%d"),
        "license": "CC BY-SA 4.0",
        "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
        "sources": [
            {"title": s["title"], "revid": s["revid"],
             "url": f"https://en.wikipedia.org/w/index.php?title={s['title'].replace(' ', '_')}&oldid={s['revid']}",
             "sections": s["sections"]}
            for s in sources.values()
        ],
        "items": out,
    }
    (ROOT / "items.json").write_text(json.dumps(payload, indent=1, ensure_ascii=False) + "\n")
    write_review(out, dropped_no_year, payload["sources"])


def fmt_mem(mb: int | None) -> str:
    if mb is None:
        return "—"
    return f"{mb // 1024} GB" if mb % 1024 == 0 and mb >= 1024 else f"{mb} MB"


def fmt_date(it: dict) -> str:
    if it["date_precision"] == "month":
        return f"{it['year']}-{it['month']:02d}"
    if it["date_precision"] == "quarter":
        return f"{it['year']} Q{it['quarter']}"
    return str(it["year"])


def write_review(items: list[dict], dropped_no_year: int, sources: list[dict]) -> None:
    import random
    from collections import Counter
    lines = ["# Dataset review sample", "",
             f"Generated {time.strftime('%Y-%m-%d')} by `data/build.py`.", "",
             "Two seeded random samples: 20 rows from the **daily pool** (answers the game can pick) and",
             "10 rows from the **rest** (guessable but never the answer: OEM parts, re-releases, rows",
             "missing a hint). Check each against the linked Wikipedia revision and, where possible, the",
             "manufacturer. A wrong value can come from the parser, from Wikipedia, or from a definition",
             "(announcement vs. availability month, tray vs. boxed price); say which. Parser and",
             "definition problems get fixed in `build.py`; single source errors go in `overrides.json`",
             "with a citation.", "",
             "**What this dataset is.** A faithful extract of pinned Wikipedia revisions plus cited hand",
             "corrections. Unless a row's Status says *verified*, its values are source-only: they match",
             "the revision, and no manufacturer document has been checked for them. The game's hints are",
             "higher/lower comparisons, so it tolerates source-level accuracy; the answer pool excludes",
             "any row with a disputed field.", "",
             "Conventions (full text in `LICENSE.md`): the date is the launch date the table gives, which",
             "is usually availability and occasionally the announcement; cited overrides move known cases",
             "to availability. `date_precision` says whether the month is known; quarter-only dates have",
             "no month. Price is the launch price in whole USD as the table gives it (Intel: 1k-unit tray",
             "price); launches priced in another currency keep the original in `price_local` and no USD",
             "figure. Power is the table's rated figure in whole watts; `power_column` is the table's",
             "column label (TDP, TBP, base power), not the manufacturer's term. Memory is MiB written as",
             "MB, first-listed capacity, with `memory_variants_mb` when the row lists several. Tier is a",
             "digit from the model number, not a performance rank.", ""]
    lines += ["## Coverage", "", "| Slice | Items | Daily pool | Year | Month known | MSRP | Power | Mem/Cores | Tier | Arch |",
              "|---|---|---|---|---|---|---|---|---|---|"]

    def has_memcores(i):
        return (i.get("memory_mb") if i["type"] == "gpu" else i.get("cores")) is not None

    def slice_row(label, sub):
        n = len(sub) or 1
        pct = lambda f: f"{100 * sum(1 for i in sub if f(i)) // n}%"
        return (f"| {label} | {len(sub)} | {sum(1 for i in sub if i['daily'])} | {pct(lambda i: i['year'] is not None)} "
                f"| {pct(lambda i: i['month'] is not None)} | {pct(lambda i: i['msrp_usd'] is not None)} "
                f"| {pct(lambda i: i['power_w'] is not None)} | {pct(has_memcores)} "
                f"| {pct(lambda i: i['tier'] is not None)} | {pct(lambda i: i['arch'] is not None)} |")
    for kind in ("gpu", "cpu"):
        for vendor in ("Nvidia", "AMD", "Intel"):
            sub = [i for i in items if i["type"] == kind and i["vendor"] == vendor]
            if sub:
                lines.append(slice_row(f"{vendor} {kind.upper()}", sub))
    lines.append(slice_row("All", items))
    lines += ["", f"Rows dropped for having no release year: {dropped_no_year}.",
              f"Rows with a hand override from `overrides.json`: {sum(1 for i in items if i.get('override_source'))}; "
              f"with a disputed field (never an answer): {sum(1 for i in items if i.get('disputed'))}; "
              f"priced only in a non-USD currency: {sum(1 for i in items if i.get('price_local'))}.", ""]
    lines += ["## Architecture / socket values", ""]
    for kind in ("gpu", "cpu"):
        c = Counter(i["arch"] for i in items if i["type"] == kind)
        lines.append(f"- {kind.upper()}: " + ", ".join(f"{k} ({v})" for k, v in sorted(c.items(), key=lambda x: str(x[0]))))
    lines += ["", "## Per-series counts", "", "| Series | Items | Daily |", "|---|---|---|"]
    c_all, c_daily = Counter(), Counter()
    for i in items:
        c_all[i["series"]] += 1
        c_daily[i["series"]] += i["daily"]
    for sname in c_all:
        lines.append(f"| {sname} | {c_all[sname]} | {c_daily[sname]} |")

    header = ["| ✓ | Name | Date | MSRP | Power | Mem / Cores (thr) | Tier | Arch / socket | Series | Status |",
              "|---|---|---|---|---|---|---|---|---|---|"]

    def row(i):
        mc = fmt_mem(i["memory_mb"]) if i["type"] == "gpu" else f"{i['cores']} ({i['threads']})"
        price = f"${i['msrp_usd']}" if i["msrp_usd"] is not None else "—"
        power = f"{i['power_w']} W ({i['power_column']})" if i["power_w"] is not None else "—"
        if i["type"] == "gpu" and i.get("memory_variants_mb"):
            mc += " (also " + ", ".join(fmt_mem(m) for m in i["memory_variants_mb"][1:]) + ")"
        if i.get("price_local"):
            price = f"{i['price_local']} (no USD MSRP)"
        flag = " (OEM)" if i["oem"] else ""
        status = ("disputed: " + ", ".join(i["disputed"])) if i.get("disputed") else \
                 ("verified: " + ", ".join(i["verified"])) if i.get("verified") else "source-only"
        return (f"| [ ] | {i['name']}{flag} | {fmt_date(i)} | {price} | {power} | {mc} | "
                f"{i['tier'] if i['tier'] is not None else '—'} | {i['arch'] or '—'} | {i['series']} | {status} |")
    rng = random.Random(42)
    lines += ["", "## Twenty daily-pool rows to hand-check", ""] + header
    lines += [row(i) for i in rng.sample([i for i in items if i["daily"]], 20)]
    lines += ["", "## Ten non-daily rows (check the exclusion is right and the fields are still correct)", ""] + header
    lines += [row(i) for i in rng.sample([i for i in items if not i["daily"]], 10)]
    lines += ["", "## Sources (exact revisions)", ""]
    for src in sources:
        lines.append(f"- [{src['title']}]({src['url']}) revision {src['revid']}")
    (ROOT / "review-sample.md").write_text("\n".join(lines) + "\n")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--inspect", action="store_true")
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()
    if args.inspect:
        inspect(args.refresh)
        return 0
    build(args.refresh)
    d = json.loads((ROOT / "items.json").read_text())
    n = len(d["items"]); nd = sum(1 for i in d["items"] if i["daily"])
    print(f"wrote data/items.json: {n} items, {nd} in the daily pool; data/review-sample.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())

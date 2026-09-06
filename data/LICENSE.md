# Data license and attribution

`items.json` in this folder is a **derived dataset** built from tables on English Wikipedia.
Wikipedia text is licensed under the
[Creative Commons Attribution-ShareAlike 4.0 International license (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
Under the ShareAlike term, this derived dataset is published under the **same license,
CC BY-SA 4.0**. You may copy, adapt, and redistribute it, including commercially, if you
credit the sources below and license your derivative under CC BY-SA 4.0 too.

## Sources

The exact page revisions used for each build are recorded in `items.json` under `sources`
(field `revid`, with a permanent `url`). The pages are:

- [List of Nvidia graphics processing units](https://en.wikipedia.org/wiki/List_of_Nvidia_graphics_processing_units) — desktop GeForce 8 series through GeForce RTX 50 series, and Volta
- [List of AMD graphics processing units](https://en.wikipedia.org/wiki/List_of_AMD_graphics_processing_units) — desktop Radeon HD 2000 series through Radeon RX 9000 series
- [List of Intel Core desktop processors](https://en.wikipedia.org/wiki/List_of_Intel_Core_desktop_processors) — Core 2 through Core Ultra Series 2
- [List of AMD Ryzen processors](https://en.wikipedia.org/wiki/List_of_AMD_Ryzen_processors) — desktop Ryzen 1000 through 9000 series, mainstream sockets only

Each page's contributors are listed in its edit history, reachable from the page links above.

## What was changed, and the conventions used

`build.py` reads the tables through the MediaWiki API, keeps a handful of columns per part,
and normalizes them. No values are invented; a hint is left empty where the table has no
value. Errors in the derived data are ours, not Wikipedia's.

**Verification status.** The dataset is a faithful extract of the pinned revisions plus
cited hand corrections. A row's values are *source-only* unless `verified` lists the fields a
cited manufacturer document confirms. A row with a `disputed` field stays guessable but is
never the daily answer. No claim is made that every specification for every part has been
independently checked.

Conventions:

- **Date.** The launch date the table gives, which on Wikipedia is usually availability
  and occasionally the announcement. Where a cited source shows the two differ, an override
  moves the row to the availability month. `date_precision` is `month`, `quarter`, or
  `year`; a quarter-only source date keeps `month` empty rather than guessing one.
- **Price** (`msrp_usd`). Launch price in whole US dollars as the table gives it. For Intel
  that is the recommended customer price (1,000-unit tray); for Nvidia the MSRP column,
  falling back to the Founders Edition price only where no MSRP exists (Titan cards).
  A part launched in another currency keeps the original figure in `price_local` and has no
  USD price; converted dollar figures are not launch MSRPs. Later price cuts are not tracked.
- **Power** (`power_w`, `power_column`). The table's rated power figure, rounded to whole
  watts. `power_column` is the source table's column label (TDP, TBP, base power), kept so
  the reader knows which figure it is; it is not the manufacturer's own term, which varies
  (Nvidia: "Graphics Card Power"). The game presents it as "rated power".
- **Memory** (`memory_mb`, `memory_variants_mb`). Binary mebibytes written as MB, the
  graphics-card convention (1 GB = 1024 MB here). Where a row lists several capacities, the
  first is `memory_mb` and all of them are `memory_variants_mb`.
- **Cores / threads.** Total cores, so P-cores plus E-cores on hybrid Intel parts.
- **Tier.** A digit taken from the model number (RTX 3070 → 7, Ryzen 5 → 5). It is a naming
  convention, not a performance measurement. Parts without such a number (Titan, Vega 64,
  Core 2) have none.
- **Architecture / socket.** For GPUs, the architecture family per chip: Nvidia from the
  chip codename (GM107 → Maxwell), AMD from the table's architecture column, falling back
  to the series only for the oldest tables. For CPUs, the mainstream socket for the
  generation, with the HEDT sockets corrected by model number.
- **OEM.** A part is flagged `oem` when the table prices it "OEM", names it OEM, or the
  whole series was OEM-only (GeForce 100 and 300 per the section text; Radeon HD 8000 per
  its article). OEM parts are never the daily answer.
- **Overrides.** `overrides.json` holds hand corrections, verifications and disputes, each
  with a citation, applied after parsing so a rebuild keeps them. Affected rows carry
  `override_source`.

- **Extended fields** (added 2026-09-05 for the tools pages; the game does not use them).
  GPUs: `fp32_tflops` (the table's single-precision figure, largest number in the cell where
  a base and boost pair is given, converted from GFLOPS where needed), `bandwidth_gbs` (first
  figure where variants are listed), `bus_width_bit`, `clock_mhz` and `boost_mhz` (core
  clock; boost only where the table gives one), `memory_type` (GDDR6, HBM2 …),
  `transistors_m` (millions), `die_mm2`, `fab_nm` (from a fab column, or TSMC's N-number
  read as its nanometre class), `bus_interface` (the table's text). CPUs: `clock_ghz` and
  `boost_ghz` (P-core figures on hybrid parts; the Ryzen 1000 "PBO" column stands in for
  boost), `cache_mb` with `cache_column` (L3 / Smart Cache, or L2 on Core 2 where that is
  the last-level cache), `power_max_w` (Intel's "Max. Turbo" power where the table has it),
  `igpu` (the integrated graphics model as written). All source-only unless verified.

## Companion datasets in this folder

- **`perf.json`** — Blender rendering scores, derived from
  [Blender Open Data](https://opendata.blender.org/) (Blender Foundation), whose results are
  released under **CC0 1.0** (the LICENSE.txt inside each snapshot). No attribution is
  required; it is given anyway. `blender_perf.py` documents the method: median of the summed
  samples-per-minute over the three benchmark scenes, single-device runs only, grouped by
  Blender major version, at least five runs per device. The join to `items.json` is by
  normalised device name plus the hand map in `perf-overrides.json`. **A Blender score is a
  rendering score.** It is not a gaming benchmark and must never be presented as one.
- **`cpi.json`** — calendar-year averages of the Consumer Price Index for All Urban
  Consumers (CPIAUCSL), a work of the U.S. Bureau of Labor Statistics served by FRED (Federal
  Reserve Bank of St. Louis): **public domain**. "Launch price in today's dollars" divides
  the latest year's average by the launch year's average; the latest year is usually partial
  and `latest_months` says by how much.

Because `perf.json` and `cpi.json` are not derived from Wikipedia, they are not under the
ShareAlike obligation; both are published here under the same terms as their sources (CC0
and public domain respectively).

## Not included, on purpose

Performance scores from PassMark, 3DMark, UserBenchmark, Geekbench or review sites, TechPowerUp
database fields, product photos, box art, and die shots. Those are proprietary or of unclear
license. The only performance figure here is the CC0 Blender score above.

## Trademarks

GeForce, RTX, and Nvidia are trademarks of Nvidia Corporation. Radeon and Ryzen are
trademarks of Advanced Micro Devices, Inc. Intel and Intel Core are trademarks of Intel
Corporation. Specdle is not affiliated with or endorsed by any of them; names appear only to
identify the products.

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
value. Errors in the derived data are ours, not Wikipedia's. Conventions:

- **Date.** As listed by Wikipedia, which is usually the launch or availability date but is
  sometimes the announcement. `date_precision` is `month`, `quarter`, or `year`; a
  quarter-only source date keeps `month` empty rather than guessing one.
- **Price** (`msrp_usd`). Launch price in whole US dollars as the table gives it. For Intel
  that is the recommended customer price (1,000-unit tray); for Nvidia the MSRP column,
  falling back to the Founders Edition price only where no MSRP exists (Titan cards).
  Later price cuts are not tracked.
- **Power** (`power_w`, `power_kind`). The manufacturer's rated figure, rounded to whole
  watts. Its name changed over time: TDP for older parts, TBP (typical board power) for
  recent Radeons, base power for Intel 12th gen and later. `power_kind` says which.
- **Memory** (`memory_mb`). Exact megabytes, binary (1 GB = 1024 MB). Where a table lists
  several capacities in one row, the first (base) configuration is used.
- **Cores / threads.** Total cores, so P-cores plus E-cores on hybrid Intel parts.
- **Tier.** A digit taken from the model number (RTX 3070 → 7, Ryzen 5 → 5). It is a naming
  convention, not a performance measurement. Parts without such a number (Titan, Vega 64,
  Core 2) have none.
- **Architecture / socket.** For GPUs, the architecture family per chip: Nvidia from the
  chip codename (GM107 → Maxwell), AMD from the table's architecture column, falling back
  to the series only for the oldest tables. For CPUs, the mainstream socket for the
  generation, with the HEDT sockets corrected by model number.
- **Overrides.** `overrides.json` holds hand corrections with a citation, applied after
  parsing so a rebuild keeps them. Each affected row carries `override_source`.

## Not included, on purpose

Performance scores (PassMark, 3DMark, UserBenchmark), TechPowerUp database fields, product
photos, box art, and die shots. Those are proprietary or of unclear license, and the game
does not use them.

## Trademarks

GeForce, RTX, and Nvidia are trademarks of Nvidia Corporation. Radeon and Ryzen are
trademarks of Advanced Micro Devices, Inc. Intel and Intel Core are trademarks of Intel
Corporation. Specdle is not affiliated with or endorsed by any of them; names appear only to
identify the products.

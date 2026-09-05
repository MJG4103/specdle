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

## What was changed

`build.py` reads the tables through the MediaWiki API, keeps a handful of columns per part
(name, release date, launch price, TDP, memory or core count, architecture or socket),
normalizes units (memory to gigabytes, prices to whole US dollars), derives a "tier" digit
from the model number, and drops parts with no release date. No values are invented; a hint
is left empty where the table has no value. Errors in the derived data are ours, not
Wikipedia's.

## Not included, on purpose

Performance scores (PassMark, 3DMark, UserBenchmark), TechPowerUp database fields, product
photos, box art, and die shots. Those are proprietary or of unclear license, and the game
does not use them.

## Trademarks

GeForce, RTX, and Nvidia are trademarks of Nvidia Corporation. Radeon and Ryzen are
trademarks of Advanced Micro Devices, Inc. Intel and Intel Core are trademarks of Intel
Corporation. Specdle is not affiliated with or endorsed by any of them; names appear only to
identify the products.

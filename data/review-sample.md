# Dataset review sample

Generated 2026-09-05 by `data/build.py`.

Two seeded random samples: 20 rows from the **daily pool** (answers the game can pick) and
10 rows from the **rest** (guessable but never the answer: OEM parts, re-releases, rows
missing a hint). Check each against the linked Wikipedia revision and, where possible, the
manufacturer. A wrong value can come from the parser, from Wikipedia, or from a definition
(announcement vs. availability month, tray vs. boxed price); say which. Parser and
definition problems get fixed in `build.py`; single source errors go in `overrides.json`
with a citation.

Conventions: dates are as Wikipedia lists them, with `date_precision` saying whether the
month is known; quarter-only dates have no month. Price is the launch price in whole USD.
Power is the manufacturer's rated figure (`power_kind`: TDP, TBP, TGP or base power),
rounded to whole watts. Memory is exact MB (1 GB = 1024 MB). Tier is a digit taken from
the model number, not a performance rank. Architecture is per chip for GPUs and the
socket for CPUs.

## Coverage

| Slice | Items | Daily pool | Year | Month known | MSRP | Power | Mem/Cores | Tier | Arch |
|---|---|---|---|---|---|---|---|---|---|
| Nvidia GPU | 267 | 146 | 100% | 99% | 64% | 97% | 98% | 97% | 100% |
| AMD GPU | 202 | 122 | 100% | 99% | 60% | 98% | 100% | 96% | 100% |
| AMD CPU | 143 | 78 | 100% | 97% | 54% | 99% | 100% | 98% | 100% |
| Intel CPU | 469 | 446 | 100% | 98% | 95% | 100% | 100% | 88% | 100% |
| All | 1081 | 792 | 100% | 98% | 75% | 98% | 99% | 93% | 100% |

Rows dropped for having no release year: 17.
Rows with a hand override from `overrides.json`: 1.

## Architecture / socket values

- GPU: Ada Lovelace (12), Ampere (16), Blackwell (10), Fermi (51), GCN 1 (44), GCN 2 (12), GCN 3 (7), GCN 4 (17), GCN 5 (4), Kepler (39), Maxwell (12), Pascal (16), RDNA (9), RDNA 2 (15), RDNA 3 (10), RDNA 4 (6), TeraScale (39), TeraScale 2 (35), TeraScale 3 (4), Tesla (96), Turing (14), Volta (1)
- CPU: AM4 (95), AM5 (48), LGA 1150 (58), LGA 1151 (81), LGA 1155 (57), LGA 1156 (19), LGA 1200 (58), LGA 1366 (11), LGA 1700 (78), LGA 1851 (20), LGA 2011 (7), LGA 2011-3 (7), LGA 2066 (21), LGA 771 (1), LGA 775 (51)

## Per-series counts

| Series | Items | Daily |
|---|---|---|
| Ryzen 1000 series | 15 | 9 |
| Ryzen 2000 series (APU) | 5 | 2 |
| Ryzen 2000 series | 10 | 6 |
| Ryzen 3000 series (APU) | 9 | 2 |
| Ryzen 3000 series | 14 | 11 |
| Ryzen 4000 series (APU) | 6 | 1 |
| Ryzen 5000 series | 23 | 15 |
| Ryzen 4000 series | 5 | 2 |
| Ryzen 5000 series (APU) | 8 | 4 |
| Ryzen 7000 series | 19 | 13 |
| Ryzen 8000 series (APU) | 8 | 4 |
| Ryzen 8000 series | 2 | 0 |
| Ryzen 9000 series | 19 | 9 |
| Core 2 | 52 | 50 |
| Core i 1st gen | 30 | 30 |
| Core i 2nd gen | 26 | 26 |
| Core i 3rd gen | 35 | 35 |
| Core i 4th gen | 56 | 52 |
| Core i 5th gen | 8 | 5 |
| Core i 6th gen | 24 | 21 |
| Core i 7th gen | 25 | 25 |
| Core i 8th gen | 17 | 17 |
| Core i 9th gen | 36 | 35 |
| Core i 10th gen | 39 | 38 |
| Core i 11th gen | 23 | 19 |
| Core i 12th gen | 26 | 25 |
| Core i 13th gen | 25 | 23 |
| Core i 14th gen | 27 | 25 |
| Core Ultra Series 2 | 20 | 20 |
| Radeon HD 2000 series | 8 | 7 |
| Radeon HD 3000 series | 14 | 5 |
| Radeon HD 4000 series | 17 | 8 |
| Radeon HD 5000 series | 12 | 9 |
| Radeon HD 6000 series | 13 | 11 |
| Radeon HD 7000 series | 18 | 12 |
| Radeon HD 8000 series | 13 | 0 |
| Radeon 200 series | 20 | 15 |
| Radeon 300 series | 18 | 11 |
| Radeon 400 series | 10 | 3 |
| Radeon 500 series | 15 | 7 |
| Radeon RX Vega series | 3 | 3 |
| Radeon VII series | 1 | 1 |
| Radeon RX 5000 series | 9 | 5 |
| Radeon RX 6000 series | 15 | 13 |
| Radeon RX 7000 series | 10 | 8 |
| Radeon RX 9000 series | 6 | 4 |
| GeForce 8 series | 25 | 10 |
| GeForce 9 series | 29 | 7 |
| GeForce 200 series | 27 | 13 |
| GeForce 100 series | 7 | 0 |
| GeForce 300 series | 5 | 0 |
| GeForce 400 series | 22 | 11 |
| GeForce 500 series | 21 | 11 |
| GeForce 600 series | 29 | 12 |
| GeForce 700 series | 24 | 14 |
| GeForce 900 series | 9 | 7 |
| GeForce 10 series | 16 | 13 |
| Volta | 1 | 1 |
| GeForce RTX 20 series | 8 | 8 |
| GeForce GTX 16 series | 6 | 6 |
| GeForce RTX 30 series | 16 | 14 |
| GeForce RTX 40 series | 12 | 11 |
| GeForce RTX 50 series | 10 | 8 |

## Twenty daily-pool rows to hand-check

| ✓ | Name | Date | MSRP | Power | Mem / Cores (thr) | Tier | Arch / socket | Series |
|---|---|---|---|---|---|---|---|---|
| [ ] | GeForce 8800 GTS Core 112 | 2007-11 | $399 | 150 W TDP | 640 MB | 8 | Tesla | GeForce 8 series |
| [ ] | Core 2 Quad Q9400 | 2008-08 | $266 | 95 W TDP | 4 (4) | — | LGA 775 | Core 2 |
| [ ] | Ryzen 3 3300X | 2020-04 | $119 | 65 W TDP | 4 (8) | 3 | AM4 | Ryzen 3000 series |
| [ ] | GeForce RTX 3090 | 2020-09 | $1499 | 350 W TDP | 24 GB | 9 | Ampere | GeForce RTX 30 series |
| [ ] | Core i3 6300T | 2015-09 | $138 | 35 W TDP | 2 (4) | 3 | LGA 1151 | Core i 6th gen |
| [ ] | Core i5 4460 | 2014-05 | $182 | 84 W TDP | 4 (4) | 5 | LGA 1150 | Core i 4th gen |
| [ ] | Core i7 4770K | 2013-06 | $350 | 84 W TDP | 4 (8) | 7 | LGA 1150 | Core i 4th gen |
| [ ] | Core i5 670 | 2010-01 | $284 | 73 W TDP | 2 (4) | 5 | LGA 1156 | Core i 1st gen |
| [ ] | GeForce RTX 2070 SUPER | 2019-07 | $499 | 215 W TDP | 8 GB | 7 | Turing | GeForce RTX 20 series |
| [ ] | Core 2 Extreme QX9770 | 2008-03 | $1399 | 136 W TDP | 4 (4) | — | LGA 775 | Core 2 |
| [ ] | GeForce GT 520 | 2011-04 | $59 | 29 W TDP | 1 GB | 2 | Fermi | GeForce 500 series |
| [ ] | GeForce RTX 3080 | 2020-09 | $699 | 320 W TDP | 10 GB | 8 | Ampere | GeForce RTX 30 series |
| [ ] | Radeon HD 6350 | 2011-04 | $23 | 19 W TDP | 512 MB | 3 | TeraScale 2 | Radeon HD 6000 series |
| [ ] | Core 2 Extreme QX6800 | 2007-04 | $1199 | 130 W TDP | 4 (4) | — | LGA 775 | Core 2 |
| [ ] | Radeon RX 470 | 2016-08 | $179 | 120 W TBP | 4 GB | 7 | GCN 4 | Radeon 400 series |
| [ ] | Core i5 12600KF | 2021-11 | $264 | 125 W base power | 10 (16) | 5 | LGA 1700 | Core i 12th gen |
| [ ] | Ryzen 7 5800X | 2020-11 | $449 | 105 W TDP | 8 (16) | 7 | AM4 | Ryzen 5000 series |
| [ ] | Ryzen 9 3900XT | 2020-07 | $499 | 105 W TDP | 12 (24) | 9 | AM4 | Ryzen 3000 series |
| [ ] | Core 2 Extreme QX6850 | 2007-07 | $999 | 130 W TDP | 4 (4) | — | LGA 775 | Core 2 |
| [ ] | Core i5 4670K | 2013-06 | $242 | 84 W TDP | 4 (4) | 5 | LGA 1150 | Core i 4th gen |

## Ten non-daily rows (check the exclusion is right and the fields are still correct)

| ✓ | Name | Date | MSRP | Power | Mem / Cores (thr) | Tier | Arch / socket | Series |
|---|---|---|---|---|---|---|---|---|
| [ ] | Radeon HD 8470 | 2013-01 | — | 35 W TDP | 1 GB | 4 | TeraScale 2 | Radeon HD 8000 series |
| [ ] | GeForce GTX 660 OEM (OEM) | 2012-08 | — | 130 W TDP | 1536 MB | 6 | Kepler | GeForce 600 series |
| [ ] | Ryzen 3 3200GE (OEM) | 2019-07 | — | 35 W TDP | 4 (4) | 3 | AM4 | Ryzen 3000 series (APU) |
| [ ] | GeForce RTX 5090 D | 2025-01 | $2299 | 575 W TDP | 32 GB | 9 | Blackwell | GeForce RTX 50 series |
| [ ] | Radeon HD 4730 | 2009-06 | — | 110 W TDP | 512 MB | 7 | TeraScale | Radeon HD 4000 series |
| [ ] | GeForce GTX 950 OEM (OEM) | 2016 | — | — | 2 GB | 5 | Maxwell | GeForce 900 series |
| [ ] | GeForce GTS 240 OEM (OEM) | 2009-07 | — | 120 W TDP | 1 GB | 4 | Tesla | GeForce 200 series |
| [ ] | Radeon HD 7350 (OEM) | 2012-01 | — | 19 W TDP | 256 MB | 3 | TeraScale 2 | Radeon HD 7000 series |
| [ ] | GeForce GT 415 OEM (OEM) | 2010-09 | — | 32 W TDP | 512 MB | 1 | Tesla | GeForce 400 series |
| [ ] | Radeon R9 370 (OEM) | 2015-05 | — | 150 W TBP | 2 GB | 7 | GCN 1 | Radeon 300 series |

## Sources (exact revisions)

- [List of Nvidia graphics processing units](https://en.wikipedia.org/w/index.php?title=List_of_Nvidia_graphics_processing_units&oldid=1373210001) revision 1373210001
- [List of AMD graphics processing units](https://en.wikipedia.org/w/index.php?title=List_of_AMD_graphics_processing_units&oldid=1364362273) revision 1364362273
- [List of AMD Ryzen processors](https://en.wikipedia.org/w/index.php?title=List_of_AMD_Ryzen_processors&oldid=1371600057) revision 1371600057
- [List of Intel Core desktop processors](https://en.wikipedia.org/w/index.php?title=List_of_Intel_Core_desktop_processors&oldid=1371607091) revision 1371607091

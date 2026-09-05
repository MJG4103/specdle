# Dataset review sample

Generated 2026-09-05 by `data/build.py`. Twenty rows chosen at random
(fixed seed) for hand-checking against the Wikipedia tables. Tick each row after checking;
a wrong value means a parser bug, not a one-off fix, so note what was wrong.

## Coverage

| Slice | Items | Daily pool | Year | MSRP | TDP | Mem/Cores | Tier |
|---|---|---|---|---|---|---|---|
| Nvidia GPU | 267 | 146 | 100% | 64% | 97% | 98% | 97% |
| AMD GPU | 202 | 122 | 100% | 60% | 98% | 100% | 96% |
| AMD CPU | 143 | 78 | 100% | 54% | 99% | 100% | 98% |
| Intel CPU | 469 | 446 | 100% | 95% | 100% | 100% | 88% |
| All | 1081 | 792 | 100% | 75% | 98% | 56% | 93% |

Rows dropped for having no release year: 17

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

## Twenty rows to hand-check

| ✓ | Name | Year-Mo | MSRP | TDP W | Mem GB / Cores (thr) | Tier | Arch / socket | Series |
|---|---|---|---|---|---|---|---|---|
| [ ] | GeForce 8800 GTS Core 112 | 2007-11 | $399 | 150 | 0.625 GB | 8 | Tesla | GeForce 8 series |
| [ ] | Core 2 Quad Q9400 | 2008-8 | $266 | 95 | 4 (4) | None | LGA 775 | Core 2 |
| [ ] | Ryzen 3 3100 | 2020-4 | $99 | 65 | 4 (8) | 3 | AM4 | Ryzen 3000 series |
| [ ] | GeForce RTX 3090 | 2020-9 | $1499 | 350 | 24.0 GB | 9 | Ampere | GeForce RTX 30 series |
| [ ] | Core i3 6300T | 2015-9 | $138 | 35 | 2 (4) | 3 | LGA 1151 | Core i 6th gen |
| [ ] | Core i5 4460 | 2014-5 | $182 | 84 | 4 (4) | 5 | LGA 1150 | Core i 4th gen |
| [ ] | Core i7 4770K | 2013-6 | $350 | 84 | 4 (8) | 7 | LGA 1150 | Core i 4th gen |
| [ ] | Core i5 670 | 2010-1 | $284 | 73 | 2 (4) | 5 | LGA 1156 | Core i 1st gen |
| [ ] | GeForce RTX 2070 SUPER | 2019-7 | $499 | 215 | 8.0 GB | 7 | Turing | GeForce RTX 20 series |
| [ ] | Core 2 Extreme QX9770 | 2008-3 | $1399 | 136 | 4 (4) | None | LGA 775 | Core 2 |
| [ ] | GeForce GT 520 | 2011-4 | $59 | 29 | 1.0 GB | 2 | Fermi | GeForce 500 series |
| [ ] | GeForce RTX 3080 | 2020-9 | $699 | 320 | 10.0 GB | 8 | Ampere | GeForce RTX 30 series |
| [ ] | Radeon HD 6350 | 2011-4 | $23 | 19 | 0.5 GB | 3 | TeraScale 2/3 | Radeon HD 6000 series |
| [ ] | Core 2 Extreme QX6800 | 2007-4 | $1199 | 130 | 4 (4) | None | LGA 775 | Core 2 |
| [ ] | Radeon RX 470 | 2016-8 | $179 | 120 | 4.0 GB | 7 | Polaris | Radeon 400 series |
| [ ] | Core i5 12600KF | 2021-11 | $264 | 125 | 10 (16) | 5 | LGA 1700 | Core i 12th gen |
| [ ] | Ryzen 7 5800X | 2020-11 | $449 | 105 | 8 (16) | 7 | AM4 | Ryzen 5000 series |
| [ ] | Ryzen 9 3900XT | 2020-7 | $499 | 105 | 12 (24) | 9 | AM4 | Ryzen 3000 series |
| [ ] | Core 2 Extreme QX6850 | 2007-7 | $999 | 130 | 4 (4) | None | LGA 775 | Core 2 |
| [ ] | Core i5 4670K | 2013-6 | $242 | 84 | 4 (4) | 5 | LGA 1150 | Core i 4th gen |

## Sources (exact revisions)

- [List of Nvidia graphics processing units](https://en.wikipedia.org/w/index.php?title=List_of_Nvidia_graphics_processing_units&oldid=1373210001) revision 1373210001
- [List of AMD graphics processing units](https://en.wikipedia.org/w/index.php?title=List_of_AMD_graphics_processing_units&oldid=1364362273) revision 1364362273
- [List of AMD Ryzen processors](https://en.wikipedia.org/w/index.php?title=List_of_AMD_Ryzen_processors&oldid=1371600057) revision 1371600057
- [List of Intel Core desktop processors](https://en.wikipedia.org/w/index.php?title=List_of_Intel_Core_desktop_processors&oldid=1371607091) revision 1371607091

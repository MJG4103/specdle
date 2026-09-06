# Performance join review

Generated 2026-09-05 by `data/blender_perf.py` from the Blender Open Data snapshot of 2026-09-06 (428307 submissions, 339893 complete runs). Primary Blender major: **4.x**; runs by major: 3.x 136331, 4.x 179891, 5.x 23671.

The score is a **Blender rendering score** (samples/minute over three scenes). Check the sample rows
against opendata.blender.org's own device page: the median there should match within a few percent
(they include multi-device runs and all versions; we don't). A wrong join is a naming problem: fix
it in `perf-overrides.json` (Blender device string -> item id, or null to ignore).

## Coverage

| Slice | Parts | With a score | Share |
|---|---|---|---|
| Nvidia GPU, all | 267 | 69 | 25% |
| Nvidia GPU, 2016+ | 66 | 53 | 80% |
| AMD GPU, all | 202 | 34 | 16% |
| AMD GPU, 2016+ | 51 | 34 | 66% |
| AMD CPU, all | 143 | 78 | 54% |
| AMD CPU, 2017+ | 88 | 70 | 79% |
| Intel CPU, all | 469 | 212 | 45% |
| Intel CPU, 2017+ | 236 | 151 | 63% |
| Daily pool, all | 790 | 373 | 47% |

## Twenty joined rows to hand-check

| ✓ | Part | Year | MSRP | Blender device string | Backend | Median | p25–p75 | Runs |
|---|---|---|---|---|---|---|---|---|
| [ ] | GeForce GT 740 | 2014 | $89 | GeForce GT 740 | CUDA | 40.4 | 38.7–40.8 | 23 |
| [ ] | Ryzen 5 5600GT | 2024 | $140 | AMD Ryzen 5 5600GT with Radeon Graphics | CPU | 139.6 | 134.3–149.3 | 72 |
| [ ] | Radeon RX 6700 XT | 2021 | $479 | AMD Radeon RX 6700 XT | HIP | 1545.5 | 1462.3–1604.3 | 538 |
| [ ] | GeForce RTX 4090 D | 2023 | — | NVIDIA GeForce RTX 4090 D | OPTIX | 10629.3 | 10203.4–11001.1 | 24 |
| [ ] | Core i5 11400 | 2021 | $182 | 11th Gen Intel Core i5-11400 @ 2.60GHz | CPU | 125.7 | 111.8–136.3 | 57 |
| [ ] | Core i3 4130 | 2013 | $122 | Intel Core i3-4130 CPU @ 3.40GHz | CPU | 23.4 | 17.3–25.2 | 61 |
| [ ] | Core i3 10105 | 2021 | $122 | Intel Core i3-10105 CPU @ 3.70GHz | CPU | 72.0 | 66.8–79.0 | 10 |
| [ ] | Ryzen 7 1700 | 2017 | $329 | AMD Ryzen 7 1700 Eight-Core Processor | CPU | 115.8 | 109.8–123.4 | 62 |
| [ ] | GeForce RTX 4080 Super | 2024 | $999 | NVIDIA GeForce RTX 4080 SUPER | OPTIX | 8414.7 | 8166.3–8640.3 | 1891 |
| [ ] | Ryzen 5 5500 | 2022 | $159 | AMD Ryzen 5 5500 | CPU | 132.9 | 125.8–139.0 | 372 |
| [ ] | GeForce GTX 950 | 2015 | $159 | NVIDIA GeForce GTX 950 | OPTIX | 115.6 | 111.9–120.6 | 17 |
| [ ] | Core i9 11900K | 2021 | $539 | 11th Gen Intel Core i9-11900K @ 3.50GHz | CPU | 203.6 | 185.9–217.8 | 132 |
| [ ] | Ryzen 5 3400G | 2019 | $149 | AMD Ryzen 5 3400G with Radeon Vega Graphics | CPU | 66.0 | 61.0–69.9 | 79 |
| [ ] | Core i9 9820X | 2018 | $889 | Intel Core i9-9820X CPU @ 3.30GHz | CPU | 183.7 | 181.8–197.1 | 9 |
| [ ] | Core i7 12700K | 2021 | $409 | 12th Gen Intel Core i7-12700K | CPU | 279.8 | 262.3–294.3 | 539 |
| [ ] | Radeon RX 6800 | 2020 | $579 | AMD Radeon RX 6800 | HIP | 1953.8 | 1858.9–2020.4 | 318 |
| [ ] | Radeon RX 6750 XT | 2022 | $549 | AMD Radeon RX 6750 XT | HIP | 1632.2 | 1552.6–1690.9 | 263 |
| [ ] | Ryzen 5 3600 | 2019 | $199 | AMD Ryzen 5 3600 6-Core Processor | CPU | 128.6 | 118.6–136.1 | 831 |
| [ ] | Ryzen 9 9950X3D | 2025 | $699 | AMD Ryzen 9 9950X3D 16-Core Processor | CPU | 642.9 | 612.8–696.6 | 2090 |
| [ ] | Core i3 13100F | 2023 | $109 | 13th Gen Intel Core i3-13100F | CPU | 104.6 | 103.6–107.0 | 5 |

## Unmatched desktop device strings with the most runs (candidates for `perf-overrides.json`)

| Runs | Backend | Blender device string |
|---|---|---|
| 842 | HIP | AMD Radeon(TM) Graphics |
| 611 | CPU | Apple M4 |
| 609 | CPU | Apple M1 |
| 566 | CPU | Apple M4 Pro |
| 507 | ONEAPI | Intel(R) Arc(TM) A750 Graphics |
| 450 | CPU | Apple M2 |
| 444 | METAL | Apple M4 (GPU - 10 cores) |
| 440 | CPU | Apple M3 Max |
| 411 | METAL | Apple M3 Max (GPU - 40 cores) |
| 404 | CPU | Apple M1 Pro |
| 403 | CPU | Apple M4 Max |
| 395 | METAL | Apple M4 Max (GPU - 40 cores) |
| 361 | ONEAPI | Intel(R) Arc(TM) A770 Graphics |
| 359 | METAL | Apple M4 Pro (GPU - 20 cores) |
| 347 | CPU | Apple M1 Max |
| 326 | CPU | Apple M3 Pro |
| 302 | METAL | Apple M1 Max (GPU - 32 cores) |
| 295 | ONEAPI | Intel(R) Arc(TM) B580 Graphics |
| 268 | CPU | Apple M3 |
| 259 | METAL | Apple M1 Pro (GPU - 16 cores) |
| 253 | CPU | AMD Ryzen Threadripper 7980X 64-Cores |
| 251 | METAL | Apple M4 Pro (GPU - 16 cores) |
| 241 | OPTIX | NVIDIA RTX PRO 6000 Blackwell Workstation Edition |
| 229 | OPTIX | NVIDIA RTX A4000 |
| 229 | CPU | Apple M2 Max |
| 227 | CPU | Apple M2 Pro |
| 221 | ONEAPI | Intel(R) Arc(TM) Graphics |
| 216 | HIP | AMD Radeon Graphics |
| 209 | METAL | Apple M3 Pro (GPU - 18 cores) |
| 203 | CPU | AMD Ryzen AI 9 HX 370 w/ Radeon 890M |
| 196 | METAL | Apple M3 Max (GPU - 30 cores) |
| 191 | CPU | AMD Ryzen Threadripper 7970X 32-Cores |
| 190 | OPTIX | NVIDIA GeForce RTX 2050 |
| 178 | METAL | Apple M3 Pro (GPU - 14 cores) |
| 164 | CPU | Intel Xeon CPU E5-2680 v4 @ 2.40GHz |
| 162 | METAL | Apple M1 (GPU - 8 cores) |
| 161 | METAL | Apple M4 Max (GPU - 32 cores) |
| 156 | METAL | Apple M1 Max (GPU - 24 cores) |
| 155 | METAL | Apple M3 (GPU - 10 cores) |
| 154 | ONEAPI | Intel(R) Graphics |

Devices with a median in the primary major: 1443; laptop/mobile variants among them: 361 (kept in `perf.json` → `devices`, never joined to a desktop part).

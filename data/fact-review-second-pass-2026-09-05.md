# Second fact-check of review-sample.md

**Verdict: improved, but not ready to describe as fully fact-checked.** There are still a confirmed price error, a currency/price-definition error, misleading power labels, inconsistent date conventions, and unresolved historical specifications.

Reviewed September 5, 2026. This review applies to the updated document containing 20 daily and 10 non-daily rows. Its SHA-256 at review time was `69c824edeb2be98a89fa56982140ca74319ba30db0c7aa6b3e6e07721b2f548d`.

The instructions inside the document were treated as content, not as user authorization to change the dataset. This review leaves the input document, builder, overrides, and items unchanged.

## Issues that prevent a clean factual sign-off

### 1. Ryzen 3 3300X: price is wrong; date needs correction or explicit qualification

The sample lists **2020-04, $119**. AMD's announcement specifies **$120** and **May 2020 availability**. April 21 is the announcement date. The 4-core/8-thread, 65 W and AM4 values agree with AMD.

Use **2020-05 and $120** if the field represents availability. If announcement dates are intentional, label the field accordingly rather than mixing them with retail dates. [AMD's original announcement](https://www.amd.com/en/newsroom/press-releases/2020-4-21-amd-expands-3rd-gen-amd-ryzen-desktop-processor-fa.html).

Cause: the cached Wikipedia row contains April and $119, and the builder preserves them. The existing override corrects only the Ryzen 3 3100. Its note says the convention is availability month, whereas the report says dates follow Wikipedia. Those two conventions conflict.

### 2. RTX 5090 D: $2,299 is not its official USD launch MSRP

NVIDIA announced the original RTX 5090 D for January 30, 2025 at **RMB 16,499**. The cached Wikipedia cell is `CN¥16,499 (USD $2,299)`. The parser extracts the dollar conversion and drops the original currency and its context.

The January date is supported. The price should be **CNY 16,499**, with any USD equivalent separately marked approximate and accompanied by an exchange-rate date. If the schema requires an official USD MSRP, leave that field unknown. Do not confuse this original 32 GB model with the later 24 GB D v2. [NVIDIA's original Chinese launch announcement](https://www.nvidia.cn/geforce/news/rtx-50-series-graphics-cards-gpu-laptop-announcements/).

### 3. Several NVIDIA power labels do not match the manufacturer's terminology

The report labels the RTX 3090's 350 W, RTX 3080's 320 W, and RTX 2070 SUPER's 215 W as **TDP**. NVIDIA lists these as **Graphics Card Power**. Likewise, the GTX 660 OEM's 130 W is **Maximum Graphics Card Power**. The numeric values are supported; the labels misstate what was independently verified.

Preserve the manufacturer's measurement name, or explicitly document a justified normalization. The current code derives `power_kind` from Wikipedia's column header, so the document's claim that this is the manufacturer's rated power type is too strong. [RTX 3090 specifications](https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090-3090ti/), [NVIDIA comparison tables](https://www.nvidia.com/en-us/geforce/graphics-cards/compare/), [GTX 660 OEM specifications](https://www.nvidia.com/en-us/geforce/graphics-cards/geforce-gtx-660-oem/specifications/).

### 4. Radeon HD 6350 still cannot be signed off

The architecture correction to **TeraScale 2** now matches the cached per-model source. However:

- April 2011 remains in the file, while a contemporaneous NRDC submission lists February 7, 2011. Treat the month as disputed until the exact product/release event is resolved. [NRDC submission](https://efiling.energy.ca.gov/GetDocument.aspx?DocumentContentId=7743&tn=70852).
- I still have not established a manufacturer launch MSRP of **$23**. Repeated database entries do not independently establish it.
- The cached table gives **19.1 W**, rounded to 19 W. An indexed HP specification sheet gives **19.9 W maximum power consumption** for its HD 6350 card. This may be a board-variant difference, so do not blindly substitute 20 W for every HD 6350. The HP PDF could not be fully fetched in this pass; its indexed text is a reason for further verification, not a universal correction. [HP specification sheet mirror](https://cdn.cnetcontent.com/77/6c/776cb7a6-6e81-40c2-8fcd-3f2d5b9468ca.pdf).

For a strict fact-checked answer pool, quarantine disputed fields or the row pending evidence.

### 5. Variant and pricing conventions are still underspecified

NVIDIA explicitly lists **1.5 GB and 3 GB** GTX 660 OEM configurations. The sample's 1,536 MB is a valid configuration, but should not be interpreted as the only one. The cached HD 7350 row lists 256 and 512 MiB; HP documents a 512 MB board. Similar variant qualification applies to the 10 GB RTX 3080 and 4 GB RX 470. [NVIDIA GTX 660 OEM](https://www.nvidia.com/en-us/geforce/graphics-cards/geforce-gtx-660-oem/specifications/), [HP service manual](https://h10032.www1.hp.com/ctg/Manual/c03550750.pdf).

The i7-4770K's $350 is **not proven wrong**: archived Intel specifications give $339–$350. The dataset needs a consistent distinction between boxed prices, tray/quantity prices, and retail launch prices. [Archived Intel specifications](https://elektronikjk.com/elementy_czynne/IC/INTEL-CORE-I7-4770K.pdf).

The memory conversion is now explicit and preserves 640 MB correctly. For formal unit precision, write GiB/MiB for binary units, or state that GB/MB follows conventional graphics-card marketing notation; the SI unit identity is not literally 1 GB = 1,024 MB.

## Checks that passed

I reconstructed all **1,081 stored records** from the cached source sections and applied the existing overrides in memory. No reconstructed field differed from `items.json`. I regenerated the report in a temporary directory: it matched the reviewed document exactly.

This confirms all displayed counts and calculations, including:

- 1,081 items and 792 daily-eligible items.
- All 63 per-series counts and every architecture/socket frequency.
- Every coverage percentage, including the corrected overall Mem/Cores figure of 99% under downward integer rounding.
- 17 dropped candidate rows and one overridden row.
- The seeded daily/non-daily samples and all 30 displayed rows.
- Cached revision IDs matching the four recorded source revisions.

The quarter-date parser now retains an unknown month instead of inventing one. GTX 750/750 Ti architecture classification is corrected by the chip-prefix mapping. These are real improvements, but non-null coverage and successful reconstruction measure completeness and reproducibility—not factual accuracy.

## Disposition of all 30 displayed rows

“No new conflict” means no additional contradiction identified in this review and the prior evidence; it does **not** mean every date/price has an independent manufacturer citation. “Source-only” means the cached row supports the values but important historical claims still lack independent primary evidence.

| Row | Disposition |
|---|---|
| GeForce 8800 GTS Core 112 | Source-only for exact launch date, $399 and 150 W; 640 MB presentation is fixed. Do not mark every field manufacturer-verified. |
| Core 2 Quad Q9400 | No new conflict. An archived Intel price list additionally supports $266, though it is dated after launch. |
| Ryzen 3 3300X | Correct $119 to $120; distinguish April announcement from May availability. |
| GeForce RTX 3090 | Numeric specifications supported; change/qualify the TDP label. |
| Core i3 6300T | No new conflict; exact launch price still needs a consistent tray/boxed basis. |
| Core i5 4460 | No new conflict; exact launch price still needs a consistent tray/boxed basis. |
| Core i7 4770K | No hardware conflict; $350 is within the archived Intel range, but price basis remains ambiguous. |
| Core i5 670 | No new conflict; Intel's 2010 launch announcement supports $284 and 2/4. |
| GeForce RTX 2070 SUPER | Numeric specifications supported; change/qualify the TDP label. |
| Core 2 Extreme QX9770 | No new conflict; archived Intel pricing additionally supports $1,399 after launch. |
| GeForce GT 520 | No new numeric conflict; exact original price and power terminology are not independently signed off. |
| GeForce RTX 3080 | Numeric specifications supported for the 10 GB variant; change/qualify the TDP label. |
| Radeon HD 6350 | Architecture fixed; date, MSRP and exact board/power definition remain unresolved. |
| Core 2 Extreme QX6800 | No new conflict. Intel announcement confirms product introduction; this pass did not independently establish the $1,199 launch price. |
| Radeon RX 470 | No new conflict for 4 GB; 120 W TBP agrees with AMD. GCN 4 is the architecture-generation label used for Polaris. |
| Core i5 12600KF | No new conflict; 125 W base-power label is fixed and distinct from 150 W maximum turbo power. |
| Ryzen 7 5800X | No new conflict against AMD launch evidence from the first review. |
| Ryzen 9 3900XT | No new conflict against AMD launch evidence from the first review. |
| Core 2 Extreme QX6850 | No new conflict; archived Intel pricing additionally supports $999 after launch. |
| Core i5 4670K | No new hardware conflict; launch-price basis still needs consistent documentation. |
| Radeon HD 8470 | Cached specifications reproduced. OEM classification needs attention: record says `oem=false` although evidence identifies an OEM model. It is currently excluded because price is missing. Do not mark OEM metadata verified. |
| GeForce GTX 660 OEM | NVIDIA supports 1.5/3 GB and 130 W maximum card power. 1,536 MB is valid; qualify variant and power label. Excluded as OEM. |
| Ryzen 3 3200GE | AMD directly confirms July 7, 2019, 4/4, 35 W and AM4. Excluded as OEM/no price. |
| GeForce RTX 5090 D | January 2025 confirmed; official launch price is CNY 16,499. USD conversion must not be presented as official MSRP. Excluded by the regional-model rule. |
| Radeon HD 4730 | Source-only for June 2009, 110 W and 512 MB. Missing price explains exclusion; a blank means unknown, not no historical price. |
| GeForce GTX 950 OEM | Source-only for 2016, Maxwell and 2 GB. Unknown month, price and power are appropriately left blank. Excluded as OEM. |
| GeForce GTS 240 OEM | NVIDIA independently lists Tesla architecture. Exact July date and power terminology remain source-level evidence. Excluded as OEM. |
| Radeon HD 7350 | Cached source supports the 256 MB variant; HP documents 512 MB too. Qualify variant; excluded as OEM. |
| GeForce GT 415 OEM | Tesla is correct despite the 400-series name: NVIDIA explicitly lists it among Tesla products. Other fields remain source-level evidence. Excluded as OEM. |
| Radeon R9 370 | Cached source supports May 2015, 150 W TBP, GCN 1 and 2/4 GB variants. Independent manufacturer validation remains incomplete. Excluded as OEM. |

Additional evidence: [Intel December 2008 price list](https://www.willus.com/archive/cpu/2009/intel_pricing_20081228.pdf), [Intel September 2007 price list](https://mail.willus.com/archive/cpu/2008/intel_pricing_20070905.pdf), [Intel QX6800 announcement](https://www.intc.com/news-events/press-releases/detail/1045/intel-delivers-its-fastest-enthusiast-quad-core-processor), [AMD 3200GE specifications](https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-3000-series/amd-ryzen-3-3200ge.html), [NVIDIA Tesla product list](https://nvidia.custhelp.com/app/answers/detail/a_id/4212).

## What would make this defensible to an independent fact-checker

Correct the confirmed errors, adopt one release-event definition, preserve original currencies and price bases, and retain the manufacturer's power terminology. Give each field or row a source and a verification status. Specify the memory/board variant. Keep unresolved fields unknown or explicitly disputed, and keep those rows out of a strictly verified answer pool.

Matching a pinned Wikipedia revision is defensible as a statement of what that revision says. It is not a guarantee that every underlying hardware fact is true. This second pass does not certify every specification for all 1,081 products.

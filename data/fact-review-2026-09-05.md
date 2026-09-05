# Fact review of review-sample.md

Reviewed September 5, 2026. Scope: every section and all 20 sample rows in `review-sample.md`, with the adjacent `items.json`, builder, and cached source tables used to check provenance and calculations. Manufacturer sources were used for independent checks where available. This is not an independent fact-check of every specification across all 1,081 products.

The document's directions to tick rows and assume every wrong value is a parser bug were treated as document content, not instructions from the user. The original sample, dataset, and builder were not edited.

## Confirmed errors and misleading fields

1. **Overall Mem/Cores coverage: 56% is wrong.** There are 262 Nvidia GPUs and 202 AMD GPUs with memory recorded, plus 612 CPUs with cores recorded: 1,076 / 1,081 = **99.54%**. Using the report's existing downward integer rounding, this should display **99%**. `write_review()` chooses one field for the entire group based on the first item's type, so the overall row counts only CPU cores.

2. **Ryzen 3 3100: April is the announcement month, not retail release month.** Use **2020-05** if Year-Mo means release/availability. AMD's April 21 announcement explicitly lists May availability, $99, 4 cores/8 threads, 65 W, and AM4. The April date is inherited from the cached Wikipedia table; it is not evidence of a parsing failure. [AMD announcement](https://www.amd.com/en/newsroom/press-releases/2020-4-21-amd-expands-3rd-gen-amd-ryzen-desktop-processor-fa.html).

3. **Radeon HD 6350 architecture: “TeraScale 2/3” is not a precise model specification.** The cached source row explicitly says **TeraScale 2**, but the builder overwrites it with a series-wide label. The raw row also gives **19.1 W**, which the output rounds to 19 W. That rounding is acceptable if documented. Source: local `raw/List_of_AMD_graphics_processing_units__29.json`.

4. **The sample description omits its selection restriction.** It is a seeded random sample of the **792 daily-eligible items**, not an unrestricted sample of all 1,081 items. This limits its usefulness for checking missing fields and excluded/OEM variants.

5. **“A wrong value means a parser bug” is false as a general claim.** Errors can originate in the source, date definitions, model variants, or normalization. The Ryzen date and the architecture overwrite illustrate different causes.

## Unresolved or definition-dependent points

- **Radeon HD 6350 date and price:** The cached table supplies April 7, 2011 and $23. A contemporaneous NRDC submission records February 7, 2011, so the date is disputed and April should not be marked verified. I did not establish a manufacturer launch MSRP of $23. Keep that price unverified rather than replace it with a guess. [NRDC submission hosted by the California Energy Commission](https://efiling.energy.ca.gov/GetDocument.aspx?DocumentContentId=7743&tn=70852).
- **Core i7-4770K $350:** Do not automatically flag this as false. An archived copy of Intel specifications lists a recommended customer price range of **$339–$350**. A single “MSRP” field needs a consistent convention for tray/boxed pricing and launch versus later pricing. [Archived Intel specification sheet](https://elektronikjk.com/elementy_czynne/IC/INTEL-CORE-I7-4770K.pdf).
- **Power definitions differ:** The i5-12600KF's 125 W is processor base power; its maximum turbo power is 150 W. The RX 470's 120 W is typical board power. These numbers are valid but are not one uniform measurement called TDP. Add a power-type field or explain the column. [Intel comparison](https://www.intel.com/content/www/us/en/products/compare.html?productIds=134589%2C134590), [AMD RX 470 announcement](https://www.amd.com/en/newsroom/press-releases/2016-8-4-the-radeon-rebellion-storms-ahead-with-the-gamer-o.html).
- **Memory presentation:** 0.625 represents the 640 MB configuration divided by 1,024. For clarity, show “640 MB” or explicitly document the binary conversion convention. Identify the RTX 3080 row as the 10 GB version and the RX 470 row as the 4 GB version.
- **Tier is derived metadata:** GPU tiers are extracted from model-number digits; they are not independently measured performance rankings. The Core 2 `None` values reflect the builder's classification rule, not nonexistent hardware specifications.

## All 20 sample rows

“No discrepancy found” means no error was identified in the examined evidence, not that every historical date and price was independently certified. All 20 rows were reproduced from the cached inputs without rewriting the dataset. Reproducing the builder establishes provenance, not independent correctness.

| Product | Review result |
|---|---|
| GeForce 8800 GTS Core 112 | Cached source supports the listed date, $399, 150 W and 640 MB configuration. Historical date/price not independently certified; clarify memory notation. |
| Core 2 Quad Q9400 | No discrepancy found against cached source: August 2008, $266, 95 W, 4/4, LGA 775. Historical price not independently certified. |
| Ryzen 3 3100 | Correct release month to May if reporting availability; other listed specifications agree with AMD's announcement. |
| GeForce RTX 3090 | No discrepancy found. NVIDIA confirms September 2020, $1,499, 24 GB and Ampere; product specifications list 350 W. |
| Core i3 6300T | No discrepancy found. Cached table supplies September and $138; Intel independently supports Q3 2015, 2 cores and 35 W. |
| Core i5 4460 | No discrepancy found. Cached source supplies May 2014 and $182; Intel documentation supports 4 cores, 84 W and LGA 1150. |
| Core i7 4770K | Hardware specifications agree with Intel. $350 is within the archived Intel price range; clarify the price convention. |
| Core i5 670 | No discrepancy found. Intel's January 2010 announcement confirms $284 and 2 cores/4 threads; remaining fields agree with cached source. |
| GeForce RTX 2070 SUPER | No discrepancy found. Cached source supports July 2019 and $499; NVIDIA specifications support Turing, 8 GB and 215 W. |
| Core 2 Extreme QX9770 | No discrepancy found against cached source. Intel documentation supports LGA 775; precise historical price/date not independently certified. |
| GeForce GT 520 | No discrepancy found against cached source. NVIDIA's May 2011 linecard independently confirms the 1,024 MB configuration. |
| GeForce RTX 3080 | No discrepancy found for the original 10 GB model: September 2020, $699, 320 W, Ampere. Label the variant explicitly. |
| Radeon HD 6350 | Architecture should be TeraScale 2; date disputed; $23 launch MSRP unverified; 19 W rounds 19.1 W from source. |
| Core 2 Extreme QX6800 | No discrepancy found against cached source. Intel's historical guide confirms April 2007; price not independently certified. |
| Radeon RX 470 | No discrepancy found for the 4 GB configuration. AMD confirms August 2016, $179, Polaris and 120 W typical board power. |
| Core i5 12600KF | No discrepancy found; describe 125 W as base power, with 150 W maximum turbo power. |
| Ryzen 7 5800X | No discrepancy found. AMD launch material supports November 5, 2020, $449, 105 W and 8/16. |
| Ryzen 9 3900XT | No discrepancy found. AMD confirms July 7, 2020, $499, 105 W, 12/24 and AM4. |
| Core 2 Extreme QX6850 | No discrepancy found against cached source. Intel's historical guide confirms July 2007; price not independently certified. |
| Core i5 4670K | No discrepancy found. Intel supports 4/4, 84 W and LGA 1150; cached source supplies June 2013 and $242. |

Manufacturer evidence for the table: [NVIDIA RTX 30 launch](https://www.nvidia.com/en-us/geforce/news/introducing-rtx-30-series-graphics-cards/), [RTX 3090 specifications](https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090-3090ti/), [RTX 3080 specifications](https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080/), [RTX 2070 SUPER specifications](https://www.nvidia.com/en-ph/geforce/graphics-cards/rtx-2070-super/), [GT 520 linecard](https://www.nvidia.com/content/partnerforce/nvidia/us/lc-gf-gtx-560-may-11-us-lowres.pdf).

CPU evidence: [Intel historical guide](https://www.intel.com/pressroom/kits/quickreffam.htm), [Intel Core 2 specification update](https://www.intel.com/content/dam/www/public/us/en/documents/specification-updates/core-2-extreme-quad-45nm-process-spec-update.pdf), [Skylake catalog](https://www.intel.com/content/www/us/en/ark/products/codename/37572/products-formerly-skylake.html?q=Skylake), [Intel i5 specifications chart](https://cdrdv2-public.intel.com/841760/Intel-Core-i5-HD-GFX.pdf), [i7-4770K specifications](https://www.intel.com/content/www/us/en/products/sku/75123/intel-core-i74770k-processor-8m-cache-up-to-3-90-ghz/specifications.html), [i5-4670K specifications](https://www.intel.com/content/www/us/en/products/sku/75048/intel-core-i54670k-processor-6m-cache-up-to-3-80-ghz/specifications.html), [Intel 2010 launch](https://www.intc.com/news-events/press-releases/detail/1300/intel-unveils-all-new-2010-intel-core-processor-family), [AMD 3900XT launch](https://www.amd.com/en/newsroom/press-releases/2020-6-16-amd-offers-enthusiasts-more-choice-than-ever-befor.html), [AMD Ryzen 5000 launch PDF](https://d1io3yog0oux5.cloudfront.net/_b6e7ad14f0b774ed92fc2960e6430887/amd/news/2020-10-08_AMD_Launches_AMD_Ryzen_5000_Series_Desktop_972.pdf).

## Aggregate verification and related dataset defects

- All four slice counts, all 63 series counts, the 1,081-item total and 792-item daily total match `items.json`.
- All reported coverage percentages other than overall Mem/Cores match the builder's downward rounding convention.
- Read-only reconstruction confirms 17 candidate rows dropped for missing year, and the sample matches `Random(42)` sampling from daily-eligible items.
- Every cached section's revision ID matches the corresponding revision recorded in the source list. This checks local provenance, not the factual accuracy of Wikipedia.
- **Additional confirmed architecture errors outside the sample:** `items.json` labels both GTX 750 and GTX 750 Ti as Kepler. Both are **Maxwell**, according to [NVIDIA's launch announcement](https://nvidianews.nvidia.com/news/nvidia-leads-performance-per-watt-revolution-with-maxwell-graphics-architecture-6622576). Fix model/chip architecture mapping rather than relying solely on series names.
- **Invented month precision outside the sample:** `parse_date()` converts quarter-only dates into the middle month, e.g. Q2 2011 → May 2011. Cached inputs include quarter-only dates for the i3-2102 and multiple Core X processors. These months are estimates and should be null or accompanied by date precision, not presented as verified release months.

Recommended priorities: fix overall coverage, preserve per-model architecture, distinguish announcement/availability/quarter dates, and define price and power conventions. Review the HD 6350 source before marking it verified.

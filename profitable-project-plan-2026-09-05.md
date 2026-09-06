# Profitable project plan — 2026-09-05

**Question:** Daily games are parked. What is the profitable thing to build with the data we
already hold plus what can be found, and what does it need? Sites, apps, tools all allowed.

**Answer:** A set of PC-hardware buying tools on specdle.com, built from three licensed
datasets: the Specdle spec dataset (CC BY-SA), **Blender Open Data benchmark scores (CC0,
found and verified today)**, and FRED CPI (public domain). Monetised with the Amazon
Associates account that is already approved, then Journey/Mediavine ads. The first tool is
part pages with launch price in today's dollars and a licensed performance score; the money
tool is an upgrade calculator. Four evenings to the first revenue-capable version.

**Status (2026-09-05, evening):** direction approved by Tyler; **domain: stay on specdle.com.**
**Evening 1 done** (see §7): extended spec fields in `items.json`, `perf.json` from Blender Open
Data, `cpi.json` from FRED, `check.py` passing. Not deployed; the live game is unchanged.
Nothing bought.

## 1. Why tools, not another game

| | Daily game | Buyer-intent tool page |
|---|---|---|
| Visitor intent | Entertainment | Deciding what to buy |
| Ad RPM (blocker-adjusted, tech audience) | ~$2–4 per 1,000 pageviews (Actorle's realised rate, halved) | AdSense $3–12; Mediavine $15–40; Raptive pays 15–30% more in tech |
| Affiliate | Incidental | The point of the page. PC components pay 2.5% on Amazon |
| Rough total per 1,000 visitors | $2–4 | $15–45 (see §8) |
| Proof the model works at scale | Actorle ~$3k/mo at ~270k visits | pc-builds.com (bottleneck calculator + part pages): ~1.6M visits/mo, third-party revenue estimate ~$23k/mo |

Two more reasons. The Amazon Associates account (`specdle-20`, approved 2026-09-05) closes
without **3 qualifying sales by 2027-03-04**; a game will not produce them, tool pages will.
And every page on the same domain counts toward Journey by Mediavine's 1,000-sessions
threshold, so the tools and the game pool their traffic.

Employer boundary check: PC hardware, no finance, no advice about money. Clean.

## 2. The data, verified today

| Dataset | License | What was checked | What it unlocks |
|---|---|---|---|
| `data/items.json` (ours) | CC BY-SA 4.0 | 469 GPUs, 612 CPUs, 2006–2026. MSRP on 290 GPUs / 524 CPUs; power on 457 / 611; VRAM 464; cores 612 | Part pages, tier price history, PSU math |
| Wikipedia raw cache (`data/raw/`, already downloaded) | CC BY-SA 4.0 | Columns not yet parsed: FP32 GFLOPS (10 sections), memory bandwidth (29), bus width (16), die size (15), transistors (20), fab nm (12), base/boost clocks | Richer part pages; "compute per dollar over time" |
| **Blender Open Data** | **CC0** (LICENSE.txt in the archive says so) | Daily snapshot `opendata.blender.org/snapshots/opendata-latest.zip`: 100 MB zip, 1.87 GB JSONL, 428,307 submissions, 339,905 complete three-scene runs. Blender 4.x alone: 1,443 devices with ≥5 runs. Aggregates in 8 s with `data/blender_perf_prototype.py` | **The first licensed performance number we have.** Rendering, not gaming; say so on every page |
| Blender ↔ Specdle join | — | After name normalisation and the laptop filter: **87 of 117 desktop GPUs since 2016** and **230 of 381 CPUs since 2017** have a Blender 4.x median; 393 parts in all. Older parts mostly don't; that's fine, nobody upgrades to a GTX 460 | Upgrade calculator, price-per-point rankings |
| FRED `CPIAUCSL` | Public domain (BLS) | Downloads without a key. Annual averages: 2014 236.7, 2016 240.0, 2020 258.9, 2025 322.0 (11 mo), 2026 (7 mo) 330.9 | "Launch price in today's dollars" on every part |
| Amazon prices | — | PA-API needs 3 sales first. Not available at launch | Use MSRP + a "price you see" input + tagged search links (what Specdle does now) |

A joined row looks like this (Blender 4.x, OptiX/HIP medians):

| Part | Year | MSRP | Rated power | Blender score | Runs | $ per 1,000 points |
|---|---|---|---|---|---|---|
| GeForce RTX 5070 | 2025 | $549 | 250 W | 6,174 | 1,397 | $89 |
| GeForce RTX 4070 | 2023 | $599 | 200 W | 5,258 | 1,937 | $114 |
| GeForce RTX 3070 | 2020 | $499 | 220 W | 3,180 | 1,875 | $157 |
| GeForce GTX 1070 | 2016 | $379 | 150 W | 532 | 489 | $712 |
| Radeon RX 9070 XT | 2025 | $599 | 304 W | 3,174 | 1,050 | $189 |
| Radeon RX 7800 XT | 2023 | $499 | 263 W | 2,414 | 753 | $207 |

That table is already a page people would share. GTX 1070 → RTX 4070 is ~10× in Blender.
And the inflation line writes itself: the GTX 970 was $329 in 2014, which is ~$460 in 2026
dollars; the RTX 5070 is $549, so the 70-class costs ~19% more in real terms.

## 3. The tools, in build order

| # | Tool | URL shape | Pages | Data | Money | Why it can rank |
|---|---|---|---|---|---|---|
| T1 | **Part pages** | `/gpu/rtx-3070`, `/cpu/ryzen-7-5800x3d` | 1,081 | Specs, MSRP, MSRP in today's dollars, Blender score + rank in its generation, predecessors/successors in the same tier, "what replaced it" | "Check price" affiliate link + disclosure; ads later | Long-tail queries ("gtx 1070 msrp", "rtx 3070 launch price") where the answer is a number and reviews don't bother. Spec-only databases exist (TechPowerUp, gpuzoo, gpuspecs) so the inflation and benchmark lines are what make ours different |
| T2 | **Then vs now** | `/tools/price-history` + `/tools/price-history/nvidia-70-class` | ~20 | MSRP by tier by generation, nominal and inflation-adjusted, as a chart with a shareable PNG and a copyable sentence | Traffic engine; links to T1 | Nothing interactive exists. Only articles and forum tables (HEXUS, eTeknix, the Zarathustra table). The "70-class has doubled" argument recurs on r/pcmasterrace every launch |
| T3 | **Upgrade calculator** | `/tools/upgrade` + `/upgrade/gtx-1070-to-rtx-4070` | ~2–4k pairs (2016+ GPUs, targets ≥30% faster) | Blender score delta, $ per point, power delta, PSU headroom note, VRAM delta | **The money page.** Affiliate link on the target card | Incumbents (gpucheck, techbenchpro, systemrequirements.net, the bottleneck-calculator sites) use unlicensed FPS data and rank anyway; ours is honest, licensed, downloadable, and says "rendering score" plainly |
| T4 | **Best GPU for Blender by budget** | `/tools/best-gpu-for-blender` | 1 + per-budget | Score per dollar with MSRP default and a "price you see" input; CPU and Apple silicon tabs later | Affiliate | Real query with buyer intent; competitors are yearly articles (PC Guide, CGDirector, RenderJuice). RenderJuice has per-GPU Blender pages but sells a render farm, no prices, no affiliate |
| T5 | PSU estimator | `/tools/psu` | 1 | Rated power from the dataset | PSU affiliate links | Crowded; cheap add-on once T1–T4 exist |
| T6 | X vs Y compare | `/compare/rtx-4070-vs-rx-7800-xt` | many | T1 side by side | Affiliate | Most crowded query type on the web. Only after T1–T4 show traction |

Everything is static: built at deploy time from three JSON files, no server, no accounts.

## 4. Everything else considered, and why it's not first

| Option | Verdict | Why |
|---|---|---|
| iOS / Android app of the same tools | No, for now | $99/yr, review queue, no affiliate links inside apps without Amazon's mobile program, and this audience buys on the web. A free "add to home screen" PWA of the site costs nothing and covers it |
| Chrome extension showing launch price / score on Amazon and Newegg pages | Later, as a growth hook | Amazon forbids extensions that inject affiliate tags, so it earns nothing directly. It could send traffic to the site once the site exists |
| Paid specs + benchmarks API | No | Free spec databases already exist and CC BY-SA share-alike limits exclusivity. Do the opposite: publish the joined JSON free on `/data`; developers link to it, which is the backlink the SEO needs |
| GPU deals newsletter | No | Needs live prices (no PA-API yet, Keepa is paid) and daily human time. Breaks the time cap |
| Phone or camera tools | No | No launch prices on Wikipedia for phones; camera tables are fragmented. Verified in `next-project-research-2026-09-05.md` |
| Economy / inflation tools on FRED | No | officialdata.org and in2013dollars.com own that search space, and it walks the employer boundary |
| Hurricane game | Shelved | Tyler's call today |
| Second Specdle game mode | Day 60 | Retention move for an audience that doesn't exist yet |
| LLM "build advisor" chat | No | Per-query cost, and the rails-over-agents rule. One batch-generated paragraph per part page, read before it ships, is the allowed version |
| eBay Partner Network for used cards | No | 1.5% on computers, 2% on electronics; sold-listing data needs eBay's restricted Insights API |
| Sell the site later | Note | Content/tool sites trade at roughly 30–40× monthly profit on the usual marketplaces. It's an exit, not a plan |

## 5. What it needs

### Data work (Claude, deterministic scripts, PRs) — items 1–3 done 2026-09-05

1. `data/build.py`: parse the extra Wikipedia columns already in `data/raw/` (GFLOPS, bandwidth, bus width, die, transistors, fab, clocks). Rebuild; review sample as before.
2. `data/blender_perf.py` from the prototype: download the snapshot, aggregate, join to `items.json` via a normaliser plus a hand map for the leftovers (`data/perf-overrides.json`, same idea as `overrides.json`). Exclude laptop/mobile variants. Keep scores per Blender major; never compare across majors. Output `data/perf.json`.
3. `data/cpi.py`: FRED CSV → annual averages → `data/cpi.json`. "Today's dollars" = MSRP × (latest year avg ÷ launch year avg).
4. n8n monthly job on the mini: run all three, open a PR. Never deploys. Same heartbeat as the other jobs.

### Site work — items 5–8 done 2026-09-05 (chart-to-PNG belongs to T2, Evening 3)

5. **Real URLs.** The game is a hash-routed SPA (`#/archive`), which search engines treat as one page. Tool pages need `/gpu/rtx-3070` as a real path with the HTML pre-rendered at build time (a build script rendering each route with react-dom/server, or Astro alongside Vite). `staticwebapp.config.json` already excludes assets from the SPA fallback; extend it. Azure SWA Free caps the app at 250 MB; ~5k pages at ~20 KB fits.
6. Sitemap generated from the data, canonical tags, one JSON-LD block per page (`Product` with specs is fine; we are not the seller).
7. Affiliate: "Check price on Amazon" as a tagged search link per part, disclosure line on every page (the component exists from the game). Add price input for T3/T4.
8. Chart → PNG for T2 (render to canvas, `toBlob`, so the share button gives an image, not just text).
9. Google Search Console (Tyler's Google account), submit the sitemap. GoatCounter events: affiliate click, share, calculator use.

### Accounts and spending

Nothing new. specdle.com, Azure SWA Free, GitHub Actions, GoatCounter, Amazon Associates all
exist. Journey by Mediavine at 1,000 sessions/month; Raptive later if it grows. No AdSense
before that (rule: ads only after approval).

## 6. Domain: stay on specdle.com

Recommended, Tyler's call. Reasons: zero cost, one repo and one deploy, the -dle directory
listings become backlinks to the tool pages, and one domain reaches the Journey threshold
sooner. Paths: `/gpu/`, `/cpu/`, `/tools/`, `/upgrade/`, `/compare/`. If a separate brand is
ever wanted, the paths map 1:1 to redirects. Cost of being wrong: one redirect file.

## 7. Build plan

| Evening | Deliverable |
|---|---|
| 1 ✓ | **Done 2026-09-05.** `build.py` parses 16 more fields (FP32 TFLOPS on 116 of 117 GPUs since 2016, bandwidth, bus width, clocks, memory type, transistors, die, fab, bus interface; CPU base/boost clocks, cache, max turbo power, iGPU). `blender_perf.py` → `perf.json` (393 parts, 1,443 devices). `cpi.py` → `cpi.json`. `check.py` validates all three and prints coverage. Existing game fields unchanged except 29 GeForce 9 codenames that were empty before. `npm test` passes |
| 2 ✓ | **Built 2026-09-05.** Vite SSR entry + `scripts/prerender.mjs` write 836 static pages (2 indexes, 297 GPU, 537 CPU) at ~16 KB each, 14 MB total, sitemap with 837 URLs, JSON-LD `Product` per part, canonical/OG tags, GoatCounter with an affiliate-click event. Each part page: launch price and today's-dollar figure with method, Blender score with rank overall and in-series and points per $100, full spec table, tier lineage (16 rows, variants dropped), same-era neighbours, Amazon link with disclosure, link to the game. `npm test` 26 tests pass. **Not yet deployed**: push to main deploys; Search Console is Tyler's step |
| 3 | T2 price-history tool with shareable image; T4 Blender ranking. Post T2 once to r/pcmasterrace-style venues via the game's launch-kit rules |
| 4 | T3 upgrade calculator and pair pages. Show HN: "Open-data GPU tools: launch price in today's dollars and CC0 benchmark scores" |
| then | n8n monthly refresh; watch four numbers: sessions, affiliate clicks, Amazon orders, Search Console impressions |

At one evening a week that is a month. At today's pace (Specdle evenings 2–4 in a day) it
is a weekend.

## 8. Revenue arithmetic, labelled rough

Per 1,000 tool-page visitors: 5–10% click an affiliate link; ~5% of clicks order something
within Amazon's 24-hour window; average PC-part order ~$200; 2.5% commission. That is
**$10–30 per 1,000 visitors** in affiliate alone, immune to ad blockers, plus **$5–15** in
ads once Journey is on. Call it $15–45 per 1,000 against the game's $2–4.

| Monthly visits | Affiliate + ads, rough | What it means |
|---|---|---|
| 5,000 | $75–225 | Associates account safe, Journey approved |
| 20,000 | $300–900 | Pays for every side-project cost ever incurred, monthly |
| 100,000 | $1,500–4,500 | Actorle territory, with no content treadmill |

None of these are forecasts. They are what the traffic would be worth if it came. The
60-day gate: **by day 60, 3 Amazon orders and 3,000 sessions/month, or stop adding tools
and let it run.** Written before launch, per the rules.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Thin-page treatment by Google for 1,000+ templated pages | Every page carries a real table, a real inflation number, a real benchmark rank, and links to its neighbours; no page without at least MSRP or a score. Start with the 500 parts that have both |
| Blender rendering score read as gaming performance | Label "Blender 4.x render score (OptiX/HIP), not game FPS" on every use; never say "faster in games" |
| MSRP gaps (179 GPUs, 88 CPUs) | Hide the line, never guess. Same rule as the game |
| Name-mapping errors in the Blender join | Publish the map; accept corrections; review sample of 20 joined rows per rebuild |
| Score drift across Blender majors | Group by major; show the major on the page; re-aggregate monthly |
| Amazon account closes anyway | Tool pages are the fix; if no orders by 2027-02, put the affiliate link above the fold on T3 |
| Time cap | Static pipeline, monthly job, no daily content. The whole design is "build once, refresh by script" |

## 10. Decisions for Tyler

1. Approve this direction (tools on specdle.com), or name a different first tool.
2. Domain: stay on specdle.com (recommended) or a separate brand.
3. Which evening. Evening 1 is pure data work and can run without any decision beyond #1.

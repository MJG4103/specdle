# Guess the GPU / CPU — full research — 2026-09-05

**Status: researched, recommended, not approved, nothing built or bought.**

## 1. The game

A daily guess-the-hardware game. Eight guesses. You type a real product; the game returns a
row of checks and arrows. Weekdays alternate GPU and CPU, or run two boards side by side.

| Hint | GPU | CPU | Feedback |
|---|---|---|---|
| Vendor | Nvidia / AMD / Intel | Intel / AMD | check / cross |
| Release year | | | higher / lower, green within 1 year |
| Launch price (MSRP, USD) | | | higher / lower, green within 10% |
| Memory / cores | VRAM in GB | core count | higher / lower |
| TDP (watts) | | | higher / lower |
| Tier in its generation | xx50 / xx60 / xx70 / xx80 / xx90 | i3 / i5 / i7 / i9, Ryzen 3/5/7/9 | higher / lower |
| Architecture / socket | Ampere, RDNA 3... | LGA1700, AM5... | check / cross |

End of round: emoji share grid, streak, an archive of past days, and a two-sentence blurb
("The GTX 970 shipped with 4 GB, of which the last 0.5 GB was famously slow...") with the
affiliate link under it.

Share text, the growth engine, looks like:

```
Specdle #42  GPU  4/8
🟥⬆️⬇️🟩⬆️🟥🟥
🟩⬇️⬇️🟩🟩⬆️🟥
🟩🟩⬇️🟩🟩🟩🟥
🟩🟩🟩🟩🟩🟩🟩
specdle.com
```

(Name is a placeholder. See §6.)

## 2. Incumbent check — none found

Searches run 2026-09-05, all returned nothing on-theme:

- `"guess the gpu" OR "guess the graphics card" OR "guess the cpu" daily game` restricted to
  listdle.com, alldle.net, dles.gg, reddit.com
- `"gpudle" OR "cpudle" OR "hardwardle" OR "specdle" OR "pcdle"`
- `daily guessing game PC hardware GPU CPU "dle"`
- dles.gg top-30 by popularity: word, geography, film, music, no hardware
- alldle.net lists 1,093 games; nothing surfaced for hardware terms

Adjacent, and evidence of demand rather than competition: Gamedle has a "specifications"
mode, but about video games. Linus Tech Tips and overclock.net both have long-running
"guess the GPU" forum threads where people do this by hand.

## 3. Audience

| Community | Size | Self-promo stance |
|---|---|---|
| r/pcmasterrace | 16.3M members | Allowed with a 9:1 participation ratio — Tyler must be an active member first |
| r/buildapc | Large (count not verified) | Self-promotion banned. Skip. |
| r/hardware, r/nvidia, r/AMD | Large | Varies; read rules before posting |
| Linus Tech Tips forum | Large, has a "guess the GPU" thread already | Friendly to community projects |
| Hacker News "Show HN" | Tech, high ad value | Fine for a launch post |
| The -dle directories | dles.gg, dlegames.org, alldle.net, listdle.com, dailydle.org, dles.aukspot.com | All take submissions. Did not exist in 2022. |

**The ad-blocker problem, stated plainly.** 40-60% of PC gamers block ads, against ~33% of
US internet users. Expect ad revenue per visitor at half of Actorle's. The affiliate link is
the answer: it is a normal link and survives every blocker.

## 4. Data — sources and licenses

| Source | License | Verdict |
|---|---|---|
| Wikipedia *List of Nvidia graphics processing units*, *List of AMD graphics processing units*, *List of Intel graphics processing units*, *List of Intel Core processors*, *List of AMD Ryzen processors* | **CC BY-SA 4.0** | **Use.** Attribute on a /data page, publish our derived JSON under CC BY-SA too. The Nvidia page alone has desktop sections from GeForce 8 (2006) through RTX 50, plus mobile and workstation. Columns present in most generations: launch date, code name, fab, transistors, die size, clocks, memory size/type/bus, TDP, launch price. MSRP is missing for some SKUs — drop that hint for those rows. |
| dbgpu (GitHub, MIT, ~2,000 GPUs, ~40 fields) and the Kaggle GPU datasets | MIT / CC on the *repo*, but the data is scraped from TechPowerUp | **Cross-check only.** The MIT license covers the scraper code, not TechPowerUp's rights in the data. Do not build on it. |
| TechPowerUp GPU database | No public API, no published reuse terms, rate-limits scrapers (429s, captchas) | **Do not touch.** |
| PassMark / UserBenchmark / 3DMark scores | Proprietary | **No performance hints in v1.** A "which is faster" mode needs a licensed source or none. |
| Amazon Product Advertising API | Requires 3 qualifying sales in 180 days before access | Use plain affiliate links (SiteStripe) at first; API later |

Dataset shape (one JSON file, committed):

```json
{ "id": "nvidia-rtx-3070", "type": "gpu", "vendor": "Nvidia", "name": "GeForce RTX 3070",
  "year": 2020, "month": 10, "msrp_usd": 499, "memory_gb": 8, "tdp_w": 220,
  "tier": 70, "arch": "Ampere", "blurb": "...", "affiliate_url": "..." }
```

Pool sizes after removing OEM variants and rebadges: roughly **350 desktop GPUs (2006+)** and
**500 desktop CPUs (2008+)**. A curated "daily" pool of ~600 recognizable parts keeps the
answer from being an obscure OEM card; the full list stays available for guesses.

## 5. Revenue

| Line | Rate / threshold | Notes |
|---|---|---|
| Amazon Associates | **2.5%** on PC components, 24-hour cookie | Live from day one. Account closes without 3 sales in 180 days; a $500 GPU is $12.50. Disclosure required on the page. |
| Newegg affiliate | 0.5-1.5% | Not worth the second program |
| Journey by Mediavine | **1,000 sessions/month**, tier-1 traffic, 70% share | First ad step, realistic within weeks if the launch lands |
| Mediavine | 50k sessions/month | Automatic upgrade from Journey at $5k lifetime earnings |
| Playwire | 500k+ pageviews/month | Actorle's tier; years away if ever |
| AdSense | No minimum | Fallback only; lowest rates |

Realistic arithmetic: at Actorle's realized ~$4 per 1,000 pageviews, halved for ad blockers,
1,000 daily players at 3 pages each is **~$180/month in ads** plus whatever the affiliate
link does. 10,000 daily players is ~$1,800 plus affiliate. That is the shape of the bet.

## 6. Name and domain

RDAP lookups 2026-09-05 (Verisign registry, authoritative for .com):

| Domain | Status |
|---|---|
| specdle.com | **Not registered** |
| gpudle.com | **Not registered** |
| guessthegpu.com | **Not registered** |

Recommendation: a name that covers both GPUs and CPUs, since the CPU board is half the
content — `specdle.com` does; `gpudle.com` does not. Avoid GeForce, Radeon, Ryzen, or Core
in the name (trademarks). "GPU" and "spec" are generic. **Buy only on approval,** ~$12/year.

## 7. Build plan — four evenings

| Evening | Deliverable | Why |
|---|---|---|
| 1 | `data/build.py`: pull the Wikipedia tables via the MediaWiki API, normalize to the JSON above, hand-check 20 rows, write `data/LICENSE` (CC BY-SA attribution) | The dataset is the product; everything else is a shell around it |
| 2 | Game UI: fuzzy-search guess box, hint row with arrows, 8-guess limit, localStorage stats and streak. Vite + React + Tailwind | Same stack as dashboard-starter; nothing new to learn |
| 3 | Share text, archive of past days, blurbs (one Claude call per item, generated in batch, Tyler reads them once), affiliate link slot, /data attribution page, privacy policy | Everything Actorle has that keeps people coming back |
| 4 | Deploy to a third Azure SWA Free app, buy the domain, submit to six directories, post to LTT forum and Show HN, apply to Amazon Associates | Launch is a checklist, not an event |

**Architecture:** static site; `schedule.json` maps dates to item ids for the next 24
months; no Supabase, no server, no accounts. One n8n workflow on the mini re-runs
`build.py` monthly and opens a PR if new parts appeared; it emits a heartbeat like every
other job and never deploys on its own.

**Later modes, all from the same dataset:** Higher-or-Lower MSRP, "put these five in release
order," CPU-only and GPU-only boards, and a phone dataset for idea #3 in the shortlist.

## 8. Risks

| Risk | Mitigation |
|---|---|
| Enthusiast-only appeal caps the ceiling | Accept it. Loyal beats broad for a daily habit. |
| Ad blockers halve ad revenue | Affiliate link; Journey by Mediavine's lower threshold |
| MSRP gaps for older parts | Hide the hint per row; never guess a number |
| "It's always a 1080" boredom | Curated daily pool, no repeats for 18 months, tier-balanced schedule |
| r/pcmasterrace 9:1 rule | Tyler participates for a few weeks first, honestly, then posts once |
| CC BY-SA share-alike | Publish `data/*.json` under CC BY-SA on the /data page. It costs nothing. |
| Trademark in the name | Generic words only, see §6 |
| The wave is over | True. This wins on being good and open-themed, not on being first. The gate below keeps the downside to four evenings. |

## 9. The gate

**Day 60 after launch:** fewer than 300 daily players → stop investing, leave it running
(it costs $12/year). More → build the second mode and the phone dataset, apply to Journey.

Track from day one: daily players, share-button clicks, affiliate clicks, directory
referrals. Four numbers, one small table, nothing else.

## 10. Decisions for Tyler

1. Approve this idea, or pick #2 (economy year-guess) first
2. Name and domain (specdle.com recommended; nothing bought)
3. Which evening it gets, given Longview selling comes first

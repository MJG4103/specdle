# What to build next — research — 2026-09-05

> **Shelved 2026-09-05, Tyler's call.** The daily-game direction is parked; see
> `profitable-project-plan-2026-09-05.md` for what replaced it. Kept for the data findings.

**Question:** Specdle is live as of today. What is the next side project that is quick to build
and worth the evening?

**Answer:** Guess the Hurricane, on the Specdle engine, two evenings, working name Stormdle
(domain free, nothing bought). Rocket is the runner-up on the same engine for October. Phone
waits for Specdle to have an audience. Economy Year is the best "second real site" but is three
evenings and a new UI, so it is not the quick one. Camera and consoles are dropped for now,
reasons below.

**Status: researched, recommended, not approved, nothing built or bought.**

## 1. Why "quick" means "reuse the engine"

Read the code, not the plan. The Specdle engine is already a generic "guess the entity from
spec arrows" game:

| Piece | What it does today | What a new dataset needs |
|---|---|---|
| `src/game/compare.js` | `COLUMNS` keyed by `type` (`gpu`, `cpu`); a column whose answer is null is hidden for the day | One more array entry |
| `src/game/data.js` | Loads `data/items.json` + `data/schedule.json`; `formatTier` is gpu/cpu-specific | A formatter or two |
| `data/schedule.py` | Pools hardcoded to `gpu`/`cpu`, alternates by day | Pool list from the dataset's types |
| `src/pages/Game.jsx`, `HelpModal.jsx`, `GuessInput.jsx` | `type === "gpu"` ternaries for label, colour, placeholder, help copy | Replace with a small type registry (label, colour, help text) |
| `src/game/search.js` | Name search, no library | Nothing, as long as names are unique (see storms below) |
| `src/game/share.js` | `SITE_NAME #n TYPE score` + emoji grid | Nothing |

So a new dataset costs: one build script, one `COLUMNS` entry, a type registry, copy, and the
launch checklist. The dataset is the whole job. That is why the ranking below is really a
ranking of how clean the data is.

## 2. Candidates, checked today

Every "incumbent" cell is from searches run 2026-09-05 (dles.gg, alldle.net, listdle.com,
dailydle.org, dles.aukspot.com, and direct name searches). Every "data" cell was fetched and
parsed today, not assumed.

| # | Idea | Data, verified | Pool | Incumbent | Engine reuse | Evenings | Audience | Why now / why not |
|---|---|---|---|---|---|---|---|---|
| **1** | **Guess the Hurricane** | NOAA HURDAT2, one text file, public domain (`hurdat2-1851-2025-02272026.txt`). 888 named Atlantic storms since 1950; 489 hurricanes; 202 major; 878 have min pressure; 381 have a US landfall record | 888 (642 since 1979) | None | Full | **2** | r/TropicalWeather 160k; weather Twitter is enormous during any landfall | Atlantic peak is 10 Sept. The only idea with a calendar reason to ship this month |
| **2** | **Guess the Rocket** | Wikipedia *Comparison of orbital launch systems* (CC BY-SA): 100 active vehicles with origin, manufacturer, height, LEO/GTO payload, reusable, launch count, first/last flight; 58 in development; *Comparison of orbital launcher families* adds 109 families + 45 retired | ~170–250 | None (searches drown in Rocket League) | Full | 2 | r/space 26M, r/spacex | Evergreen; Show HN-friendly; smaller pool so repeats at ~6 months unless retired vehicles are added |
| 3 | Guess the Phone | Three transposed tables: *List of iPhone models* (45 models, 197 spec rows), *Comparison of Samsung Galaxy S smartphones* (84 variants), *Comparison of Google Pixel smartphones* (~40). Screen size, battery, camera MP, weight, RAM, chip, release date all present. **No launch price anywhere structured**; infoboxes for iPhone 15, S24, Pixel 8, OnePlus 12 have no price field | ~170 | None (every "phone" -dle is phone *numbers*) | Full | 3 (three messy parsers) | r/Android 3M, r/apple 5M | Plan already says: launch it to Specdle's audience once there is one. Don't pull it forward |
| 4 | Guess the Year from the Economy | FRED CSV works without a key (`fredgraph.csv?id=UNRATE`, CPIAUCSL, FEDFUNDS, MORTGAGE30US, GASREGW, MSPUS, eggs APU0000708111 all fetched) | ~75 years | Inflation Wordle (nostalgiaflation.com) is an **India** single-price year guess; GDPdle is country guessing; PricedIn is price guessing. US snapshot → year is still open | No, new UI | 3 | Econ/finance Twitter, AP Macro | Highest ad rates and Tyler's real voice. Best *second site*, not the quick one |
| 5 | Guess the Camera | Fragmented: Sony E-mount 61 rows (good), Nikon Z 15, Full-frame DSLR 23, Nikon DX 41 (sensor only), Canon/Fujifilm/Micro Four Thirds pages have timelines and lens tables, no camera tables. No prices | ~150 after stitching six sources | None | Full | 4+ | r/photography 5M | Shortlist said "2 evenings on top of #1". It isn't. Drop until a clean source appears |
| 6 | Guess the Console | *List of home video game consoles* 112 rows (release date, manufacturer, units sold, CPU, bits); handhelds 57 rows. No price | ~170 | None | Full | 2 | Gamers, huge | Small pool, and Gamedle / GuessThe.Game already own that audience's daily habit |
| — | Second Specdle mode (Higher-or-Lower MSRP) | Already have the data | — | — | Same site | 1 | Specdle's players | Right move at day 60 if the gate passes (Actorle's new mode reversed its decline). Wrong move at day 1: there is no one to retain yet |
| — | Apple App / incremental game | Different project, in validation, no prototype | — | — | No | 10+ | — | Not quick. Unchanged |

## 3. The pick: Guess the Hurricane

### The game

Type a storm; the game returns arrows. Names repeat (Katrina 1981, 1999, 2005), so the entity
is `Katrina (2005)` and the search box shows all three. Eight guesses.

| Hint | Source field | Feedback |
|---|---|---|
| Year | storm id | higher / lower, green within 2 |
| Peak category | derived from max wind (TS = 0, Cat 1–5) | higher / lower, yellow within 1 |
| Peak wind (mph) | max of the track's wind column | higher / lower, yellow within 10% |
| Min pressure (mb) | min of the pressure column (878 of 888 have it) | higher / lower, yellow within 5 mb |
| Month | first track record | higher / lower, yellow within 1 |
| Storm number in season | storm id (`AL12` = 12th) | higher / lower |
| US landfall | `L` record present | check / cross |
| Name retired | NHC retired-names list (public domain) | check / cross |

That is eight columns, one more than the GPU board; drop "storm number" if it crowds phones.

Daily pool: hurricanes only (489 since 1950), retired names weighted first. Exclude the
current and previous season from the pool, always. The full 888 stay guessable.

### Data and license

HURDAT2 is a US government work: public domain, no attribution required, attribute anyway on
the /data page. The parser is ~40 lines: header line `AL092005, KATRINA, 34` then track rows
with date, record identifier, status, lat, lon, wind, pressure. Verified today by parsing the
whole file. Retired-name flag from NHC's own page (public domain) rather than Wikipedia so the
dataset stays attribution-free. The East Pacific file (`hurdat2-nepac-...`) is a later mode.

### Audience and the one rule that matters

r/TropicalWeather (160k) is moderated hard against speculation and fearmongering; read the
rules, participate first, and post as a question. Weather Twitter is where the share grid
travels. **Never post on a day a storm is making landfall or in the week after a deadly
one.** Post on the quiet days between systems. Tyler has no voice here, which is why this
sits below Specdle in expected upside; it wins on build cost and calendar, not on audience.

No affiliate line. Ads only, so the outcome is capped by traffic. Fine for two evenings.

### Names, domains (RDAP, Verisign, 2026-09-05; nothing bought)

| Domain | Status |
|---|---|
| stormdle.com | not registered |
| hurricanedle.com | not registered |
| guessthestorm.com | not registered |
| cyclonedle.com | not registered |

Stormdle is short and still fits Pacific typhoons later. Tyler's call.

### Build plan

| Evening | Deliverable |
|---|---|
| 1 | `data/build_storms.py` → `items.json` rows with `type: "storm"`; type registry refactor in the engine (columns, labels, colours, help copy) with tests; schedule pools driven by the dataset |
| 2 | Fork the repo to a new GitHub repo and Azure SWA Free app, domain, config, OG image, /data and privacy pages, directory submissions, launch posts drafted. Same checklist as Specdle's README |

Today's precedent (Specdle evenings 2–4 done in one day) says this is one long day if Tyler
wants it that way. The gate: write it before launch, same shape as Specdle's (day 60, 300
daily players). Seasonality means the honest read is "did it get shares in September and
October"; expect winter to go quiet.

## 4. Runner-up: Guess the Rocket (October)

Same engine, same two evenings, and cheaper after the hurricane build generalises the type
registry. Columns: origin (cat), manufacturer (cat), first flight year, height, LEO payload,
launches to date, reusable (cat), status (cat). `rocketdle.com`, `launchdle.com`,
`guesstherocket.com` are all unregistered. Pool is the weak point (~170 flown vehicles; the
retired-vehicle table was not located today and needs one more look). Launch it to Show HN;
that crowd will like it more than a hurricane game.

## 5. What this research changes in the shortlist

- **Camera drops from #4 to "later."** The "2 evenings on top of #1" estimate assumed clean
  comparison tables. Only Sony has one.
- **Phone keeps its place but loses the price hint.** Wikipedia has no structured launch
  price for phones. The game still works on screen, battery, camera, weight, RAM, year.
- **Economy Year stays #2 overall and is now confirmed open** (the nearest neighbour is an
  Indian single-price game). It is the next *big* build, after the Specdle gate, not the
  quick one.
- **Hurricane moves from #5 to the quick pick** on data quality and calendar alone.
- **Rocket is verified** (data and no incumbent) and joins the list at #2 for quick builds.

## 6. Not verified, say so

- Amazon Associates rates for phones and cameras: third-party tables list neither category, so
  both fall under "All Other Categories, 4%". Confirm in Associates Central before quoting it.
- FRED per-series copyright flags: my page scrape returned nothing for every series, including
  ones known to be copyrighted, so the check failed. The rule stands: BLS, BEA, Fed, EIA,
  Census series only.
- Retired orbital launch vehicles: not found on the comparison page today; may live on a
  separate list.

## 7. Decisions for Tyler

1. Approve Hurricane as the next build, or take Rocket first (same cost, no calendar pressure).
2. Name and domain (Stormdle recommended; nothing bought).
3. Which evening. The Specdle launch posts that only Tyler can do (Show HN, LTT forum, Search
   Console) are an hour and matter more than either new game; do those first.

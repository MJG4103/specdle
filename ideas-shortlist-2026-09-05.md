# Ideas shortlist — 2026-09-05

Six ideas passed the screen. Twenty did not. The failures are listed at the bottom with the
incumbent named, so nobody re-researches them.

## The screen

Every idea had to pass all six:

1. **Audience** — a believable path to 200k+ pageviews/month
2. **No incumbent** — nothing found on dles.gg, dlegames.org, listdle.com, alldle.net,
   dailydle.org, or a direct web search for the obvious names
3. **Free, licensed, evergreen data** — the puzzle authors itself; no scraping hostile sites
4. **Tyler's voice** — the first 1,000 players come from a community he already belongs to
5. **Employer boundary** — market and economy *games* are fine; no money handling, no advice,
   no broker links, no real-money anything
6. **Four evenings** — buildable on the existing stack (static site, Azure SWA Free, JSON
   schedule, n8n on the mini for refresh)

## Ranked

| # | Idea | Audience | Incumbent check | Data (license) | Extra revenue | Build |
|---|---|---|---|---|---|---|
| **1** | **Guess the GPU / CPU from spec hints** | r/pcmasterrace 16M, r/buildapc, r/hardware, LTT | None found (5 searches, 4 directories) | Wikipedia lists (CC BY-SA) | Amazon affiliate 2.5% on PC parts | 4 evenings |
| 2 | **Guess the Year from the Economy** | Econ/finance Twitter, AP Macro classrooms, FRED users | None found; adjacent estimation games exist (EconArena, GDPdle) but no year-guess | FRED public-domain series (BLS, BEA, Fed, EIA, Census) | Finance-vertical ad rates are the highest there are | 3 evenings |
| 3 | **Guess the Phone from specs** | r/Android 3M, r/apple 5M, r/iphone | None found (only phone-*number* games) | Wikipedia model lists (CC BY-SA) | Amazon affiliate | 2 evenings on top of #1 (shared engine) |
| 4 | **Guess the Camera from specs** | r/photography 5M, DPReview refugees | GuessTheGear exists but is photo-based; spec-based is open | Wikipedia comparison tables (CC BY-SA) | Amazon affiliate (cameras 4%) | 2 evenings on top of #1 (shared engine) |
| 5 | **Guess the Hurricane** | r/tropicalweather, weather Twitter, Gulf/Southeast residents | None found (only static quizzes) | NOAA HURDAT2 (public domain) | Seasonal ads only | 3 evenings |
| 6 | **AI-written, solver-verified deduction puzzle** | Huge (Clues by Sam: 50k DAU) | Yes — Clues by Sam owns the category with hand-made quality | Generated | Puzzle packs | 10+ evenings |

Ideas 1, 3 and 4 share one codebase: a "guess the entity from spec arrows" engine with a
different dataset plugged in. That is Laszlo's Actorle → Moviedle → Actorle.tv move, planned
from the start instead of discovered later.

## The six, one paragraph each

### 1. Guess the GPU / CPU — recommended

Full research in `gpu-game/research.md`. Eight guesses; each guess returns vendor, release
year, launch price, VRAM or cores, TDP, and tier as arrows and checks. Open theme, licensed
data, the exact loop Actorle proved, and an affiliate line movies can't have. Main risk is
the ad-blocker rate of the audience (40-60%), which the affiliate link partly offsets.

### 2. Guess the Year from the Economy

Show a snapshot: unemployment rate, CPI inflation, fed funds rate, average gas price, median
home price, 30-year mortgage rate, maybe the price of a dozen eggs. Guess the year. Feedback:
higher/lower with a "warmth" band, six guesses, share text as a strip of arrows. Nobody has
built this. The adjacent games (EconArena's estimation drills, GDPdle, Tradle) are
country-guessing or number-estimating, not year-guessing from a US snapshot. Data is FRED,
but **only the public-domain series** — BLS, BEA, Federal Reserve, EIA, Census. Copyrighted
series in FRED (S&P 500, Case-Shiller, some Moody's) are excluded by rule; FRED's terms put
that on the user. Tyler already built a FRED-driven dashboard, so the data work is familiar.
Audience is finance and econ Twitter, which shares compulsively, and AP Macroeconomics
teachers, who adopt daily games in class the way English teachers adopted Wordle. Finance is
the highest-paying ad vertical. Employer check: this is a history quiz. It names no
securities, gives no advice, links to no brokers. Keep it that way in every future mode.

### 3. Guess the Phone from specs

Same engine as #1 with a phone dataset: brand, release year, launch price, screen size,
battery, main camera megapixels, OS. Wikipedia's per-line model lists (iPhone, Galaxy S,
Pixel, OnePlus) are clean tables. Nothing found in the directories; every "phone" -dle is
about phone *numbers*. GSMArena is the obvious richer source and is off limits (scraping
forbidden). Launch to #1's audience once #1 has one.

### 4. Guess the Camera from specs

Same engine again: brand, release year, sensor size, megapixels, launch price, mount,
body type. GuessTheGear is a photo-identification game, not spec-based, so the mechanic is
open. Wikipedia's "Comparison of ..." camera tables carry the fields. Photography is a
loyal, gear-obsessed audience with the same "argue about specs" reflex as PC builders, and
Amazon pays 4% on cameras versus 2.5% on PC parts.

### 5. Guess the Hurricane

NOAA's HURDAT2 is public domain and has every Atlantic storm since 1851 with peak wind,
minimum pressure, track, and landfall. Guess the named storm; feedback on year, peak
category, max wind, landfall state, and month. ~100 retired names make the "famous" pool;
~1,000 named storms since 1950 make the deep pool. Nothing daily exists, only static
quizzes. The catch is seasonality: traffic will spike June to November and go quiet
otherwise. That is also when it would go viral, because every landfall week puts millions of
people on weather Twitter. Cheap to build, cheap to hold, and Tyler has no special voice
here, which is why it sits at #5.

### 6. AI-written, solver-verified deduction puzzle

Clues-by-Sam style grid logic puzzles, generated by an LLM and verified by a deterministic
solver so every puzzle has exactly one solution and never requires a guess. This is the idea
that uses Tyler's core skill most directly and the only one with a real generation moat. It
is #6 because it goes head-on with a beloved incumbent, needs a solver and a generator and
UI polish before anyone can judge it, and the differentiator is invisible to players. Keep
it for when one of the others has an audience to launch to.

### Honorable mention, unverified

**Guess the rocket / launch vehicle.** Searches were inconclusive (drowned out by Rocket
League). Wikipedia lists are CC BY-SA and the audience (r/space 26M, r/spacex) is large. The
dataset is small (~150 vehicles), so it would repeat inside six months unless it became
"guess the mission." Worth one more search before dismissing.

## Rejected, with the incumbent named

| Idea | Why not | Who already does it |
|---|---|---|
| Stock chart / ticker guessing | Crowded | Stockle (bearbull.io), Wallstreetle, Guess the Stock Chart, Stockdle, Financhle, ChartGame daily challenge |
| Historical prices / inflation | Crowded | NostalgiaFlation Inflation Wordle, PricedIn, Pricele, EconArena "Inflation or Nah" |
| Cars from specs | Crowded, and well done | Carlee, Cardle Classic, TurboDle, Vroomdle, CarSpotr |
| Food from macros / calories | Crowded | customwordle Guess the Food, Shredle, Calordle, CalGuesser, NutriGuessr |
| Dog breeds | Crowded | Dogsdle, Dogdle, Dogle, Doggle |
| Aircraft | Crowded | Planespottle, Plandle, PlaneQ |
| Colleges | Done twice | Collegedle, Collegele |
| Jobs / salaries | Exists | Workdle |
| Board games | Crowded | BGdle, Boardle, BoardGameQuiz |
| Lego sets | Crowded | Bricksdle, Guess the Set, Brickdle |
| Medications | Crowded | Pharmordle, Drugdle, Pharmdle, Druggle |
| US national parks | Exists | Globle+ Parks, GuessAndMatch |
| Movies / actors / TV | Saturated, Laszlo's own turf | FilmLink (#1 on dles.gg), Actorle, Framed, Moviedle, Flickle |
| Video games | Saturated | Gamedle, GuessThe.Game, RNGdle |
| GitHub repos / code | Exists | GitHubGuessr, CodeGuessr, Guess the Repo |
| Which AI model wrote this | Exists | guessthemodel.app |
| Cameras from a photo | Exists (spec-based still open, see #4) | GuessTheGear |
| Home Assistant / smart home | Audience too small for ads | — |
| 3D printing | Audience too small | — |
| Home-services job pricing | Wrong audience (homeowners), no free regional data | — |
| Anything with product images | Box art, die shots, and product photos are copyrighted | — |

# Side project — ad-supported daily games

**This folder is self-contained on purpose.** It is meant to be moved out of the AI Work
repo and become its own project. Nothing in here depends on `../context/` or `../CLAUDE.md`;
the `CLAUDE.md` in this folder carries the standing rules for when it stands alone.

Longview Automation is the business and its plan does not change because of anything here.

## Files

| File | What it is |
|---|---|
| `CLAUDE.md` | Standing rules for this project when it is its own repo |
| `actorle-review-2026-09-05.md` | What actorle.com is, what it really earns, what to copy |
| `ideas-shortlist-2026-09-05.md` | Six ideas that passed the screen, ranked, plus 20 that failed and why |
| `gpu-game/research.md` | Full research on the #1 idea: the guess-the-GPU/CPU game |
| `data/build.py` | Evening 1: pulls the Wikipedia tables via the MediaWiki API and writes `data/items.json` |
| `data/items.json` | The dataset: desktop GPUs (2006+) and CPUs (2006+), one row per part, CC BY-SA 4.0 |
| `data/review-sample.md` | Coverage table and 20 random rows for hand-checking, regenerated each build |
| `data/LICENSE.md` | CC BY-SA attribution, field conventions, and the trademark note |
| `data/overrides.json` | Cited hand corrections, verifications and disputes, applied on every build |
| `marketing/launch-kit.md` | Pitch, directory list, Show HN / LTT / Reddit post drafts, posting schedule, traction targets |

## Status (2026-09-05)

- Research done. **Idea #1 approved. Working name: Specdle.** Nothing bought.
- Evening 1 done: `data/build.py` builds the dataset from Wikipedia. Two external fact reviews
  of `data/review-sample.md` acted on; conventions in `data/LICENSE.md`.
- Evenings 2–4 compressed into one day on Tyler's call. **Live 2026-09-05** at
  https://jolly-mud-0788fde0f.6.azurestaticapps.net (Azure SWA Free, `specdle-rg` / `specdle`).
  Launch checklist below.

## Running the game locally

```sh
npm install
npm test        # hint logic, share text, search, streaks
npm run dev     # http://localhost:5173
npm run build   # dist/ (the deploy workflow does this on push to main)
```

Layout: `src/game/` is the logic (pure functions, tested), `src/components/` and `src/pages/`
the UI, `src/config.js` the launch-time switches (site URL, Amazon tag, GoatCounter code).
The dataset and schedule are imported straight from `data/`, so a dataset rebuild plus a
commit is a content update. Hash routes: `#/`, `#/day/YYYY-MM-DD`, `#/archive`, `#/data`,
`#/privacy`.

## Launch checklist

| Step | Owner | Status |
|---|---|---|
| Azure SWA Free created (`specdle-rg`, `specdle`) | done | ✓ |
| GitHub repo + deploy workflow + token secret | done | ✓ https://github.com/MJG4103/specdle, every push to `main` deploys |
| First deploy to the azurestaticapps.net URL | Claude | ✓ 2026-09-05, live at https://jolly-mud-0788fde0f.6.azurestaticapps.net (deployed with the SWA CLI; Actions takes over once the repo exists) |
| Buy `specdle.com` (~$12/yr) and add it as a custom domain | done | ✓ Cloudflare Registrar, $10.46/yr, auto-renew; DNS on Cloudflare (DNS only, not proxied) |
| Set `SITE_URL` in `src/config.js` once the domain is live | done | ✓ |
| Amazon Associates account; set `AMAZON_TAG` | done | ✓ approved 2026-09-05, Associate ID `specdle-20`; affiliate link and disclosure now render on result pages |
| GoatCounter account (free); set `GOATCOUNTER_CODE` | done | ✓ https://mjg.goatcounter.com |
| Submit to dles.gg, dlegames.org, alldle.net, listdle.com, dailydle.org | Claude, on Tyler's go | copy ready in `marketing/launch-kit.md` |
| Post once to LTT forum, Show HN; r/pcmasterrace only after weeks of real participation | Tyler | drafts in `marketing/launch-kit.md` |
| Google Search Console: add specdle.com, submit `/sitemap.xml` | Tyler (Google account) | |
| Journey by Mediavine application at 1,000 sessions/month | Tyler | |

## The 60-day gate (written before launch, per the rules)

Day 60 after launch: fewer than 300 daily players → stop investing, leave it running.
More → build the second mode and the phone dataset, apply to Journey. Track four numbers:
daily players, share clicks, affiliate clicks, directory referrals (all in GoatCounter).

## Running the dataset build

```sh
uv venv .venv --python 3.12
uv pip install --python .venv/bin/python pandas lxml beautifulsoup4 html5lib
.venv/bin/python data/build.py            # offline after the first run; API responses cached in data/raw/
.venv/bin/python data/build.py --refresh  # refetch from Wikipedia (the monthly n8n job does this)
```

## Two rules that outrank everything in this folder

1. **Time.** At most one evening a week once Longview selling starts. If a side project ever
   competes with a sale, it loses.
2. **Employer boundary.** Games about markets and the economy are fine. What is never fine:
   handling anyone's money, anything real-money, investment or financial advice, broker
   affiliate links, or "should you buy" content. A history quiz about the economy is a game.
   A stock picker is not.

## Moving this out into its own project

The folder is untracked in the AI Work repo, so moving it leaves nothing behind there.

```sh
mv "$HOME/Desktop/AI Work/side-project" "$HOME/Desktop/side-project"
cd "$HOME/Desktop/side-project"
git init
git add .
git commit -m "Research: Actorle review, ideas shortlist, GPU game workup"
```

Then open the new folder in Claude Code. `CLAUDE.md` here is the only context it needs.

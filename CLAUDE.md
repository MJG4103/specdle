# CLAUDE.md — Side project: daily games

Read this first when this folder is opened as its own project.

## Who I am (short version)

Tyler. Full-time at a registered investment advisor, so this is evenings and weekends only.
I ship working systems with AI assistance and I'm strong at prompting and context
engineering, but I am not a from-scratch coder — explain what each piece does and why.
I build PCs, run Home Assistant, and own a Prusa; that's the audience I belong to.

## What this project is

Small, free, daily browser games in the Wordle family, monetized with display ads and
affiliate links. The model is actorle.com: one person, ~$50/month to run, ~$3k/month at its
current traffic. See `actorle-review-2026-09-05.md`. This is a cheap lottery ticket held
alongside my real business (Longview Automation), never a replacement for it.

## Hard rules

- **Time cap:** one evening a week. Say up front if a step needs more.
- **Employer boundary:** games about markets or the economy are allowed. Never handle money,
  never real-money anything, never investment or financial advice, no broker or trading
  affiliate links, no "should you buy" content. Ambiguous means no.
- **Licensed data only.** Public domain (US government: FRED, BLS, NOAA, EPA, USDA) or
  CC BY-SA (Wikipedia) with attribution and, for CC BY-SA, the derived dataset published
  under the same license. Never scrape a site that rate-limits or forbids it (TechPowerUp,
  GSMArena, RCDB). No copyrighted images — box art, die shots, product photos.
- **Zero-cost architecture.** Static site, no backend, no accounts. Puzzle schedule is a
  committed JSON keyed by date. Stats and streaks live in localStorage. Hosting on Azure
  Static Web Apps Free via GitHub Actions. Only cost is the domain.
- **Rails over agents.** The one scheduled job (monthly dataset refresh on the Mac mini via
  n8n) is deterministic and opens a PR; it never deploys on its own. The one LLM step
  (writing the daily blurb) runs in batch and I read the output before it ships.
- **Ads only after approval, affiliate links always disclosed.** Start with Amazon
  Associates; apply to Journey by Mediavine at 1,000 sessions/month; Mediavine at 50k.
- **Every game ships with:** share text, archive, streak, a data/attribution page, privacy
  policy, and a 60-day keep-or-stop gate written down before launch.

## Stack

Vite + React + Tailwind (same as the Longview dashboard-starter, so nothing new to learn),
Azure Static Web Apps Free, GitHub Actions deploy, n8n on the mini for the monthly refresh.
Ideas that share the "guess the entity from spec hints" mechanic share one codebase.

## How to work with me

- Explain the why alongside the code.
- Flag decisions that are mine (names, domains, spending money, launching) vs. things you can
  just do.
- Prefer boring, reliable, free-tier solutions.

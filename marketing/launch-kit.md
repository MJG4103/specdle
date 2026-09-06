# Specdle launch kit

Everything needed to get the first 1,000 players, in the order it should happen. Posts go out
from Tyler's own accounts; Claude files the directory forms on request. Every link people
click shows up in GoatCounter under Referrers, so no UTM tags are needed and the share URL
stays clean.

## The one-paragraph pitch

> Specdle is a free daily game for PC builders: name the graphics card or processor from its
> specs. Type a guess and every column tells you whether the answer is newer or older, pricier
> or cheaper, more or less VRAM, more or less power, a higher or lower tier, same architecture
> or not. Eight guesses, GPU and CPU days alternate, new puzzle at midnight. No account, no app,
> stats and streaks stay in your browser. Data is CC BY-SA from Wikipedia and downloadable.

Short: **Guess the GPU or CPU from its specs. Eight guesses, one a day.**
URL: https://specdle.com · Icon: green rounded square with a white S (`public/og.png` for banners)

## Week 1: directories (the 2022 -dle games didn't have these; they send steady traffic)

| Directory | Submit at | Notes |
|---|---|---|
| dles.gg | dles.gg → "Submit a game" | Biggest; ranks by popularity, so submit early and let the share traffic lift it |
| dlegames.org | dlegames.org → Submit | **Now pay-to-list** ($10 AI draft / $20 editorial, account required). Not submitted; decide after week 2 traffic |
| alldle.net | alldle.net → Add a game | Lists 1,000+; short description works best |
| listdle.com | listdle.com → Submit | Asks for tags: hardware, pc, gaming, trivia |
| dailydle.org | dailydle.org → Submit | |
| dles.aukspot.com | form on site | Small but curated |

Submitted 2026-09-05: dles.gg, alldle.net, listdle.com, dailydle.org (free queue; they upsell $39 homepage and $9.90 priority, both declined), dles.aukspot.com (Tally form; note their rule: no generative-AI content, which matters if the daily blurb feature ships).

Fields they all ask for: name (Specdle), URL, one-line description (the "Short" line above),
category (Technology or Trivia), contact email, sometimes a 512×512 icon.

## Week 1: the two launch posts (Tyler posts, from his own accounts)

**Show HN** (news.ycombinator.com/submit, title max 80 chars):

> Show HN: Specdle – guess the GPU or CPU from its specs, a daily game

First comment, posted immediately after (HN expects the author to explain):

> I build PCs and got tired of every daily game being about movies or geography, so I made
> one for hardware. Each guess returns higher/lower arrows on year, launch price, VRAM or
> cores, rated power, tier and architecture. Eight guesses, GPU and CPU days alternate.
>
> It's a static site: no backend, no accounts, stats live in localStorage. The dataset is
> ~1,000 desktop parts since 2006 pulled from Wikipedia's GPU/CPU list tables via the
> MediaWiki API, normalized and published back under CC BY-SA with the exact revisions
> cited. The build script and the data are in the repo: github.com/MJG4103/specdle.
>
> Things I'd like feedback on: whether the tolerance bands (±1 year, ±10% price) feel
> right, and whether the tier hint reads as intended for AMD's naming.

Post between 8 and 10 am US Eastern on a weekday. Answer every comment for the first
two hours; that is what keeps a Show HN on the front page.

**Linus Tech Tips forum** (linustechtips.com → Off Topic or "Programs, Apps and Websites"):

> Made a daily "guess the GPU/CPU from specs" game — Specdle
>
> There's a long-running guess-the-GPU thread here, so I turned the idea into a daily
> puzzle: specdle.com. Type a part, get higher/lower arrows on year, price, VRAM/cores,
> power, tier and architecture. Eight guesses. GPU one day, CPU the next.
>
> Free, no account, no app. Data is from Wikipedia's list tables (CC BY-SA, downloadable
> from the site). Happy to hear what's wrong with it — I'm sure there's a card in there
> with a weird MSRP.

Then: reply to a couple of other threads that week. Forum members notice drive-by posts.

## Weeks 1–4: X/Twitter and Bluesky

The share text is the growth engine, so the goal is to get the emoji grid into hardware
Twitter. Tyler's own daily result, posted every morning for the first month with one line of
commentary ("today's was a trap for anyone who thinks all 70-class cards are cheap"). Tag
nobody. Reply to people who post their grid.

Accounts worth following and replying to (not pitching): @VideoCardz, @harukaze5719,
@momomo_us, @KOMACHI_ENSAKA, @TechEpiphany, @Hardware_Unboxed, @GamersNexus. When one of
them posts about a specific card, a reply with that day's Specdle grid if the card featured
is fair game; anything else is spam.

## Week 3+: Reddit, carefully

r/pcmasterrace allows self-promotion at a 9:1 ratio. r/buildapc bans it. r/hardware removes
low-effort links. Rule: Tyler participates for three weeks first, then posts once, framed as
a question, not an announcement:

> I made a daily "guess the GPU from its specs" game. Which card would you make the hardest
> puzzle?

Post the grid, not a banner. Respond to every comment. Never post it twice.

Smaller subs where the rule is looser and the fit is exact: r/nvidia and r/Amd (check the
weekly self-promo threads), r/pcgaming (Sunday self-promo thread), r/webgames (welcomes
new games; ask for feedback on the tolerance bands), r/IndieGaming.

## Ongoing: things that compound

- **A "hardest puzzles" post once a month** on the LTT forum and Twitter, listing the parts
  with the lowest solve rate from GoatCounter's win events. Free content, on brand.
- **Google Search Console**: Tyler adds specdle.com (Google account needed), submits
  `https://specdle.com/sitemap.xml`. The words people type are "gpu guessing game", "guess
  the graphics card game", "hardware wordle"; the title and description already carry them.
- **Ask the -dle directories for a feature** after two weeks of traffic. dles.gg has a
  "new and notable" slot.
- **A Discord bot or a Home Assistant sensor** for the daily puzzle would be the kind of
  thing this audience shares. Later.

## What "traction" means, so the gate is honest

| Day | Target | Where to read it |
|---|---|---|
| 7 | 100 players/day, 20 shares/day | GoatCounter: unique visitors; event/share |
| 30 | 300 players/day; Journey by Mediavine threshold (1,000 sessions/month) passed | GoatCounter |
| 60 | 300+ players/day sustained → keep going. Fewer → leave it running, stop investing | The gate in README |

## Not doing

Paid ads (the math never works for a free game at $4 RPM), buying followers, posting in
Discord servers uninvited, DMing creators, review-bombing competitors, anything on the
employer boundary.

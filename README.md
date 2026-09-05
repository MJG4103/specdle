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

## Status (2026-09-05)

- Research done. Idea #1 recommended. **Nothing built, nothing bought.**
- Waiting on Tyler: approve #1 (or another), choose name and domain, pick the evening slot.

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

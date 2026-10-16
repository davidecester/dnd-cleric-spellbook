# CLAUDE.md

Standalone D&D 3.5 Cleric spellbook for Caelian Vàel (Aasimar cleric, Magic + Balance domains). Plain HTML/CSS/JS, no build step, no dependencies. See `README.md` for features.

## Layout

- `index.html`: page shell. Loads `css/styles.css`, `js/spells.js`, `js/app.js`.
- `js/spells.js`: `DATA` object with the Cleric, Magic domain, and Balance domain spell lists.
- `js/app.js`: all app logic (slots, preparation, innate spells, domain powers, rendering). State is saved to `localStorage` under `caelianSpellbook`.

## Git workflow

- Never commit directly to `main`.
- Put each update on a feature branch (use the branch the session assigns, e.g. `claude/...`) and push it.
- Open a pull request into `main` for every update. If an open PR already exists for the branch, add the new commits to it and update its title/description to cover everything in it.
- If the branch's PR has already been merged, restart the branch from the latest `main` and open a new PR. Don't reuse a merged PR.
- Write commit messages that state exactly what changed (e.g. which values were corrected).

## Checks before every commit

- Run `node --check js/app.js` and `node --check js/spells.js`.
- Whenever `css/styles.css`, `js/spells.js` or `js/app.js` changes, bump the `?v=` cache-busting string on all three in `index.html` (format `YYYYMMDD-N`, e.g. `20260926-2`).

## UI conventions

- Icons are always inline SVG, never text glyphs or emoji (no `×`, `★`, `☆`, `−`, `+`, `→`, `↗` used as icons). Text glyphs center differently on each device's font.
- Use the `icon(name, size)` helper and `ICON_PATHS` at the top of `js/app.js` (16×16 viewBox, `currentColor`), and add new icons there. Use `inlineIcon(name)` inside running text.
- Icon-only buttons need an `aria-label`. The SVG itself is `aria-hidden`. Center icons with `display:grid; place-items:center` (or inline-flex), not `line-height`.

## Rules accuracy

Game mechanics must follow D&D 3.5 rules as written (RAW). Don't add hardcoded per-character or per-level adjustments. If something looks off-table, tell the user what it does and where before removing it.

- `BASE_CLERIC_SLOTS`: 20 rows (cleric level 1–20) of base spells/day for spell levels 0–9, from PHB Table 3-6 (The Cleric). It excludes domain slots and Wisdom bonus spells.
- `bonusSpells(level)`: PHB Table 1-1. `1 + floor((wisMod - level) / 4)` when `wisMod >= level`, else 0. Cantrips (level 0) never get bonus spells.
- `slotInfo(level)`: normal slots are base + `bonusSpells` only. There's 1 domain slot per spell level 1–9 and none at level 0. A spell level needs Wisdom ≥ 10 + spell level.
- A previous non-RAW +1 first-level slot (`CAELIAN_FIRST_LEVEL_ADJUSTMENT`) was a typo and has been removed. Don't reintroduce it.
- Sanity check: Cleric 5 / WIS 23 gives 0th: 5, 1st: 3+2, 2nd: 2+2, 3rd: 1+1, plus 1 domain slot at each of 1st–3rd.

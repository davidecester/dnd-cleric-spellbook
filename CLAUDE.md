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

## Character domains

Caelian's **current domains: Magic + Balance.** A cleric has two domains. They can only be swapped for domains on these allowed lists (the user's Italian names in brackets):

- **Deity-concept domains**: Law (legge), Good (bene), Protection (protezione), Inquisition (inquisizione). These are for Caelian's own deity concept. The campaign uses divine shards and lets characters ascend to godhood.
- **Worshipped deity's domains**: Nature (natura), Magic (magia), Balance (equilibrio), Earth (terra). These come from the deity Caelian worships as a cleric. The user says Nature and Earth are the Faerûn (Forgotten Realms) versions.

Ask the user which version or book to use if a domain appears in more than one, e.g. Earth is also in the PHB.

Decided versions (ask the user before changing these):

- **Nature**: use Realms Help's **Nature (Shaman)** domain. It's the Rokugan shaman domain from *Oriental Adventures*, not a standard Faerûn cleric domain. Realms Help's Faerûn cleric list has no Nature domain. The user chose it anyway and will ask for a swap if that changes.
  - Granted power: rebuke or command normal animals or plant creatures as an evil cleric rebukes or commands undead. 3 + Cha modifier uses per day.
  - Spells: 1 Trance, 2 Commune with Lesser Spirit, 3 Possess Animal, 4 Elemental Ward, 5 Commune with Greater Spirit, 6 Transport via Plants, 7 Control Weather, 8 Animal Shapes, 9 Shapechange. Levels 1–5 are *Oriental Adventures* (some also in *Complete Arcane* / *Player's Guide to Faerûn*), so they need the user to paste the text. Levels 6–9 are PHB.
- **Earth**: the Faerûn Earth domain is identical to the PHB one, so use the PHB/SRD.
  - Granted power: turn or destroy air creatures as a good cleric turns undead, and rebuke or command earth creatures as an evil cleric rebukes undead. 3 + Cha modifier uses per day.
  - Spells: 1 Magic Stone, 2 Soften Earth and Stone, 3 Stone Shape, 4 Spike Stones, 5 Wall of Stone, 6 Stoneskin, 7 Earthquake, 8 Iron Body, 9 Elemental Swarm (earth only).
- Most likely next swap: Magic → Earth. Both granted powers above scale with Charisma, so ask for Caelian's Cha score before coding one.

### Where domain rules come from

- Core domains (Law, Good, Protection, Magic, Earth): Player's Handbook / D&D 3.5 SRD (d20srd.org). Spell cards link to `https://www.d20srd.org/srd/spells/<name>.htm`.
- Balance: *Spell Compendium* (granted power cited as p. 271). Spells with a `ref` starting "Spell Compendium" link to the book page in `spellReference()`.
- Inquisition: *Complete Divine* / *Spell Compendium*. Nature (Shaman): *Oriental Adventures*, via Realms Help. Earth: PHB (the Faerûn version is the same).
- The user's reference for the Faerûn domains is Realms Help. Nature: https://www.realmshelps.net/deities/domain/Nature_(Shaman). Earth is on the same site under `/deities/domain/`. These cloud sessions can't reach the site unless the environment's network policy allows `www.realmshelps.net`. If it's blocked, ask the user to paste the granted power and spell list.
- Check the actual book for each domain's granted power and its 1st–9th level spell list before coding it. Don't guess. Write spell descriptions in this sheet's own words, as the existing ones are.

### Changing a domain: everything to update

Domains are hardcoded by name. Swapping one means updating all of these:

- `js/spells.js`: the `DATA.<domain>` spell list (levels 1–9) and its `ref`s.
- `js/app.js`:
  - spell detail entries keyed `"<domain>|<level>|<Spell>"`
  - `BUILTIN_POWERS` and `DOMAIN_POWER_ORDER` (the granted power, uses per day, and the source citation)
  - `sourceLabel`
  - the source switch in `allSpells`
  - every `allSpells("magic"),allSpells("balance")` concatenation
  - the domain-slot notes that say "Magic and Balance"
  - the empty-state text in Prepared Today
- `index.html`: the header badges, the domain tabs (`data-tab`), and the "Granted powers from your Magic and Balance domains" notes (desktop and mobile).
- `README.md`: the domain names and sources.
- Saved `localStorage` keys use `"<domain>|level|Spell"`. Prepared or favorited spells from a removed domain become orphaned, so drop them on load.

## Rules accuracy

Game mechanics must follow D&D 3.5 rules as written (RAW). Don't add hardcoded per-character or per-level adjustments. If something looks off-table, tell the user what it does and where before removing it.

- `BASE_CLERIC_SLOTS`: 20 rows (cleric level 1–20) of base spells/day for spell levels 0–9, from PHB Table 3-6 (The Cleric). It excludes domain slots and Wisdom bonus spells.
- `bonusSpells(level)`: PHB Table 1-1. `1 + floor((wisMod - level) / 4)` when `wisMod >= level`, else 0. Cantrips (level 0) never get bonus spells.
- `slotInfo(level)`: normal slots are base + `bonusSpells` only. There's 1 domain slot per spell level 1–9 and none at level 0. A spell level needs Wisdom ≥ 10 + spell level.
- A previous non-RAW +1 first-level slot (`CAELIAN_FIRST_LEVEL_ADJUSTMENT`) was a typo and has been removed. Don't reintroduce it.
- Sanity check: Cleric 5 / WIS 23 gives 0th: 5, 1st: 3+2, 2nd: 2+2, 3rd: 1+1, plus 1 domain slot at each of 1st–3rd.

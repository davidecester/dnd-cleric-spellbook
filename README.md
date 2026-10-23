# Caelian Cleric Spellbook

A responsive, standalone D&D 3.5 Cleric spellbook for Caelian Vàel, an Aasimar cleric (Earth and Balance domains by default). It includes the full Cleric spell list, the spell lists of every domain Caelian can choose, preparation tracking, bookmarks, spell details, and editable Cleric level, Wisdom and Charisma values.

## Features

- Full stat blocks for every spell (casting time, range, target, duration, save, spell resistance, components), plus a quick summary and a full description in plain language. The rules reference link is kept on each card for edge cases.
- Preparation tracking with Cleric and domain slots, calculated from Cleric level and Wisdom, and spell save DCs by level.
- Domain settings: swap either domain, or add an optional third, from Nature, Magic, Balance, Earth, Law, Good, Protection and Inquisition. Tabs, colours, domain powers and preparation follow the choice. A third domain is not standard for a plain cleric; the settings say so, and it still uses the one domain slot per spell level.
- Innate spells: racial spell-like abilities, cast like spells (default: Aasimar *daylight* 1/day). Choose the spell, uses per day, and a note in Character settings.
- Domain powers for each chosen domain, e.g. the Balance power (1/day, add Wisdom modifier to AC for 1 round per cleric level) or the Earth power (3 + Charisma modifier uses per day). Values update from Cleric level, Wisdom and Charisma.
- Innate spells and domain powers track their own daily uses and are not reset by clearing prepared spells.
- Prepared Today: each spell row has its Prepared stepper with a used count under it (e.g. "1 / 3 used"); a fully used spell is dimmed but can still be opened. In the spell card, "Use spell" adds one use each press until every prepared copy is used, and Undo takes one back. A "New day: reset used spells" button above the list resets used spells and innate and domain power uses, keeping the preparation. Slot cards show how many spells are left to cast at each level. While the spell card or the mobile tools drawer is open, the page behind it does not scroll.
- Colour-coded: gold for Cleric spells and preparation; each domain has its own colour for its tab, badge, prepared spells and power card.

## Use locally

Open `index.html` in a modern browser. No install, build step, or server is required.

## Notes

- Prepared spells, cast marks, bookmarks, domains, innate spells, level, Wisdom and Charisma are saved in the browser when local storage is available.
- The spellbook works offline. Text uses the system font (SF Pro on Apple devices); other devices load Geist when online and use their system font offline. Rules-reference links need an internet connection.
- Spell descriptions are written in the sheet's own words. Balance Domain spells come from *Spell Compendium*; Nature (Shaman) 1st–5th level spells come from *Oriental Adventures*; everything else comes from the D&D 3.5 SRD.

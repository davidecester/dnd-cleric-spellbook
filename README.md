# Caelian Cleric Spellbook

A responsive, standalone D&D 3.5 Cleric spellbook for Caelian Vàel, an Aasimar cleric of the Magic and Balance domains. It includes the full Cleric, Magic Domain, and Balance Domain spell lists, preparation tracking, bookmarks, spell details, and editable Cleric level, Wisdom and Charisma values.

## Features

- Full stat blocks for every spell (casting time, range, target, duration, save, spell resistance, components), plus a quick summary and a full description in plain language. The rules reference link is kept on each card for edge cases.
- Preparation tracking with Cleric and domain slots, calculated from Cleric level and Wisdom, and spell save DCs by level.
- Innate spells: racial spell-like abilities, cast like spells (default: Aasimar *daylight* 1/day). Choose the spell, uses per day, and a note in Character settings.
- Domain powers: the Balance power (1/day, add Wisdom modifier to AC for 1 round per cleric level) and the always-active Magic power (use scrolls and wands as a wizard of half your cleric level). Values update from Cleric level and Wisdom.
- Innate spells and domain powers track their own daily uses and are not reset by clearing prepared spells.
- Colour-coded lists: gold for Cleric spells and preparation, silver-blue for domain spells.

## Use locally

Open `index.html` in a modern browser. No install, build step, or server is required.

## Notes

- Prepared spells, bookmarks, innate spells, level, Wisdom and Charisma are saved in the browser when local storage is available.
- The spellbook works offline. Text uses the system font (SF Pro on Apple devices); other devices load Geist when online and use their system font offline. Rules-reference links need an internet connection.
- Spell descriptions are written in the sheet's own words. Balance Domain spells come from *Spell Compendium*; core spells come from the D&D 3.5 SRD.

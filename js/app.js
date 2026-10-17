const BASE_CLERIC_SLOTS=[
 [3,1],[4,2],[4,2,1],[5,3,2],[5,3,2,1],[5,3,3,2],[6,4,3,2,1],[6,4,3,3,2],[6,4,4,3,2,1],[6,4,4,3,3,2],
 [6,5,4,4,3,2,1],[6,5,4,4,3,3,2],[6,5,5,4,4,3,2,1],[6,5,5,4,4,3,3,2],[6,5,5,5,4,4,3,2,1],[6,5,5,5,4,4,3,3,2],[6,5,5,5,5,4,4,3,2,1],[6,5,5,5,5,4,4,3,3,2],[6,5,5,5,5,5,4,4,3,3],[6,5,5,5,5,5,4,4,4,4]
];
// Inline SVG icons (stroke/fill use currentColor). Use these instead of text glyphs so icons center the same on every font.
const ICON_PATHS={
 close:'<path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/>',
 minus:'<path d="M3.5 8h9"/>',
 plus:'<path d="M3.5 8h9M8 3.5v9"/>',
 star:'<path fill="currentColor" d="M8 1.6l1.98 4.01 4.42.64-3.2 3.12.76 4.4L8 11.69l-3.96 2.08.76-4.4-3.2-3.12 4.42-.64z"/>',
 starOutline:'<path d="M8 1.6l1.98 4.01 4.42.64-3.2 3.12.76 4.4L8 11.69l-3.96 2.08.76-4.4-3.2-3.12 4.42-.64z"/>',
 arrowRight:'<path d="M3 8h10M9 4l4 4-4 4"/>',
 external:'<path d="M6 3.5H3.5v9h9V10M9 3.5h3.5V7M12.5 3.5L7 9"/>'
};
function icon(name,size=16,cls="icon"){return `<svg class="${cls}" viewBox="0 0 16 16" width="${size}" height="${size}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</svg>`;}
const inlineIcon=name=>icon(name,14,"icon icon-inline");
const STAT_OVERRIDES={
  "cleric|0|Detect Magic":{casting:"Standard action",range:"60 ft.",target:"Cone-shaped emanation",duration:"Concentration, up to 1 min./level",save:"None",sr:"No",components:"V, S"},
  "cleric|0|Guidance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 minute or until discharged",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|0|Light":{casting:"Standard action",range:"Touch",target:"Object touched",duration:"10 min./level",save:"None",sr:"No",components:"V, DF"},
  "cleric|0|Resistance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 minute",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|1|Bless":{casting:"Standard action",range:"50 ft.",target:"Allies in a 50-ft. burst",duration:"1 min./level",save:"None",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|1|Cure Light Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|1|Divine Favor":{casting:"Standard action",range:"Personal",target:"You",duration:"1 minute",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|1|Magic Weapon":{casting:"Standard action",range:"Touch",target:"Weapon touched",duration:"1 min./level",save:"Will (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, DF"},
  "cleric|1|Shield of Faith":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|2|Cure Moderate Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|2|Spiritual Weapon":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Magic weapon",duration:"1 round/level",save:"None",sr:"Yes",components:"V, S, DF"},
  "cleric|3|Dispel Magic":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One spellcaster, creature, or object; or 20-ft. burst",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Magic Vestment":{casting:"Standard action",range:"Touch",target:"Armor or shield touched",duration:"1 hour/level",save:"Will (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, DF"},
  "cleric|3|Protection from Energy":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level or until discharged",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "magic|3|Dispel Magic":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One spellcaster, creature, or object; or 20-ft. burst",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "magic|1|Magic Aura":{casting:"Standard action",range:"Touch",target:"One object weighing up to 5 lb./level",duration:"1 day/level (D)",save:"None",sr:"No",components:"V, S, F"},
  "magic|2|Identify":{casting:"1 hour",range:"Touch",target:"One touched object",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, DF"},
  "magic|4|Imbue with Spell Ability":{casting:"10 minutes",range:"Touch",target:"Creature touched",duration:"Permanent until discharged (D)",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "magic|5|Spell Resistance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "magic|6|Antimagic Field":{casting:"Standard action",range:"10 ft.",target:"10-ft.-radius emanation centered on you",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S, M/DF"},
  "magic|7|Spell Turning":{casting:"Standard action",range:"Personal",target:"You",duration:"Until expended or 10 min./level",save:"None",sr:"No",components:"V, S, M/DF"},
  "magic|8|Protection from Spells":{casting:"Standard action",range:"Touch",target:"Up to one creature touched per four levels",duration:"10 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M, F"},
  "magic|9|Mage's Disjunction":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"All magical effects and magic items in a 40-ft.-radius burst",duration:"Instantaneous",save:"Will (object)",sr:"No",components:"V"},
  "balance|1|Make Whole":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One object of up to 10 cu. ft./level",duration:"Instantaneous",save:"Will negates (harmless, object)",sr:"Yes (harmless, object)",components:"V, S"},
  "balance|2|Calm Emotions":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Creatures in a 20-ft.-radius spread",duration:"Concentration, up to 1 round/level (D)",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "balance|3|Clarity of Mind":{casting:"Standard action",range:"Touch",target:"Living creature touched",duration:"1 hour/level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "balance|4|Dismissal":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One extraplanar creature",duration:"Instantaneous",save:"Will negates; see text",sr:"Yes",components:"V, S, DF"},
  "balance|5|Sanctuary, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which are more than 30 ft. apart",duration:"1 round/level",save:"Will negates",sr:"No",components:"V, S, DF"},
  "balance|6|Banishment":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One or more extraplanar creatures, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will negates",sr:"Yes",components:"V, S, F (optional; see text)"},
  "balance|7|Word of Balance":{casting:"Standard action",range:"30 ft.",target:"Creatures in a 30-ft.-radius spread centered on you",duration:"Instantaneous",save:"None or Will negates; see text",sr:"Yes",components:"V"},
  "balance|8|Protection from Spells":{casting:"Standard action",range:"Touch",target:"Up to one creature touched per four levels",duration:"10 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M, F"},
  "balance|9|Weighed in the Balance":{casting:"Standard action",range:"30 ft.",target:"Creatures in a 30-ft.-radius spread centered on you",duration:"Instantaneous",save:"Will negates",sr:"Yes",components:"V"},
  "cleric|0|Create Water":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"Up to 2 gallons/level of water",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "cleric|0|Cure Minor Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|0|Detect Poison":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature, one object, or a 5-ft. cube",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "cleric|0|Inflict Minor Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|0|Mending":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One object of up to 1 lb./level",duration:"Instantaneous",save:"Will negates (harmless, object)",sr:"Yes (harmless, object)",components:"V, S"},
  "cleric|0|Purify Food and Drink":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"1 cu. ft./level of contaminated food and water",duration:"Instantaneous",save:"Will negates (harmless, object)",sr:"No",components:"V, S"},
  "cleric|0|Read Magic":{casting:"Standard action",range:"Personal",target:"You",duration:"10 min./level",save:"None",sr:"No",components:"V, S, F"},
  "cleric|0|Virtue":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 minute",save:"None",sr:"No",components:"V, S"},
  "cleric|1|Bane":{casting:"Standard action",range:"50 ft.",target:"Enemies in a 50-ft. burst",duration:"1 min./level",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "cleric|1|Bless Water":{casting:"1 minute",range:"Touch",target:"Flask of water touched",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|1|Cause Fear":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One living creature with 5 or fewer HD",duration:"1d4 rounds",save:"Will partial",sr:"Yes",components:"V, S"},
  "cleric|1|Command":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One living creature",duration:"1 round",save:"Will negates",sr:"Yes",components:"V"},
  "cleric|1|Comprehend Languages":{casting:"Standard action",range:"Personal",target:"You",duration:"10 min./level",save:"None",sr:"No",components:"V, S, M/DF"},
  "cleric|1|Curse Water":{casting:"1 minute",range:"Touch",target:"Flask of water touched",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|1|Deathwatch":{casting:"Standard action",range:"30 ft.",target:"Cone-shaped emanation",duration:"10 min./level",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|1|Detect Chaos/Evil/Good/Law":{casting:"Standard action",range:"60 ft.",target:"Cone-shaped emanation",duration:"Concentration, up to 10 min./level (D)",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|1|Detect Undead":{casting:"Standard action",range:"60 ft.",target:"Cone-shaped emanation",duration:"Concentration, up to 10 min./level (D)",save:"None",sr:"No",components:"V, S, M/DF"},
  "cleric|1|Doom":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One living creature",duration:"1 min./level",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "cleric|1|Endure Elements":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"24 hours",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|1|Entropic Shield":{casting:"Standard action",range:"Personal",target:"You",duration:"1 min./level (D)",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|1|Hide from Undead":{casting:"Standard action",range:"Touch",target:"One or more creatures, no two of which can be more than 30 ft. apart",duration:"10 min./level (D)",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|1|Inflict Light Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|1|Magic Stone":{casting:"Standard action",range:"Touch",target:"Up to three pebbles touched",duration:"30 minutes",save:"None",sr:"No (harmless, object)",components:"V, S, M/DF"},
  "cleric|1|Obscuring Mist":{casting:"Standard action",range:"20 ft.",target:"Cloud spreads in 20-ft. radius, 20 ft. high",duration:"1 min./level",save:"None",sr:"No",components:"V, S"},
  "cleric|1|Protection from Chaos/Evil/Good/Law":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level (D)",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF, F"},
  "cleric|1|Remove Fear":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature plus one additional creature per four levels",duration:"Instantaneous; see text",save:"None",sr:"Yes (harmless)",components:"V, S"},
  "cleric|1|Sanctuary":{casting:"Standard action",range:"Personal",target:"You",duration:"1 round/level",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "cleric|1|Summon Monster I":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|2|Aid":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"None",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|2|Align Weapon":{casting:"Standard action",range:"Touch",target:"Weapon touched or 50 arrows/bolts",duration:"1 min./level",save:"Will negates (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, DF"},
  "cleric|2|Augury":{casting:"1 minute",range:"Personal",target:"You",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, F"},
  "cleric|2|Bear's Endurance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF"},
  "cleric|2|Bull's Strength":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF"},
  "cleric|2|Consecrate":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"20-ft.-radius emanation",duration:"2 hours/level",save:"None",sr:"No",components:"V, S, M, DF"},
  "cleric|2|Darkness":{casting:"Standard action",range:"Touch",target:"Object touched",duration:"10 min./level",save:"None",sr:"No",components:"V, M/DF"},
  "cleric|2|Death Knell":{casting:"Standard action",range:"Touch",target:"Living creature touched",duration:"Instantaneous or 10 min./HD of target",save:"Will negates",sr:"Yes",components:"V, S"},
  "cleric|2|Delay Poison":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 hour/level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|2|Desecrate":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"20-ft.-radius emanation",duration:"2 hours/level",save:"None",sr:"No",components:"V, S, M, DF"},
  "cleric|2|Eagle's Splendor":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF"},
  "cleric|2|Enthrall":{casting:"1 round",range:"Medium (100 ft. + 10 ft./level)",target:"Any number of creatures",duration:"1 hour or less",save:"Will negates",sr:"Yes",components:"V, S"},
  "cleric|2|Find Traps":{casting:"Standard action",range:"Personal",target:"You",duration:"1 round/level",save:"None",sr:"No",components:"V, S"},
  "cleric|2|Gentle Repose":{casting:"Standard action",range:"Touch",target:"Corpse touched",duration:"1 day/level (D)",save:"Will negates (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, M/DF"},
  "cleric|2|Hold Person":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One humanoid creature",duration:"1 round/level (D)",save:"Will negates",sr:"Yes",components:"V, S, F/DF"},
  "cleric|2|Inflict Moderate Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|2|Owl's Wisdom":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF"},
  "cleric|2|Remove Paralysis":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"Up to four creatures, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"None",sr:"Yes (harmless)",components:"V, S"},
  "cleric|2|Resist Energy":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|2|Lesser Restoration":{casting:"3 rounds",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|2|Shatter":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"10-ft.-radius spread, or one solid object, or one crystalline creature",duration:"Instantaneous",save:"Will negates (object) or Fortitude negates",sr:"Yes",components:"V, S, M"},
  "cleric|2|Shield Other":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"You and one touched creature",duration:"1 hour/level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M"},
  "cleric|2|Silence":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One object, creature, or point in space",duration:"1 round/level",save:"Will negates (harmless, object) or Will negates",sr:"Yes (harmless, object) or Yes",components:"V, S"},
  "cleric|2|Sound Burst":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"10-ft.-radius spread",duration:"Instantaneous",save:"Fortitude partial",sr:"Yes",components:"V, S, M/DF"},
  "cleric|2|Status":{casting:"10 minutes",range:"Touch",target:"Six creatures touched, maximum",duration:"1 hour/level (D)",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|2|Summon Monster II":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|2|Undetectable Alignment":{casting:"Standard action",range:"Touch",target:"Creature or object touched",duration:"24 hours",save:"Will negates (object)",sr:"Yes (object)",components:"V, S, M"},
  "cleric|2|Zone of Truth":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"20-ft.-radius emanation",duration:"1 min./level",save:"Will negates",sr:"Yes",components:"V, S"},
  "cleric|3|Animate Dead":{casting:"Standard action",range:"Touch",target:"One or more corpses touched",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|3|Bestow Curse":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Permanent",save:"Will negates",sr:"Yes",components:"V, S"},
  "cleric|3|Blindness/Deafness":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One living creature",duration:"Permanent (D)",save:"Fortitude negates",sr:"Yes",components:"V"},
  "cleric|3|Contagion":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Fortitude negates",sr:"Yes",components:"V, S"},
  "cleric|3|Continual Flame":{casting:"Standard action",range:"Touch",target:"Object touched",duration:"Permanent",save:"None",sr:"No",components:"V, S, M"},
  "cleric|3|Create Food and Water":{casting:"Standard action",range:"10 ft.",target:"Food and water to sustain 3 humans/level or 1 horse/level for 24 hours",duration:"24 hours; see text",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Cure Serious Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|3|Daylight":{casting:"Standard action",range:"Touch",target:"Object touched",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Deeper Darkness":{casting:"Standard action",range:"Touch",target:"Object touched",duration:"24 hours (D)",save:"None",sr:"No",components:"V, M/DF"},
  "cleric|3|Glyph of Warding":{casting:"10 minutes",range:"Touch",target:"Glyph covers up to 5 sq. ft./level",duration:"Permanent until discharged (D)",save:"Special; see text",sr:"Yes",components:"V, S, M"},
  "cleric|3|Helping Hand":{casting:"10 minutes",range:"5 miles",target:"Hand-shaped light",duration:"1 hour/level (D)",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Inflict Serious Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|3|Invisibility Purge":{casting:"Standard action",range:"Personal",target:"5-ft./level radius",duration:"1 min./level (D)",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Locate Object":{casting:"Standard action",range:"Long (400 ft. + 40 ft./level)",target:"Circular area, radius 400 ft. + 40 ft./level",duration:"10 min./level",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|3|Magic Circle against Chaos/Evil/Good/Law":{casting:"Standard action",range:"Touch",target:"Creature touched, or 10-ft.-radius emanation centered on you",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S, M/DF, F"},
  "cleric|3|Meld into Stone":{casting:"Standard action",range:"Personal",target:"You",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Obscure Object":{casting:"Standard action",range:"Touch",target:"Object touched or 5-ft.-radius area",duration:"8 hours (D)",save:"Will negates (object)",sr:"Yes (object)",components:"V, S, M"},
  "cleric|3|Prayer":{casting:"Standard action",range:"40 ft.",target:"All allies and foes within a 40-ft.-radius burst centered on you",duration:"1 round/level",save:"None",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|3|Remove Blindness/Deafness":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|3|Remove Curse":{casting:"Standard action",range:"Touch",target:"Creature or object touched",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Remove Disease":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "cleric|3|Searing Light":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Ray",duration:"Instantaneous",save:"None",sr:"Yes",components:"V, S"},
  "cleric|3|Speak with Dead":{casting:"10 minutes",range:"10 ft.",target:"One dead creature",duration:"10 min./level",save:"Will negates",sr:"No",components:"V, S, M"},
  "cleric|3|Stone Shape":{casting:"Standard action",range:"Touch",target:"Stone or stone object touched, up to 10 cu. ft. + 1 cu. ft./level",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|3|Summon Monster III":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|3|Water Breathing":{casting:"Standard action",range:"Touch",target:"Living creatures touched",duration:"2 hours/level (D); see text",save:"None",sr:"No",components:"V, S, M/DF"},
  "cleric|3|Water Walk":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level (D)",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|3|Wind Wall":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Wall up to 10 ft./level long and 5 ft./level high",duration:"1 round/level",save:"None",sr:"No",components:"V, S, M/DF"},
  "cleric|4|Air Walk":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level (D); see text",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|4|Control Water":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Water in an area up to 2 squares/level by 2 squares/level by 2 sq./level (10-ft. squares)",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S"},
  "cleric|4|Cure Critical Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|4|Death Ward":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|4|Dimensional Anchor":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Ray",duration:"1 min./level",save:"None",sr:"Yes",components:"V, S"},
  "cleric|4|Discern Lies":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Concentration, up to 1 round/level",save:"Will negates",sr:"No",components:"V, S, DF"},
  "cleric|4|Divination":{casting:"10 minutes",range:"Personal",target:"You",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, DF"},
  "cleric|4|Divine Power":{casting:"Standard action",range:"Personal",target:"You",duration:"1 round/level",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|4|Freedom of Movement":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF"},
  "cleric|4|Giant Vermin":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"Up to three vermin, no two of which can be more than 30 ft. apart",duration:"1 min./level",save:"None",sr:"No",components:"V, S"},
  "cleric|4|Inflict Critical Wounds":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|4|Magic Weapon, Greater":{casting:"Standard action",range:"Touch",target:"Weapon touched or 50 projectiles (all in contact at casting)",duration:"1 hour/level",save:"Will negates (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, M"},
  "cleric|4|Neutralize Poison":{casting:"Standard action",range:"Touch",target:"Creature or object touched",duration:"Instantaneous",save:"Will negates (harmless) or Fortitude negates (object)",sr:"Yes (harmless) or Yes (object)",components:"V, S"},
  "cleric|4|Planar Ally, Lesser":{casting:"10 minutes",range:"Close (25 ft. + 5 ft./2 levels)",target:"One called creature",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|4|Poison":{casting:"Standard action",range:"Touch",target:"Living creature touched",duration:"Instantaneous; see text",save:"Fortitude partial",sr:"Yes",components:"V, S"},
  "cleric|4|Repel Vermin":{casting:"Standard action",range:"10 ft.",target:"10-ft.-radius emanation centered on you",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S, M/DF"},
  "cleric|4|Restoration":{casting:"3 rounds",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M"},
  "cleric|4|Sending":{casting:"10 minutes",range:"Unlimited",target:"One creature",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "cleric|4|Spell Immunity":{casting:"Standard action",range:"Touch",target:"One creature/four levels",duration:"10 min./level",save:"Will negates (harmless)",sr:"No",components:"V, S, DF"},
  "cleric|4|Summon Monster IV":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|4|Tongues":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, M/DF"},
  "cleric|5|Atonement":{casting:"1 hour",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"None or Will negates (harmless); see text",sr:"Yes (harmless) or No; see text",components:"V, S, M, DF, XP"},
  "cleric|5|Break Enchantment":{casting:"1 minute",range:"Touch",target:"Up to 5 creatures",duration:"Instantaneous",save:"None or Will negates; see text",sr:"Yes; see text",components:"V, S, M"},
  "cleric|5|Command, Greater":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One living creature/level, no two of which can be more than 30 ft. apart",duration:"1 round/level",save:"Will negates",sr:"Yes",components:"V"},
  "cleric|5|Commune":{casting:"10 minutes",range:"Personal",target:"You",duration:"1 min./level",save:"None",sr:"No",components:"V, S, M, DF, XP"},
  "cleric|5|Cure Light Wounds, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|5|Disrupting Weapon":{casting:"Standard action",range:"Touch",target:"Melee weapon touched",duration:"1 round/level",save:"Will negates (object)",sr:"Yes (object)",components:"V, S"},
  "cleric|5|Flame Strike":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Cylinder (10-ft. radius, 40 ft. high)",duration:"Instantaneous",save:"Reflex half",sr:"Yes",components:"V, S, M/DF"},
  "cleric|5|Hallow":{casting:"24 hours",range:"Touch",target:"40-ft.-radius emanation",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, DF"},
  "cleric|5|Inflict Light Wounds, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|5|Insect Plague":{casting:"Standard action",range:"Long (400 ft. + 40 ft./level)",target:"Swarm of insects",duration:"1 min./level",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|5|Mark of Justice":{casting:"10 minutes",range:"Touch",target:"Creature touched",duration:"Permanent",save:"None",sr:"No",components:"V, S"},
  "cleric|5|Plane Shift":{casting:"Standard action",range:"Touch",target:"You and up to eight other touched creatures, or a single object weighing up to 50 lb./level",duration:"Instantaneous",save:"Will negates",sr:"Yes",components:"V, S, M"},
  "cleric|5|Raise Dead":{casting:"10 minutes",range:"Touch",target:"Dead creature touched",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, DF"},
  "cleric|5|Righteous Might":{casting:"Standard action",range:"Personal",target:"You",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|5|Scrying":{casting:"10 minutes",range:"See text",target:"Magical sensor",duration:"1 min./level (D)",save:"Will negates; see text",sr:"No",components:"V, S, M, F"},
  "cleric|5|Slay Living":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Fortitude partial",sr:"Yes",components:"V, S"},
  "cleric|5|Spell Resistance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|5|Summon Monster V":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|5|Symbol of Pain":{casting:"10 minutes",range:"0 ft.; see text",target:"One symbol",duration:"See text",save:"Fortitude negates",sr:"Yes",components:"V, S, M"},
  "cleric|5|Symbol of Sleep":{casting:"10 minutes",range:"0 ft.; see text",target:"One symbol",duration:"See text",save:"Will negates",sr:"Yes",components:"V, S, M"},
  "cleric|5|True Seeing":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"None",sr:"Yes (harmless)",components:"V, S, M, DF"},
  "cleric|5|Unhallow":{casting:"24 hours",range:"Touch",target:"40-ft.-radius emanation",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, DF"},
  "cleric|5|Wall of Stone":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Stone wall whose area is up to one 5-ft.-by-20-ft. section per two levels",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M/DF"},
  "cleric|6|Animate Objects":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One Small object/level; see text",duration:"1 round/level",save:"None",sr:"No",components:"V, S"},
  "cleric|6|Antilife Shell":{casting:"Standard action",range:"Personal",target:"10-ft.-radius emanation",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|6|Banishment":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One or more extraplanar creatures, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will negates",sr:"Yes",components:"V, S, F (optional; see text)"},
  "cleric|6|Bear's Endurance, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, M"},
  "cleric|6|Blade Barrier":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Wall of blades whose area is up to one 10-ft.-by-20-ft./level section",duration:"1 min./level",save:"Reflex half",sr:"Yes",components:"V, S, DF"},
  "cleric|6|Bull's Strength, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, M"},
  "cleric|6|Create Undead":{casting:"1 hour",range:"Close (25 ft. + 5 ft./2 levels)",target:"One corpse",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|6|Cure Moderate Wounds, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|6|Dispel Magic, Greater":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One spellcaster, creature, or object; or 20-ft.-radius burst",duration:"Instantaneous",save:"None",sr:"No",components:"V, S"},
  "cleric|6|Eagle's Splendor, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, M"},
  "cleric|6|Find the Path":{casting:"3 rounds",range:"Personal or touch",target:"You or creature touched",duration:"10 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF, F"},
  "cleric|6|Forbiddance":{casting:"6 rounds",range:"Touch",target:"Up to 60-ft. cube/level (S)",duration:"Permanent",save:"See text",sr:"Yes",components:"V, S, M, XP"},
  "cleric|6|Geas/Quest":{casting:"10 minutes",range:"Close (25 ft. + 5 ft./2 levels)",target:"One living creature",duration:"See text",save:"None",sr:"Yes",components:"V"},
  "cleric|6|Glyph of Warding, Greater":{casting:"10 minutes/level of spell stored",range:"Touch",target:"Glyph covers up to 5 sq. ft./level",duration:"Permanent until discharged (D)",save:"Special; see text",sr:"Yes",components:"V, S, M"},
  "cleric|6|Harm":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|6|Heal":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|6|Heroes' Feast":{casting:"10 minutes",range:"Close (25 ft. + 5 ft./2 levels)",target:"Food for one creature/level",duration:"1 hour/12 hours; see text",save:"None",sr:"No",components:"V, S"},
  "cleric|6|Inflict Moderate Wounds, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|6|Owl's Wisdom, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"1 min./level",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, M"},
  "cleric|6|Planar Ally":{casting:"10 minutes",range:"Close (25 ft. + 5 ft./2 levels)",target:"One or more called creatures",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|6|Summon Monster VI":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|6|Symbol of Fear":{casting:"10 minutes",range:"0 ft.; see text",target:"One symbol",duration:"See text",save:"Fortitude negates",sr:"Yes",components:"V, S, M"},
  "cleric|6|Symbol of Persuasion":{casting:"10 minutes",range:"0 ft.; see text",target:"One symbol",duration:"See text",save:"Will negates",sr:"Yes",components:"V, S, M"},
  "cleric|6|Undeath to Death":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"All undead creatures within a 40-ft.-radius burst",duration:"Instantaneous",save:"Will negates",sr:"Yes",components:"V, S, M"},
  "cleric|6|Wind Walk":{casting:"1 minute",range:"Touch",target:"You and other touched creatures",duration:"1 hour/level (D)",save:"None",sr:"No",components:"V, S, M"},
  "cleric|6|Word of Recall":{casting:"Standard action",range:"Touch",target:"You and touched objects or other willing creatures",duration:"Instantaneous",save:"None",sr:"No",components:"V"},
  "cleric|7|Blasphemy":{casting:"Standard action",range:"40 ft.",target:"Creatures in a 40-ft.-radius spread centered on you",duration:"Instantaneous",save:"None or Will; see text",sr:"Yes",components:"V"},
  "cleric|7|Control Weather":{casting:"10 minutes",range:"2 miles",target:"2-mile-radius circle, centered on you",duration:"4d12 hours",save:"None",sr:"No",components:"V, S, M/DF"},
  "cleric|7|Cure Serious Wounds, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|7|Destruction":{casting:"Standard action",range:"Touch",target:"Living creature touched",duration:"Instantaneous",save:"Fortitude partial",sr:"Yes",components:"V, S, M, DF"},
  "cleric|7|Dictum":{casting:"Standard action",range:"40 ft.",target:"Creatures in a 40-ft.-radius spread centered on you",duration:"Instantaneous",save:"None or Will; see text",sr:"Yes",components:"V"},
  "cleric|7|Ethereal Jaunt":{casting:"Standard action",range:"Personal",target:"You",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S"},
  "cleric|7|Holy Word":{casting:"Standard action",range:"40 ft.",target:"Creatures in a 40-ft.-radius spread centered on you",duration:"Instantaneous",save:"None or Will; see text",sr:"Yes",components:"V"},
  "cleric|7|Inflict Serious Wounds, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|7|Refuge":{casting:"1 hour",range:"Unlimited",target:"You and one other creature, or an object",duration:"Permanent until triggered",save:"None",sr:"No",components:"V, S, M"},
  "cleric|7|Regenerate":{casting:"3 full rounds",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"None",sr:"Yes (harmless)",components:"V, S, M"},
  "cleric|7|Repulsion":{casting:"Standard action",range:"10 ft./level",target:"10-ft./level-radius emanation centered on you",duration:"1 round/level (D)",save:"Will negates",sr:"Yes",components:"V, S, M/DF"},
  "cleric|7|Restoration, Greater":{casting:"10 minutes",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, XP"},
  "cleric|7|Resurrection":{casting:"1 minute",range:"Touch",target:"Dead creature touched",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, DF"},
  "cleric|7|Scrying, Greater":{casting:"Standard action",range:"See text",target:"Magical sensor",duration:"1 hour/level (D)",save:"Will negates; see text",sr:"No",components:"V, S, M, F"},
  "cleric|7|Summon Monster VII":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|7|Symbol of Stunning":{casting:"10 minutes",range:"0 ft.; see text",target:"One symbol",duration:"See text",save:"Fortitude negates",sr:"Yes",components:"V, S, M"},
  "cleric|7|Symbol of Weakness":{casting:"10 minutes",range:"0 ft.; see text",target:"One symbol",duration:"See text",save:"Fortitude negates",sr:"Yes",components:"V, S, M"},
  "cleric|7|Word of Chaos":{casting:"Standard action",range:"40 ft.",target:"Creatures in a 40-ft.-radius spread centered on you",duration:"Instantaneous",save:"None or Will; see text",sr:"Yes",components:"V"},
  "cleric|8|Antimagic Field":{casting:"Standard action",range:"10 ft.",target:"10-ft.-radius emanation centered on you",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S, M/DF"},
  "cleric|8|Cloak of Chaos":{casting:"Standard action",range:"Personal",target:"You",duration:"1 round/level",save:"None",sr:"No",components:"V, S, DF"},
  "cleric|8|Create Greater Undead":{casting:"1 hour",range:"Close (25 ft. + 5 ft./2 levels)",target:"One corpse",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|8|Cure Critical Wounds, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will half (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|8|Dimensional Lock":{casting:"Standard action",range:"Long (400 ft. + 40 ft./level)",target:"20-ft.-radius emanation",duration:"1 day/level",save:"None",sr:"No",components:"V, S, M"},
  "cleric|8|Discern Location":{casting:"1 hour",range:"Unlimited",target:"One creature or object",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M, DF, XP"},
  "cleric|8|Earthquake":{casting:"1 round",range:"Long (400 ft. + 40 ft./level)",target:"Circle, radius 80 ft. + 5 ft./level",duration:"1 round",save:"None",sr:"No",components:"V, S"},
  "cleric|8|Fire Storm":{casting:"Standard action",range:"Long (400 ft. + 40 ft./level)",target:"Two 10-ft. cubes/level in a contiguous arrangement",duration:"Instantaneous",save:"Reflex half",sr:"Yes",components:"V, S"},
  "cleric|8|Holy Aura":{casting:"Standard action",range:"20 ft.",target:"You and all allies within 20 ft.",duration:"1 round/level (D)",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF"},
  "cleric|8|Inflict Critical Wounds, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will half",sr:"Yes",components:"V, S"},
  "cleric|8|Planar Ally, Greater":{casting:"10 minutes",range:"Close (25 ft. + 5 ft./2 levels)",target:"One or more called creatures",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M"},
  "cleric|8|Shield of Law":{casting:"Standard action",range:"20 ft.",target:"You and all allies within a 20-ft.-radius burst",duration:"1 round/level (D)",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF"},
  "cleric|8|Spell Immunity, Greater":{casting:"Standard action",range:"Touch",target:"One creature/four levels",duration:"10 min./level",save:"Will negates (harmless)",sr:"No",components:"V, S, DF"},
  "cleric|8|Summon Monster VIII":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|8|Symbol of Death":{casting:"10 minutes",range:"0 ft.; see text",target:"One symbol",duration:"See text",save:"Fortitude negates",sr:"Yes",components:"V, S, M"},
  "cleric|8|Symbol of Insanity":{casting:"10 minutes",range:"0 ft.; see text",target:"One symbol",duration:"See text",save:"Will negates",sr:"Yes",components:"V, S, M"},
  "cleric|8|Unholy Aura":{casting:"Standard action",range:"20 ft.",target:"You and all allies within 20 ft.",duration:"1 round/level (D)",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M/DF"},
  "cleric|9|Astral Projection":{casting:"30 minutes",range:"Personal and touch",target:"You and up to eight touched creatures",duration:"See text",save:"None",sr:"No",components:"V, S, M"},
  "cleric|9|Energy Drain":{casting:"Standard action",range:"Touch",target:"Living creature touched",duration:"Instantaneous",save:"Fortitude partial",sr:"Yes",components:"V, S"},
  "cleric|9|Etherealness":{casting:"Standard action",range:"Personal and touch",target:"You and one other touched creature/three levels",duration:"1 min./level (D)",save:"None",sr:"No",components:"V, S"},
  "cleric|9|Gate":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"Gate, up to 10 ft./level in diameter",duration:"1 round/level (D) or instantaneous; see text",save:"None",sr:"No",components:"V, S"},
  "cleric|9|Heal, Mass":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Instantaneous",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "cleric|9|Implosion":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"Up to four creatures, no two of which can be more than 30 ft. apart",duration:"Instantaneous (1 round/target)",save:"None",sr:"Yes",components:"V, S"},
  "cleric|9|Miracle":{casting:"Standard action or 10 minutes",range:"Varies",target:"Varies",duration:"Varies",save:"None",sr:"Yes (harmless) or Yes; see text",components:"V, S, XP"},
  "cleric|9|Soul Bind":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One corpse",duration:"Permanent",save:"Will negates",sr:"Yes",components:"V, S, F"},
  "cleric|9|Storm of Vengeance":{casting:"Standard action",range:"Long (400 ft. + 40 ft./level)",target:"360-ft.-radius storm cloud",duration:"Concentration + 1 round/level",save:"None or Reflex half or Fortitude partial; see text",sr:"No",components:"V, S"},
  "cleric|9|Summon Monster IX":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One summoned creature",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S, F/DF"},
  "cleric|9|True Resurrection":{casting:"10 minutes",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, DF, XP"},
  "cleric|2|Calm Emotions":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Creatures in a 20-ft.-radius spread",duration:"Concentration, up to 1 round/level (D)",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "cleric|2|Make Whole":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One object of up to 10 cu. ft./level",duration:"Instantaneous",save:"Will negates (harmless, object)",sr:"Yes (harmless, object)",components:"V, S"},
  "cleric|4|Dismissal":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One extraplanar creature",duration:"Instantaneous",save:"Will negates; see text",sr:"Yes",components:"V, S, DF"},
  "cleric|4|Imbue with Spell Ability":{casting:"10 minutes",range:"Touch",target:"Creature touched",duration:"Permanent until discharged (D)",save:"Will (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "cleric|5|Dispel Chaos/Evil/Good/Law":{casting:"Standard action",range:"Touch",target:"You or creature touched",duration:"1 round/level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "earth|1|Magic Stone":{casting:"Standard action",range:"Touch",target:"Up to three pebbles touched",duration:"30 minutes or until discharged",save:"Will negates (harmless, object)",sr:"Yes (harmless, object)",components:"V, S, DF"},
  "earth|2|Soften Earth and Stone":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"10-ft. square/level; see text",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, DF"},
  "earth|3|Stone Shape":{casting:"Standard action",range:"Touch",target:"Stone or stone object touched, up to 10 cu. ft. + 1 cu. ft./level",duration:"Instantaneous",save:"None",sr:"No",components:"V, S, M/DF"},
  "earth|4|Spike Stones":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One 20-ft. square/level",duration:"1 hour/level (D)",save:"Reflex partial",sr:"Yes",components:"V, S, DF"},
  "earth|5|Wall of Stone":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Stone wall whose area is up to one 5-ft. square/level (S)",duration:"Instantaneous",save:"See text",sr:"No",components:"V, S, M/DF"},
  "earth|6|Stoneskin":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level or until discharged",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M"},
  "earth|7|Earthquake":{casting:"Standard action",range:"Long (400 ft. + 40 ft./level)",target:"80-ft.-radius spread (S)",duration:"1 round",save:"See text",sr:"No",components:"V, S, DF"},
  "earth|8|Iron Body":{casting:"Standard action",range:"Personal",target:"You",duration:"1 min./level (D)",save:"",sr:"",components:"V, S, M/DF"},
  "earth|9|Elemental Swarm":{casting:"10 minutes",range:"Medium (100 ft. + 10 ft./level)",target:"Two or more summoned creatures, no two of which can be more than 30 ft. apart",duration:"10 min./level (D)",save:"None",sr:"No",components:"V, S"},
  "good|1|Protection from Evil":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level (D)",save:"Will negates (harmless)",sr:"No; see text",components:"V, S, M/DF"},
  "good|2|Aid":{casting:"Standard action",range:"Touch",target:"Living creature touched",duration:"1 min./level",save:"None",sr:"Yes (harmless)",components:"V, S, DF"},
  "good|3|Magic Circle against Evil":{casting:"Standard action",range:"Touch",target:"10-ft.-radius emanation from touched creature",duration:"10 min./level",save:"Will negates (harmless)",sr:"No; see text",components:"V, S, M/DF"},
  "good|4|Holy Smite":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"20-ft.-radius burst",duration:"Instantaneous (1 round); see text",save:"Will partial; see text",sr:"Yes",components:"V, S"},
  "good|5|Dispel Evil":{casting:"Standard action",range:"Touch",target:"You and a touched evil creature from another plane; or you and an enchantment or evil spell on a touched creature or object",duration:"1 round/level or until discharged, whichever comes first",save:"See text",sr:"See text",components:"V, S, DF"},
  "good|6|Blade Barrier":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Wall of whirling blades up to 20 ft. long/ level, or a ringed wall of whirling blades with a radius of up to 5 ft. per two levels; either form 20 ft. high",duration:"1 min./level (D)",save:"Reflex half or Reflex negates; see text",sr:"Yes",components:"V, S"},
  "good|7|Holy Word":{casting:"Standard action",range:"40 ft.",target:"Nongood creatures in a 40-ft.-radius spread centered on you",duration:"Instantaneous",save:"None or Will negates; see text",sr:"Yes",components:"V"},
  "good|8|Holy Aura":{casting:"Standard action",range:"20 ft.",target:"One creature/level in a 20-ft.-radius burst centered on you",duration:"1 round/level (D)",save:"See text",sr:"Yes (harmless)",components:"V, S, F"},
  "law|1|Protection from Chaos":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level (D)",save:"Will negates (harmless)",sr:"No; see text",components:"V, S, M/DF"},
  "law|2|Calm Emotions":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Creatures in a 20-ft.-radius spread",duration:"Concentration, up to 1 round/level (D)",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "law|3|Magic Circle against Chaos":{casting:"Standard action",range:"Touch",target:"10-ft.-radius emanation from touched creature",duration:"10 min./level",save:"Will negates (harmless)",sr:"No; see text",components:"V, S, M/DF"},
  "law|4|Order's Wrath":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"Nonlawful creatures within a burst that fills a 30-ft. cube",duration:"Instantaneous (1 round); see text",save:"Will partial; see text",sr:"Yes",components:"V, S"},
  "law|5|Dispel Chaos":{casting:"Standard action",range:"Touch",target:"You and a touched chaotic creature from another plane; or you and an enchantment or chaotic spell on a touched creature or object",duration:"1 round/level or until discharged, whichever comes first",save:"See text",sr:"See text",components:"V, S, DF"},
  "law|6|Hold Monster":{casting:"Standard action",range:"Medium (100 ft. + 10 ft./level)",target:"One living creature",duration:"1 round/level (D); see text",save:"Will negates; see text",sr:"Yes",components:"V, S, M/DF"},
  "law|7|Dictum":{casting:"Standard action",range:"40 ft.",target:"Nonlawful creatures in a 40-ft.-radius spread centered on you",duration:"Instantaneous",save:"None or Will negates; see text",sr:"Yes",components:"V"},
  "law|8|Shield of Law":{casting:"Standard action",range:"20 ft.",target:"One creature/level in a 20-ft.-radius burst centered on you",duration:"1 round/level (D)",save:"See text",sr:"Yes (harmless)",components:"V, S, F"},
  "protection|1|Sanctuary":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 round/level",save:"Will negates",sr:"No",components:"V, S, DF"},
  "protection|2|Shield Other":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature",duration:"1 hour/level (D)",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, F"},
  "protection|3|Protection from Energy":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level or until discharged",save:"Fortitude negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "protection|4|Spell Immunity":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"10 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "protection|5|Spell Resistance":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, DF"},
  "protection|6|Antimagic Field":{casting:"Standard action",range:"10 ft.",target:"10-ft.-radius emanation, centered on you",duration:"10 min./level (D)",save:"None",sr:"See text",components:"V, S, M/DF"},
  "protection|7|Repulsion":{casting:"Standard action",range:"Up to 10 ft./level",target:"Up to 10-ft.-radius/level emanation centered on you",duration:"1 round/level (D)",save:"Will negates",sr:"Yes",components:"V, S, F/DF"},
  "protection|8|Mind Blank":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature",duration:"24 hours",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S"},
  "protection|9|Prismatic Sphere":{casting:"Standard action",range:"10 ft.",target:"10-ft.-radius sphere centered on you",duration:"10 min./level (D)",save:"See text",sr:"See text",components:"V"},
  "inquisition|1|Detect Chaos":{casting:"Standard action",range:"60 ft.",target:"Cone-shaped emanation",duration:"Concentration, up to 10 min./ level (D)",save:"None",sr:"No",components:"V, S, DF"},
  "inquisition|2|Zone of Truth":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"20-ft.-radius emanation",duration:"1 min./level",save:"Will negates",sr:"Yes",components:"V, S, DF"},
  "inquisition|3|Detect Thoughts":{casting:"Standard action",range:"60 ft.",target:"Cone-shaped emanation",duration:"Concentration, up to 1 min./level (D)",save:"Will negates; see text",sr:"No",components:"V, S, F/DF"},
  "inquisition|4|Discern Lies":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"One creature/level, no two of which can be more than 30 ft. apart",duration:"Concentration, up to 1 round/level",save:"Will negates",sr:"No",components:"V, S, DF"},
  "inquisition|5|True Seeing":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"1 min./level",save:"Will negates (harmless)",sr:"Yes (harmless)",components:"V, S, M"},
  "inquisition|6|Geas/Quest":{casting:"10 minutes",range:"",target:"One living creature",duration:"",save:"None",sr:"",components:""},
  "inquisition|7|Dictum":{casting:"Standard action",range:"40 ft.",target:"Nonlawful creatures in a 40-ft.-radius spread centered on you",duration:"Instantaneous",save:"None or Will negates; see text",sr:"Yes",components:"V"},
  "inquisition|8|Shield of Law":{casting:"Standard action",range:"20 ft.",target:"One creature/level in a 20-ft.-radius burst centered on you",duration:"1 round/level (D)",save:"See text",sr:"Yes (harmless)",components:"V, S, F"},
  "inquisition|9|Imprisonment":{casting:"Standard action",range:"Touch",target:"Creature touched",duration:"Instantaneous",save:"Will negates; see text",sr:"Yes",components:"V, S"},
  "nature|6|Transport via Plants":{casting:"Standard action",range:"Unlimited",target:"You and touched objects or other touched willing creatures",duration:"1 round",save:"None",sr:"No",components:"V, S"},
  "nature|7|Control Weather":{casting:"10 minutes; see text",range:"2 miles",target:"2-mile-radius circle, centered on you; see text",duration:"4d12 hours; see text",save:"None",sr:"No",components:"V, S"},
  "nature|8|Animal Shapes":{casting:"Standard action",range:"Close (25 ft. + 5 ft./2 levels)",target:"Up to one willing creature per level, all within 30 ft. of each other",duration:"1 hour/level (D)",save:"None; see text",sr:"Yes (harmless)",components:"V, S, DF"},
  "nature|9|Shapechange":{casting:"Standard action",range:"Personal",target:"You",duration:"10 min./level (D)",save:"",sr:"",components:"V, S, F"},
  "nature|1|Trance":{casting:"1 round",range:"120 ft.",target:"120-ft. spread, centered on you",duration:"1 round/level (D)",save:"None",sr:"No",components:"V, S"},
  "nature|2|Commune with Lesser Spirit":{casting:"10 minutes",range:"10 ft.",target:"One lesser spirit",duration:"1 minute/level",save:"Will negates; see text",sr:"No",components:"V, S, M"},
  "nature|3|Possess Animal":{casting:"1 round",range:"Close (25 ft. + 5 ft./2 levels)",target:"One animal",duration:"1 round/level (D)",save:"Will negates",sr:"Yes",components:"V, S, M"},
  "nature|4|Elemental Ward":{casting:"Standard action",range:"60 ft.",target:"60-ft. emanation, centered on you",duration:"1 minute",save:"Will negates",sr:"Yes",components:"V, S, M"},
  "nature|5|Commune with Greater Spirit":{casting:"10 minutes",range:"10 ft.",target:"One spirit",duration:"1 minute/level",save:"Will negates; see text",sr:"No",components:"V, S, M, XP"}
};
const DEFAULT_INNATE=[
 {id:"aasimar-daylight",n:"Daylight",usesPerDay:1,note:"Aasimar racial spell-like ability (3.5 Monster Manual). Caster level equals class levels."}
];
// Every domain Caelian may pick, from the two allowed lists in CLAUDE.md. Spell lists live in DATA.<id> (js/spells.js).
const DOMAINS={
 nature:{name:"Nature",group:"deity"},magic:{name:"Magic",group:"deity"},balance:{name:"Balance",group:"deity"},earth:{name:"Earth",group:"deity"},
 law:{name:"Law",group:"concept"},good:{name:"Good",group:"concept"},protection:{name:"Protection",group:"concept"},inquisition:{name:"Inquisition",group:"concept"}
};
const DEFAULT_DOMAINS=["magic","balance"];
const MAX_DOMAINS=3;
function domainPowerOrder(){return state.domains.map(d=>d+"-power");}
const signed=n=>(n>=0?"+":"")+n;
const BUILTIN_POWERS={
 "balance-power":{name:"Balance domain power",passive:false,usesPerDay:1,source:"Balance domain granted power · Spell Compendium p. 271",effect:()=>`Once per day, as a free action: add your Wisdom modifier (${wisdomModifier()>=0?"+":""}${wisdomModifier()}) to your Armor Class for ${characterLevel()} rounds (1 round per cleric level).`},
 "earth-power":{name:"Earth domain power",passive:false,get usesPerDay(){return Math.max(0,3+charismaModifier());},source:"Earth domain granted power · Player’s Handbook / SRD",effect:()=>`Turn or destroy air creatures as a good cleric turns undead, and rebuke, command, or bolster earth creatures as an evil cleric rebukes undead. ${Math.max(0,3+charismaModifier())} uses per day in total (3 + Charisma modifier ${signed(charismaModifier())}). Supernatural ability.`},
 "nature-power":{name:"Nature domain power",passive:false,get usesPerDay(){return Math.max(0,3+charismaModifier());},source:"Nature (Shaman) domain granted power · Oriental Adventures, via Realms Help",effect:()=>`Rebuke or command normal animals and plant creatures as an evil cleric rebukes or commands undead. ${Math.max(0,3+charismaModifier())} uses per day (3 + Charisma modifier ${signed(charismaModifier())}).`},
 "law-power":{name:"Law domain power",passive:true,source:"Law domain granted power · Player’s Handbook / SRD",effect:()=>`Always active: you cast law spells (spells with the Lawful descriptor) at +1 caster level, so caster level ${characterLevel()+1}.`},
 "good-power":{name:"Good domain power",passive:true,source:"Good domain granted power · Player’s Handbook / SRD",effect:()=>`Always active: you cast good spells (spells with the Good descriptor) at +1 caster level, so caster level ${characterLevel()+1}.`},
 "protection-power":{name:"Protection domain power",passive:false,usesPerDay:1,source:"Protection domain granted power · Player’s Handbook / SRD",effect:()=>`Once per day, as a standard action: touch a creature to give it a +${characterLevel()} resistance bonus (your cleric level) on its next saving throw. The ward lasts 1 hour. Supernatural abjuration.`},
 "inquisition-power":{name:"Inquisition domain power",passive:true,source:"Inquisition domain granted power · Complete Divine / Spell Compendium",effect:()=>`Always active: +4 bonus on all dispel checks (1d20 + caster level + 4).`},
 "magic-power":{name:"Magic domain power",passive:true,source:"Magic domain granted power · Player’s Handbook p. 187",effect:()=>`Always active: use spell completion and spell trigger items (scrolls, wands, staffs) as a wizard of level ${Math.max(1,Math.floor(characterLevel()/2))} (half your cleric level, minimum 1st).`}
};
let tab="cleric", selected=null;
let state={prepared:[],favorites:[],character:{level:6,wisdom:23,charisma:14},domains:DEFAULT_DOMAINS.slice(),innate:null,innateUsed:{}};
try { const saved=window.localStorage.getItem("caelianSpellbook"); if(saved) state={...state,...JSON.parse(saved)}; } catch(e) {}
state.prepared=Array.isArray(state.prepared)?state.prepared:[]; state.favorites=Array.isArray(state.favorites)?state.favorites:[]; state.character={...{level:6,wisdom:23,charisma:14},...(state.character||{})};
state.domains=validDomains(state.domains);
state.prepared=state.prepared.filter(k=>isActiveSource(k.split("|")[0]));
state.favorites=state.favorites.filter(k=>{const src=k.split("|")[0];return src==="cleric"||DOMAINS[src];});
state.innateUsed=(state.innateUsed&&typeof state.innateUsed==="object"&&!Array.isArray(state.innateUsed))?state.innateUsed:{};
const hadSavedInnate=Array.isArray(state.innate);
state.innate=hadSavedInnate?state.innate.filter(e=>e&&typeof e==="object").map((e,i)=>({id:String(e.id||("innate-"+Date.now()+"-"+i)),n:String(e.n||""),usesPerDay:Math.max(1,Math.min(20,parseInt(e.usesPerDay,10)||1)),note:String(e.note||""),custom:!!e.custom,passive:!!e.passive,builtin:BUILTIN_POWERS[e.builtin]?e.builtin:undefined})):[];
state.innateSeeded=Array.isArray(state.innateSeeded)?state.innateSeeded:(hadSavedInnate?["aasimar-daylight"]:[]);
state.innate=state.innate.filter(e=>!e.builtin&&!BUILTIN_POWERS[e.id]);
state.innate.forEach(e=>{if(/^light$/i.test(e.n.trim())&&(/aasimar/i.test(e.note)||e.id==="aasimar-daylight")){e.n="Daylight";e.custom=false;e.note=DEFAULT_INNATE[0].note;}});
DEFAULT_INNATE.forEach(d=>{if(state.innateSeeded.includes(d.id))return;if(!state.innate.some(e=>e.id===d.id))state.innate.push({...d});state.innateSeeded.push(d.id);});
Object.keys(state.innateUsed).forEach(k=>{if(!state.innate.some(e=>e.id===k)&&!BUILTIN_POWERS[k])delete state.innateUsed[k];});

const save=()=>{ try { window.localStorage.setItem("caelianSpellbook",JSON.stringify(state)); } catch(e) {} };
const key=(source,lvl,n)=>source+"|"+lvl+"|"+n;
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const sourceLabel=s=>s==="cleric"?"Cleric spell":DOMAINS[s]?DOMAINS[s].name+" domain":s;
function innateSpellData(name){const n=String(name||"").trim().toLowerCase();return activeSpells().find(s=>s.n.toLowerCase()===n)||null;}
function builtinOf(entry){return entry&&entry.builtin?BUILTIN_POWERS[entry.builtin]:null;}
function isPassive(entry){const b=builtinOf(entry);return b?b.passive:!!entry.passive;}
function innateName(entry){const b=builtinOf(entry);return b?b.name:entry.n;}
function innateRemaining(entry){return entry.usesPerDay-(state.innateUsed[entry.id]||0);}
function innateById(id){return state.innate.find(e=>e.id===id);}
function toggleInnateUse(id){const entry=innateById(id);if(!entry||isPassive(entry))return;const used=state.innateUsed[id]||0;state.innateUsed[id]=used>=entry.usesPerDay?0:used+1;save();render();}
function addInnate(){state.innate.push({id:"innate-"+Date.now(),n:"",usesPerDay:1,note:""});save();render();}
function removeInnate(id){const entry=innateById(id);if(entry&&innateName(entry)&&!confirm(`Remove "${innateName(entry)}" from innate spells?`))return;state.innate=state.innate.filter(e=>e.id!==id);delete state.innateUsed[id];save();render();}
const CUSTOM_OPTION="__custom__";
function allSpellsUnique(){return [...new Map(activeSpells().map(s=>[s.n,s])).values()];}
function updateInnate(id,field,value){const entry=innateById(id);if(!entry)return;if(field==="usesPerDay"){entry.usesPerDay=Math.max(1,Math.min(20,parseInt(value,10)||1));if((state.innateUsed[id]||0)>entry.usesPerDay)state.innateUsed[id]=entry.usesPerDay;}else if(field==="passive"){entry.passive=!!value;if(entry.passive)delete state.innateUsed[id];}else if(field==="pick"){if(value===CUSTOM_OPTION){entry.custom=true;if(innateSpellData(entry.n))entry.n="";}else{entry.custom=false;entry.n=value;}}else if(field==="n"){const match=innateSpellData(value);entry.n=match?match.n:String(value).trim();}else entry[field]=String(value);save();render();}
function spellSelectHTML(entry){const known=innateSpellData(entry.n),custom=entry.custom||(entry.n&&!known);const byLevel={};allSpellsUnique().forEach(s=>(byLevel[s.l]=byLevel[s.l]||[]).push(s));
 const groups=Object.keys(byLevel).sort((a,b)=>a-b).map(l=>`<optgroup label="${+l===0?"0-level":ordinal(+l)+" level"}">${byLevel[l].sort((a,b)=>a.n.localeCompare(b.n)).map(s=>`<option value="${esc(s.n)}" ${!custom&&known&&known.n===s.n?"selected":""}>${esc(s.n)}</option>`).join("")}</optgroup>`).join("");
 return `<select class="select" data-field="pick"><option value="" ${!entry.n&&!custom?"selected":""} disabled>Choose a spell…</option>${groups}<option value="${CUSTOM_OPTION}" ${custom?"selected":""}>Other (custom ability)…</option></select>${custom?`<input type="text" data-field="n" value="${esc(entry.n)}" placeholder="Spell or ability name">`:""}`;}
function innateInfo(entry){const b=builtinOf(entry);if(b)return esc(b.source);const spell=innateSpellData(entry.n);return spell?`${sourceLabel(spell.source)} · ${spell.l===0?"0-level":ordinal(spell.l)+" level"} · ${esc(spell.s)}`:(entry.n?"Custom ability — no spell card":"No spell chosen yet");}
function innateEffect(entry){const b=builtinOf(entry);return b?`<p class="innate-effect">${esc(b.effect())}</p>`:"";}
function innateUsageHTML(entry){if(isPassive(entry))return `<div class="used passive">Always active</div>`;const remaining=innateRemaining(entry);return `<div class="used">${entry.usesPerDay-remaining} / ${entry.usesPerDay} used today</div>`;}
function innateUseButtons(entry){const spell=!builtinOf(entry)&&innateSpellData(entry.n),parts=[];if(!isPassive(entry))parts.push(`<button type="button" class="action secondary" data-innate-act="use" ${innateName(entry)?"":"disabled"}>${innateRemaining(entry)>0?"Mark one used":"Reset uses"}</button>`);if(spell)parts.push(`<button type="button" class="action secondary" data-innate-act="view">View spell</button>`);return parts.join("");}
function cardState(entry){return !isPassive(entry)&&innateRemaining(entry)<=0?"over":"";}
// Editable card: Character settings only
function innateEditCardHTML(entry){const b=builtinOf(entry);
 const head=b?`<h3>${esc(b.name)}</h3><p class="meta">${innateInfo(entry)}</p>${innateEffect(entry)}`:`<label class="innate-field">Spell or ability${spellSelectHTML(entry)}</label><p class="meta">${innateInfo(entry)}</p>`;
 const uses=isPassive(entry)?"":`<div class="settingsrow"><label class="innate-field">Uses / day<input type="number" min="1" max="20" inputmode="numeric" data-field="usesPerDay" value="${entry.usesPerDay}"></label></div>`;
 const passiveToggle=b?"":`<label class="innate-toggle"><input type="checkbox" data-field="passive" ${entry.passive?"checked":""}> Always active (no daily limit)</label>`;
 return `<div class="slotcard innate-card ${cardState(entry)}" data-id="${esc(entry.id)}">${head}${uses}${passiveToggle}
 <label class="innate-field">Note<input type="text" data-field="note" value="${esc(entry.note)}" placeholder="Optional note"></label>
 ${innateUsageHTML(entry)}
 <div class="actionrow">${innateUseButtons(entry)}<button type="button" class="action secondary" data-innate-act="remove">Remove</button></div></div>`;}
// Read-only card: Prepared Today tab (usage tracking only)
function innateViewCardHTML(entry){const b=builtinOf(entry);
 return `<div class="slotcard innate-card ${cardState(entry)}" data-id="${esc(entry.id)}"><h3>${esc(innateName(entry)||"No spell chosen")}</h3><p>${innateInfo(entry)}</p>${innateEffect(entry)}${entry.note?`<p>${esc(entry.note)}</p>`:""}${innateUsageHTML(entry)}<div class="actionrow">${innateUseButtons(entry)}</div></div>`;}
function innateListHTML(editable){if(!editable)return state.innate.length?`<div class="slotgrid">${state.innate.map(innateViewCardHTML).join("")}</div>`:`<p class="meta">No innate spells set. Add them in Character settings.</p>`;
 return (state.innate.length?state.innate.map(innateEditCardHTML).join(""):`<p class="meta">No innate spells. Add racial spell-like abilities here.</p>`)+`<div class="actionrow"><button type="button" class="action secondary" data-innate-act="add">${icon("plus")}Add innate spell</button></div>`;}
function bindInnate(node){if(!node)return;node.querySelectorAll("[data-innate-act]").forEach(button=>button.onclick=event=>{event.stopPropagation();const act=button.dataset.innateAct,card=button.closest("[data-id]"),id=card&&card.dataset.id;if(act==="add")return addInnate();if(act==="use")return toggleInnateUse(id);if(act==="remove")return removeInnate(id);if(act==="view"){const entry=innateById(id),spell=entry&&innateSpellData(entry.n);if(spell)showSpellModal(spell);}});node.querySelectorAll("[data-field]").forEach(input=>input.onchange=()=>{const card=input.closest("[data-id]");updateInnate(card.dataset.id,input.dataset.field,input.type==="checkbox"?input.checked:input.value);});}
function fillInnate(node,editable){if(!node)return;node.innerHTML=innateListHTML(editable);bindInnate(node);}
function domainUsesLeft(key){const p=BUILTIN_POWERS[key];return p.passive?Infinity:p.usesPerDay-(state.innateUsed[key]||0);}
function toggleDomainUse(key){const p=BUILTIN_POWERS[key];if(!p||p.passive)return;const used=state.innateUsed[key]||0;state.innateUsed[key]=used>=p.usesPerDay?0:used+1;save();render();}
function domainPowerCardHTML(key){const p=BUILTIN_POWERS[key],left=domainUsesLeft(key);
 const usage=p.passive?`<div class="used passive">Always active</div>`:`<div class="used">${p.usesPerDay-left} / ${p.usesPerDay} used today</div><div class="actionrow"><button type="button" class="action secondary" data-domain-act="use">${left>0?"Mark used":"Reset"}</button></div>`;
 return `<div class="slotcard innate-card domain-card ${!p.passive&&left<=0?"over":""}" data-power="${key}" data-dom="${key.replace(/-power$/,"")}"><h3>${esc(p.name)}</h3><p class="meta">${esc(p.source)}</p><p class="innate-effect">${esc(p.effect())}</p>${usage}</div>`;}
function fillDomainPowers(node,grid){if(!node)return;const cards=domainPowerOrder().map(domainPowerCardHTML).join("");node.innerHTML=grid?`<div class="slotgrid">${cards}</div>`:cards;node.querySelectorAll("[data-domain-act]").forEach(b=>b.onclick=e=>{e.stopPropagation();toggleDomainUse(b.closest("[data-power]").dataset.power);});}
function renderInnate(){["innateSpells","mobileInnateSpells"].forEach(id=>fillInnate(document.getElementById(id),true));["domainPowers","mobileDomainPowers"].forEach(id=>fillDomainPowers(document.getElementById(id),false));}

// 2 domains is RAW for a cleric; a 3rd is allowed as an option (see the note in Domain settings).
function validDomains(list){const picked=[...new Set((Array.isArray(list)?list:[]).filter(d=>DOMAINS[d]))].slice(0,MAX_DOMAINS);return picked.length>=2?picked:DEFAULT_DOMAINS.slice();}
function isActiveSource(source){return source==="cleric"||state.domains.includes(source);}
function joinNames(names,conj="and"){return names.length<2?names.join(""):names.slice(0,-1).join(", ")+` ${conj} `+names[names.length-1];}
function domainNames(conj){return joinNames(state.domains.map(d=>DOMAINS[d].name),conj);}
function activeSpells(){return allSpells("cleric").concat(...state.domains.map(allSpells));}
function allSpells(source){
 if(source==="cleric") return Object.entries(DATA.cleric).flatMap(([l,a])=>a.map(x=>({...x,l:+l,source})));
 return Object.entries(DATA[source]||{}).map(([l,x])=>({...x,l:+l,source}));
}
function current(){return allSpells(tab==="cleric"?"cleric":tab);}
function isDomain(s){return s.source!=="cleric";}
function preparedAt(level,domain){return activeSpells().filter(s=>s.l===level&&isDomain(s)===domain&&state.prepared.includes(key(s.source,s.l,s.n)));}
function preparedCount(s){const spellKey=key(s.source,s.l,s.n);return state.prepared.filter(k=>k===spellKey).length;}
function slotsUsed(level,domain){return preparedAt(level,domain).reduce((sum,s)=>sum+preparedCount(s),0);}
function prepareLimit(s){const info=slotInfo(s.l);return isDomain(s)?info.domain:info.normal;}
function canPrepareMore(s){const limit=prepareLimit(s);return limit>0&&slotsUsed(s.l,isDomain(s))<limit;}
function qtyStepperHTML(s){const n=preparedCount(s);return `<div class="qty" role="group" aria-label="Prepared copies of ${esc(s.n)}"><button type="button" class="qty-btn" data-qty="-1" ${n?"":"disabled"} aria-label="Prepare one fewer ${esc(s.n)}">${icon("minus")}</button><span class="qty-n" aria-live="polite">×${n}</span><button type="button" class="qty-btn" data-qty="1" ${canPrepareMore(s)?"":"disabled"} aria-label="Prepare one more ${esc(s.n)}">${icon("plus")}</button></div>`;}
function bindQty(node,s){node.querySelectorAll("[data-qty]").forEach(button=>button.onclick=event=>{event.stopPropagation();button.dataset.qty==="1"?addPrepared(s):removePrepared(s);});}
function characterLevel(){return state.character.level;}
function wisdom(){return state.character.wisdom;}
function wisdomModifier(){return Math.floor((wisdom()-10)/2);}
function charisma(){return state.character.charisma;}
function charismaModifier(){return Math.floor((charisma()-10)/2);}
function bonusSpells(level){const modifier=wisdomModifier();return level>0&&modifier>=level?1+Math.floor((modifier-level)/4):0;}
function slotInfo(level){const base=(BASE_CLERIC_SLOTS[characterLevel()-1]||[])[level]||0;if(!base||wisdom()<10+level)return {normal:0,domain:0};return {normal:base+bonusSpells(level),domain:level>0?1:0};}
function activeSpellLevels(){return Array.from({length:10},(_,level)=>level).filter(level=>slotInfo(level).normal>0);}
function spellDC(level){return 10+level+wisdomModifier();}
const STATS_BY_NAME={};Object.entries(STAT_OVERRIDES).forEach(([k,v])=>{const n=k.split("|")[2];if(!STATS_BY_NAME[n])STATS_BY_NAME[n]=v;});
function spellStats(s){const fallback={casting:"See full rules",range:"See full rules",target:"See full rules",duration:"See full rules",save:"See full rules",sr:"See full rules",components:"See full rules"};return {...fallback,...(STAT_OVERRIDES[key(s.source,s.l,s.n)]||STATS_BY_NAME[s.n]||{})};}
// SRD pages whose file name doesn't follow the spell's name. The Chaos/Evil/Good/Law spells share the Evil page's full text.
const SRD_FILE={"Lesser Restoration":"restorationLesser","Detect Chaos/Evil/Good/Law":"detectEvil","Protection from Chaos/Evil/Good/Law":"protectionFromEvil","Magic Circle against Chaos/Evil/Good/Law":"magicCircleAgainstEvil","Dispel Chaos/Evil/Good/Law":"dispelEvil"};
function spellReference(s){
 // SRD file names: camelCase, apostrophes dropped, roman numerals kept upper case (summonMonsterIX)
 const file=SRD_FILE[s.n]||s.n.replace(/['’]/g,"").split(/[^A-Za-z0-9]+/).filter(Boolean).map((w,i)=>i&&/^[IVX]+$/.test(w)?w:i?w[0].toUpperCase()+w.slice(1).toLowerCase():w.toLowerCase()).join("");
 if(s.url)return {label:`${s.ref}: spell page on Realms Help`,url:s.url,note:`Source: ${s.ref}. The description above is written in this sheet's own words from the book; check the book for exact wording.`};
 if(s.ref&&s.ref.startsWith("Spell Compendium"))return {label:`Spell Compendium, ${s.ref.replace("Spell Compendium ","")}`,url:"https://www.dmsguild.com/product/3725/Spell-Compendium-35",note:`Source: ${s.ref}. The description above is written in this sheet's own words; check the book for exact wording.`};
 return {label:"Read full SRD rules text",url:"https://www.d20srd.org/srd/spells/"+file+".htm",note:s.ref?`Source: Player’s Handbook, ${s.ref.replace("PH ","")}. The linked SRD page has the complete rules text.`:"This is SRD material. The linked reference contains the complete spell text and rules details."};
}
function fullCardDescription(s,stats){
 const slot=isDomain(s)?`Preparing it uses this level’s single domain slot, shared between ${domainNames()}.`:"Preparing it uses one normal Cleric slot of this spell level.";
 if(s.full)return `${s.full}\n\nSave DC ${spellDC(s.l)} where a save applies. ${slot}`;
 const mechanics=`Cast it as a ${stats.casting.toLowerCase()} effect with a range of ${stats.range.toLowerCase()}. It affects ${stats.target.toLowerCase()} and lasts ${stats.duration.toLowerCase()}. ${stats.save!=="None"?`If a saving throw applies, the DC is ${spellDC(s.l)}.`:"It does not allow a saving throw."} Spell resistance is ${stats.sr.toLowerCase()}.`;
 return `${s.d} ${mechanics} ${slot}`;
}
function openSpell(s){
 selected=s; const html=detailHTML(s);
 [document.getElementById("detail"),document.getElementById("sheet")].forEach(node=>{node.innerHTML=html;bindDetailActions(node);});
}
const DETAIL_EMPTY='<h2>Choose a spell</h2><p>Select any spell to see its details here.</p>';
function showSpellModal(s){
 openSpell(s);
 const modal=document.getElementById("modal");
 modal.classList.add("show");
 modal.setAttribute("aria-hidden","false");
}
function detailHTML(s){
 const copies=preparedCount(s), prepared=copies>0, favorite=state.favorites.includes(key(s.source,s.l,s.n)), stats=spellStats(s), reference=spellReference(s), domain=isDomain(s), info=slotInfo(s.l), used=slotsUsed(s.l,domain), limit=domain?info.domain:info.normal;
 const fields=[["School",s.s],["Casting time",stats.casting],["Range",stats.range],["Target / effect",stats.target],["Duration",stats.duration],["Save",stats.save],["Spell resistance",stats.sr],["Components",stats.components],["Spell save DC",spellDC(s.l)],["Caster level",characterLevel()],["Preparation",prepared?`Prepared ×${copies}`:"Not prepared"],["Bookmark",{html:favorite?`${inlineIcon("star")} Favorite`:`${inlineIcon("starOutline")} Not favorited`}]];
 return `<button class="close" data-action="close" aria-label="Close spell details">${icon("close")}</button><h2>${esc(s.n)}</h2><div class="source">${sourceLabel(s.source)} · ${s.l===0?"0-level orison":ordinal(s.l)+" level"}</div>
 <div class="actionrow">${prepared?`${qtyStepperHTML(s)}<button class="action secondary" data-action="prepare">Remove all</button>`:`<button class="action" data-action="prepare">Prepare this spell</button>`}<button class="action secondary" data-action="favorite">${favorite?`${icon("star")} Remove bookmark`:`${icon("starOutline")} Add bookmark`}</button></div>
 <h3>Spell Details</h3><div class="facts">${fields.map(([label,value])=>`<div class="fact"><b>${label}</b>${value&&value.html?value.html:esc(value)}</div>`).join("")}</div>
 <h3>Quick Summary</h3><p>${esc(s.d)}</p>
 <div class="note">${domain?`Domain slot: ${used} of ${limit} selected at this level. Pick one spell from ${state.domains.length>2?"any of":"either"} ${domainNames("or")} for the domain slot.`:`Cleric slots: ${used} of ${limit} selected at this level. Use ${inlineIcon("minus")} / ${inlineIcon("plus")} to prepare this spell more than once.`}</div>
 <h3>Full Description</h3><p class="ruletext">${esc(fullCardDescription(s,stats))}</p><h3>Rules Reference</h3><p class="statusline">${esc(reference.note)}</p><a class="reference" href="${reference.url}" target="_blank" rel="noopener noreferrer">${icon("external",14)} ${reference.label}</a>
 <p class="statusline">${inlineIcon("star")} is a personal bookmark used by the Favorites filter. It never consumes a prepared slot.</p>`;
}
function bindDetailActions(node){
 if(selected)bindQty(node,selected);
 node.querySelectorAll("[data-action]").forEach(button=>button.onclick=event=>{event.stopPropagation();const action=button.dataset.action;if(action==="close")return node.id==="detail"?clearDetail():closeModal();if(!selected)return;action==="prepare"?togglePrepared(selected):toggleFavorite(selected);});
}
function render(){
 const el=document.getElementById("content"), toolbar=document.querySelector(".toolbar"); el.innerHTML=""; toolbar.hidden=tab==="today";
 updateBadge();updateSlots();
 if(tab==="today"){renderToday(el);return;}
 let spells=current(), query=document.getElementById("search").value.toLowerCase(), levelFilter=document.getElementById("levelFilter").value, preparedFilter=document.getElementById("preparedFilter").value;
 spells=spells.filter(s=>(levelFilter==="all"||s.l==levelFilter)&&(!query||s.n.toLowerCase().includes(query)||s.d.toLowerCase().includes(query)||s.s.toLowerCase().includes(query))&&(preparedFilter==="all"||(preparedFilter==="prepared"&&state.prepared.includes(key(s.source,s.l,s.n)))||(preparedFilter==="favorites"&&state.favorites.includes(key(s.source,s.l,s.n)))));
 for(let level=0;level<=9;level++){
  const list=spells.filter(s=>s.l===level); if(!list.length)continue;
  const section=document.createElement("div");section.className="level";section.innerHTML=`<div class="levelhead"><strong>${level===0?"0 · Orisons":ordinal(level)+" · Spells"}</strong><span class="count">${list.length}</span></div>`;
  list.forEach(s=>{const spellKey=key(s.source,s.l,s.n),row=document.createElement("div");row.className="spellrow";row.innerHTML=`<input class="check" type="checkbox" ${state.prepared.includes(spellKey)?"checked":""} aria-label="Prepare ${esc(s.n)}"><div><div class="spellname">${esc(s.n)}${preparedCount(s)>1?` <span class="qty-badge">×${preparedCount(s)}</span>`:""}</div><div class="meta">${esc(s.s)} · ${esc(s.d)}</div></div><button class="star ${state.favorites.includes(spellKey)?"on":""}" title="Personal bookmark; use the Favorites filter" aria-label="Bookmark ${esc(s.n)}">${icon("star",18)}</button>`;
   row.querySelector(".check").onclick=event=>{event.stopPropagation();togglePrepared(s);};row.querySelector(".star").onclick=event=>{event.stopPropagation();toggleFavorite(s);};row.onclick=()=>showSpellModal(s);section.appendChild(row);});
  el.appendChild(section);
 }
 if(!el.childElementCount)el.innerHTML='<div class="empty">No spells match these filters.</div>';
}
function renderToday(el){
 const all=activeSpells();
 const levels=activeSpellLevels(),prepared=all.filter(s=>state.prepared.includes(key(s.source,s.l,s.n))),preparedSlots=prepared.reduce((sum,s)=>sum+preparedCount(s),0),totalCapacity=levels.reduce((sum,level)=>{const info=slotInfo(level);return sum+info.normal+info.domain;},0);
 const dcCards=levels.map(level=>`<div class="dc-item"><span>${level===0?"0-level":ordinal(level)+" level"}</span><b>DC ${spellDC(level)}</b></div>`).join("");
 el.innerHTML=`<section><h2 style="margin:0 0 4px">Prepared Today</h2><p class="prepared-intro">Caelian, Cleric ${characterLevel()} · Wisdom ${wisdom()} (${wisdomModifier()>=0?"+":""}${wisdomModifier()}). Checkboxes prepare spells and ${inlineIcon("minus")} / ${inlineIcon("plus")} sets how many times each is prepared; ${inlineIcon("star")} bookmarks them for the Favorites filter.</p><div class="summarygrid"><div class="summarycard"><b>${preparedSlots} / ${totalCapacity}</b><span>Prepared slots</span></div><div class="summarycard"><b>+${characterLevel()}</b><span>Caster level / dispel check</span></div><div class="summarycard"><b>${levels.filter(level=>level>0).length}</b><span>Available domain levels</span></div></div><div class="dc-panel"><h3>Spell Save DC by Level</h3><div class="dc-grid">${dcCards}</div></div><div class="bookmark-note"><strong>${icon("star")}</strong><span>Favorites are personal bookmarks only. They make a spell easier to find and do not prepare it.</span></div><div class="slotgrid">${levels.map(level=>slotCard(level)).join("")}</div><h3>Innate spells</h3><p class="prepared-intro">Racial spell-like abilities. They never use a Cleric or domain slot, only their own daily uses, and clearing prepared spells doesn’t reset them.</p><div id="todayInnate"></div><h3>Domain powers</h3><p class="prepared-intro">Granted bonuses from your domains, always available.</p><div id="todayDomain"></div><div class="actionrow"><button class="action secondary" id="clearPrepared">Clear today’s preparation</button></div></section>`;
 const unsupported=prepared.filter(s=>!slotInfo(s.l).normal).reduce((sum,s)=>sum+preparedCount(s),0); if(unsupported)el.innerHTML+=`<div class="warning">${unsupported} prepared spell${unsupported===1?" is":"s are"} above the current Cleric level or Wisdom limit. Remove ${unsupported===1?"it":"them"} before play.</div>`;
 const grouped=levels.map(level=>({level,normal:prepared.filter(s=>s.l===level&&!isDomain(s)),domain:prepared.filter(s=>s.l===level&&isDomain(s))}));
 grouped.forEach(group=>{const section=document.createElement("div");section.className="level";section.innerHTML=`<div class="levelhead"><strong>${group.level===0?"0 · Orisons":ordinal(group.level)+" · Spells"}</strong><span class="count">${slotsUsed(group.level,false)} cleric · ${slotsUsed(group.level,true)} domain</span></div>`;[...group.normal,...group.domain].forEach(s=>{const row=document.createElement("div");row.className="spellrow has-qty"+(isDomain(s)?" domain-row":"");if(isDomain(s))row.dataset.dom=s.source;row.innerHTML=`<div></div><div><div class="spellname">${esc(s.n)}</div><div class="meta">${isDomain(s)?`<span class="dom-label">${sourceLabel(s.source)}</span>`:sourceLabel(s.source)} · ${esc(s.s)} · DC ${spellDC(s.l)}</div></div>${qtyStepperHTML(s)}<button class="star" aria-label="Open ${esc(s.n)}">${icon("arrowRight",18)}</button>`;bindQty(row,s);row.onclick=()=>showSpellModal(s);section.appendChild(row);});el.appendChild(section);});
 if(!prepared.length)el.innerHTML+=`<div class="empty">No spells prepared yet. Go to Cleric or a domain tab (${domainNames()}) and tick a checkbox.</div>`;
 fillInnate(document.getElementById("todayInnate"),false); fillDomainPowers(document.getElementById("todayDomain"),true);
 document.getElementById("clearPrepared").onclick=()=>{state.prepared=[];save();render();if(selected)openSpell(selected);};
}
function slotCard(level){const info=slotInfo(level),normal=slotsUsed(level,false),domain=slotsUsed(level,true),over=normal>info.normal||domain>info.domain;return `<div class="slotcard ${over?"over":""}"><h3>${level===0?"0 · Orisons":ordinal(level)+" · Spells"}</h3><p>${info.normal} cleric${info.domain?" + 1 domain":""}</p><div class="used">${normal} / ${info.normal}${info.domain?` · ${domain} / 1 D`:""}</div></div>`;}
function ordinal(number){return["","1st","2nd","3rd"][number]||number+"th";}
function addPrepared(s){
 const domain=isDomain(s),limit=prepareLimit(s);if(!limit){alert(`Caelian cannot prepare ${ordinal(s.l)}-level spells at Cleric ${characterLevel()} with Wisdom ${wisdom()}.`);return;}if(slotsUsed(s.l,domain)>=limit){alert(domain?`The ${ordinal(s.l)}-level domain slot is already filled. Remove that domain spell first.`:`All ${limit} ${ordinal(s.l)}-level cleric slots are filled. Remove a spell first.`);return;}state.prepared.push(key(s.source,s.l,s.n));afterPrepareChange();
}
function removePrepared(s){const index=state.prepared.lastIndexOf(key(s.source,s.l,s.n));if(index<0)return;state.prepared.splice(index,1);afterPrepareChange();}
function afterPrepareChange(){save();render();if(selected)openSpell(selected);}
// Checkbox / "Remove all": prepares one copy, or clears every copy of the spell
function togglePrepared(s){const spellKey=key(s.source,s.l,s.n);if(state.prepared.includes(spellKey)){state.prepared=state.prepared.filter(k=>k!==spellKey);afterPrepareChange();}else addPrepared(s);}
function toggleFavorite(s){const spellKey=key(s.source,s.l,s.n),index=state.favorites.indexOf(spellKey);index>=0?state.favorites.splice(index,1):state.favorites.push(spellKey);save();render();if(selected)openSpell(selected);}
function updateBadge(){document.getElementById("preparedBadge").textContent=state.prepared.length+" prepared";}
function syncCharacterUI(){
 const subtitle=document.querySelector(".title p"),note=document.querySelector(".settings .meta"),mobileNote=document.getElementById("mobileCharacterNote");
 ["charLevel","mobileCharLevel"].forEach(id=>document.getElementById(id).value=characterLevel());["wis","mobileWis"].forEach(id=>document.getElementById(id).value=wisdom());["cha","mobileCha"].forEach(id=>document.getElementById(id).value=charisma());subtitle.textContent=`D&D 3.5 · Cleric ${characterLevel()} · Wisdom ${wisdom()} (${wisdomModifier()>=0?"+":""}${wisdomModifier()})`;
 const text=`Slots and spell DCs update from Cleric level and Wisdom. Charisma sets uses per day for domain powers that scale with it.`;note.textContent=text;mobileNote.textContent=text;
}
function slotSummaryHTML(){const levels=activeSpellLevels();return levels.map(level=>{const info=slotInfo(level);return `<div class="slotline"><span>${level===0?"Orisons":ordinal(level)+" level"}</span><b>${slotsUsed(level,false)}/${info.normal}${info.domain?` · ${slotsUsed(level,true)}/1 D`:""}</b></div>`;}).join("")+`<div class="slotline"><span>Spell DCs</span><b>Listed by level</b></div>`+levels.map(level=>`<div class="slotline"><span>DC · ${level===0?"0-level":ordinal(level)}</span><b>${spellDC(level)}</b></div>`).join("")+`<div class="slotline"><span>Caster level</span><b>${characterLevel()}</b></div>`;}
// Header badges, domain tabs and power notes follow state.domains
function renderDomainChrome(){
 const badges=document.querySelector(".badges"),prepared=document.getElementById("preparedBadge");
 badges.querySelectorAll(".badge[data-dom]").forEach(b=>b.remove());
 state.domains.forEach(d=>{const b=document.createElement("span");b.className="badge";b.dataset.dom=d;b.textContent=DOMAINS[d].name;badges.insertBefore(b,prepared);});
 if(tab!=="cleric"&&tab!=="today"&&!state.domains.includes(tab))tab="cleric";
 document.getElementById("tabs").style.setProperty("--tab-count",state.domains.length+2);document.getElementById("tabs").innerHTML=[["cleric","Cleric",""],...state.domains.map(d=>[d,DOMAINS[d].name+" Domain",d]),["today","Prepared Today",""]].map(([id,label,dom])=>`<button class="tab${id===tab?" active":""}" data-tab="${id}"${dom?` data-dom="${dom}"`:""}>${esc(label)}</button>`).join("");
 document.querySelectorAll(".domain-powers-note").forEach(n=>n.textContent=`Granted powers from your ${domainNames()} domains.`);
}
function domainSelectHTML(index){
 const current=state.domains[index]||"",optional=index>=2;
 const group=(g,label)=>`<optgroup label="${label}">${Object.entries(DOMAINS).filter(([,m])=>m.group===g).map(([id,m])=>`<option value="${id}" ${id===current?"selected":""} ${id!==current&&state.domains.includes(id)?"disabled":""}>${esc(m.name)}</option>`).join("")}</optgroup>`;
 return `<label class="innate-field">${optional?"Third domain (optional)":`Domain ${index+1}`}<select class="select" data-domain-slot="${index}">${optional?`<option value="" ${current?"":"selected"}>None</option>`:""}${group("deity","Your deity’s domains")}${group("concept","Your deity concept")}</select></label>`;
}
function domainSettingsHTML(){
 return `<div class="domain-settings">${[0,1,2].map(domainSelectHTML).join("")}</div><p class="meta">Swap a domain by picking another one. A cleric normally has two domains; a third is not standard for a plain cleric and needs something like the Contemplative prestige class (<i>Complete Divine</i>) or your DM’s approval. It adds its spells and granted power, but you still get only one domain slot per spell level.</p>`;
}
function changeDomain(index,value){
 const next=state.domains.slice();
 if(value)next[index]=value;else next.splice(index,1);
 const domains=validDomains(next.filter(Boolean));
 const lost=state.prepared.filter(k=>{const src=k.split("|")[0];return src!=="cleric"&&!domains.includes(src);});
 if(lost.length&&!confirm(`This removes ${lost.length} prepared spell${lost.length===1?"":"s"} from the domain you are dropping. Continue?`)){render();return;}
 state.domains=domains;state.prepared=state.prepared.filter(k=>isActiveSource(k.split("|")[0]));
 if(selected&&!isActiveSource(selected.source))clearDetail();
 save();renderDomainChrome();render();if(selected)openSpell(selected);
}
function renderDomainSettings(){["domainSettings","mobileDomainSettings"].forEach(id=>{const node=document.getElementById(id);if(!node)return;node.innerHTML=domainSettingsHTML();node.querySelectorAll("[data-domain-slot]").forEach(sel=>sel.onchange=()=>changeDomain(+sel.dataset.domainSlot,sel.value));});}
function updateSlots(){syncCharacterUI();renderDomainSettings();const html=slotSummaryHTML();document.getElementById("slots").innerHTML=html;document.getElementById("mobileSlots").innerHTML=html;renderInnate();}
function applyCharacterChanges(event){
 const levelInput=document.getElementById("charLevel"),wisInput=document.getElementById("wis"),chaInput=document.getElementById("cha"),source=event&&event.currentTarget&&event.currentTarget.id.startsWith("mobile"),mobileLevel=document.getElementById("mobileCharLevel"),mobileWis=document.getElementById("mobileWis"),mobileCha=document.getElementById("mobileCha");
 if(source){levelInput.value=mobileLevel.value;wisInput.value=mobileWis.value;chaInput.value=mobileCha.value;}
 state.character.level=Math.min(20,Math.max(1,Number.parseInt(levelInput.value,10)||1));state.character.wisdom=Math.min(60,Math.max(1,Number.parseInt(wisInput.value,10)||1));state.character.charisma=Math.min(60,Math.max(1,Number.parseInt(chaInput.value,10)||1));save();render();if(selected)openSpell(selected);
}
// Closing the pop-up keeps the spell in the desktop side panel as a reference.
function closeModal(){const modal=document.getElementById("modal");modal.classList.remove("show");modal.setAttribute("aria-hidden","true");}
// The side panel's own × clears it back to its empty state.
function clearDetail(){closeModal();selected=null;document.getElementById("detail").innerHTML=DETAIL_EMPTY;}
document.getElementById("tabs").onclick=event=>{const button=event.target.closest(".tab");if(!button)return;closeModal();document.querySelectorAll(".tab").forEach(item=>item.classList.remove("active"));button.classList.add("active");tab=button.dataset.tab;document.getElementById("levelFilter").value="all";document.getElementById("preparedFilter").value="all";render();};
["search","levelFilter","preparedFilter"].forEach(id=>{const input=document.getElementById(id);input.oninput=render;input.onchange=render;});
["charLevel","wis","cha","mobileCharLevel","mobileWis","mobileCha"].forEach(id=>{const input=document.getElementById(id);input.onchange=applyCharacterChanges;});
function closeMobileTools(){document.getElementById("mobileToolsDrawer").classList.remove("show");document.getElementById("mobileToolsBackdrop").classList.remove("show");document.getElementById("mobileToolsDrawer").setAttribute("aria-hidden","true");document.getElementById("mobileToolsButton").setAttribute("aria-expanded","false");}
function openMobileTools(){document.getElementById("mobileToolsDrawer").classList.add("show");document.getElementById("mobileToolsBackdrop").classList.add("show");document.getElementById("mobileToolsDrawer").setAttribute("aria-hidden","false");document.getElementById("mobileToolsButton").setAttribute("aria-expanded","true");}
document.getElementById("mobileToolsButton").onclick=openMobileTools;document.getElementById("mobileToolsClose").onclick=closeMobileTools;document.getElementById("mobileToolsBackdrop").onclick=closeMobileTools;
document.getElementById("modal").onclick=event=>{if(event.target.id==="modal")closeModal();};
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeModal();closeMobileTools();}});
renderDomainChrome();render();

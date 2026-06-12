// Curated Navy / USCG Rules of the Road mnemonics, organized by the same
// category ids as the quiz bank.

export const MNEMONICS = [
  // ── Lights and Shapes ──
  {
    id: 'MN-001',
    category: 'lights_shapes',
    title: 'Trawler at night',
    mnemonic: 'Green over white, trawling tonight.',
    meaning: 'A vessel engaged in trawling shows an all-round green light over an all-round white light.',
    rule: 'Rule 26',
  },
  {
    id: 'MN-002',
    category: 'lights_shapes',
    title: 'Fishing vessel at night',
    mnemonic: 'Red over white, fishing at night.',
    meaning: 'A vessel engaged in fishing (other than trawling) shows an all-round red light over an all-round white light.',
    rule: 'Rule 26',
  },
  {
    id: 'MN-003',
    category: 'lights_shapes',
    title: 'Pilot vessel',
    mnemonic: 'White over red, pilot ahead.',
    meaning: 'A vessel on pilotage duty shows an all-round white light over an all-round red light at or near the masthead.',
    rule: 'Rule 29',
  },
  {
    id: 'MN-004',
    category: 'lights_shapes',
    title: 'Not under command',
    mnemonic: 'Red over red, the captain is dead.',
    meaning: 'A vessel not under command shows two all-round red lights in a vertical line (and no sidelights when not making way).',
    rule: 'Rule 27',
  },
  {
    id: 'MN-005',
    category: 'lights_shapes',
    title: 'Constrained by draft',
    mnemonic: 'Three reds in a row, nowhere else to go.',
    meaning: 'A vessel constrained by her draft may show three all-round red lights in a vertical line, or a cylinder by day.',
    rule: 'Rule 28',
  },
  {
    id: 'MN-006',
    category: 'lights_shapes',
    title: 'Restricted in ability to maneuver',
    mnemonic: 'Red, white, red — restricted ahead.',
    meaning: 'A vessel restricted in her ability to maneuver shows red-white-red all-round lights in a vertical line; ball-diamond-ball by day.',
    rule: 'Rule 27',
  },
  {
    id: 'MN-007',
    category: 'lights_shapes',
    title: 'Minesweeper',
    mnemonic: 'Green, green, green — the sweep is clean.',
    meaning: 'A vessel engaged in mine clearance shows three all-round green lights (one at the foremast head, one at each fore yardarm); three balls by day. Stay 1,000 m clear.',
    rule: 'Rule 27(f)',
  },
  {
    id: 'MN-008',
    category: 'lights_shapes',
    title: 'Sidelight memory',
    mnemonic: 'There is no red port wine left in the bottle.',
    meaning: 'Port side = red light = left side. Starboard is therefore green and right.',
    rule: 'Rule 21',
  },
  // ── General ──
  {
    id: 'MN-009',
    category: 'general',
    title: 'Pecking order (give-way hierarchy)',
    mnemonic: 'New Reels Catch Fish So Purchase Some.',
    meaning:
      'Not under command → Restricted in ability to maneuver → Constrained by draft → Fishing → Sailing → Power-driven → Seaplane. Each keeps out of the way of those above it.',
    rule: 'Rule 18',
  },
  {
    id: 'MN-010',
    category: 'general',
    title: 'Head-on at night',
    mnemonic: 'When both lights you see ahead, starboard wheel and show your red.',
    meaning: 'Meeting head-on, alter course to starboard so each vessel passes port-to-port showing her red sidelight.',
    rule: 'Rule 14',
  },
  {
    id: 'MN-011',
    category: 'general',
    title: 'Safe passing',
    mnemonic: 'Green to green, red to red — perfect safety, go ahead.',
    meaning: 'When vessels pass showing like sidelights to each other, they are on safe parallel courses.',
    rule: 'Rules 14–17',
  },
  {
    id: 'MN-012',
    category: 'general',
    title: 'Crossing — danger zone',
    mnemonic: 'If to starboard red appear, it is your duty to keep clear.',
    meaning:
      'Seeing another vessel\'s red sidelight on your starboard bow means you are the give-way vessel in a crossing situation.',
    rule: 'Rule 15',
  },
  {
    id: 'MN-013',
    category: 'general',
    title: 'Overtaking arc',
    mnemonic: 'Sternlight only? You are overtaking — stay away.',
    meaning:
      'Coming up more than 22.5° abaft the other vessel\'s beam, at night you would see only her sternlight: you are overtaking and must keep clear until finally past and clear.',
    rule: 'Rule 13',
  },
  // ── Towing ──
  {
    id: 'MN-014',
    category: 'towing',
    title: 'Short tow',
    mnemonic: 'White over white, short tow in sight.',
    meaning: 'A vessel towing astern with the tow 200 m or less shows two masthead lights in a vertical line.',
    rule: 'Rule 24',
  },
  {
    id: 'MN-015',
    category: 'towing',
    title: 'Long tow',
    mnemonic: 'White, white, white — long tow tonight.',
    meaning: 'When the tow exceeds 200 m, three masthead lights in a vertical line; a diamond shape by day.',
    rule: 'Rule 24',
  },
  {
    id: 'MN-016',
    category: 'towing',
    title: 'Towing from astern',
    mnemonic: 'Yellow over white, tug and tow in the night.',
    meaning: 'From astern, a towing vessel shows a yellow towing light directly above her white sternlight.',
    rule: 'Rule 24',
  },
  // ── Sound Signals ──
  {
    id: 'MN-017',
    category: 'sound',
    title: 'Maneuvering blasts',
    mnemonic: 'One to starboard, two to port, three for backing — short and short.',
    meaning:
      'In sight of another vessel: one short blast = altering to starboard; two = altering to port; three = operating astern propulsion.',
    rule: 'Rule 34',
  },
  {
    id: 'MN-018',
    category: 'sound',
    title: 'Danger signal',
    mnemonic: 'Five or more — what are you doing? I am not sure!',
    meaning: 'At least five short, rapid blasts signals doubt about the other vessel\'s intentions or actions.',
    rule: 'Rule 34(d)',
  },
  {
    id: 'MN-019',
    category: 'sound',
    title: 'Fog — who is talking?',
    mnemonic: 'One prolonged: power making way. Two: stopped. One-plus-two: the privileged say.',
    meaning:
      'Restricted visibility: one prolonged blast = power-driven making way; two prolonged = underway but stopped; one prolonged + two short = NUC, RAM, constrained by draft, sailing, fishing, or towing.',
    rule: 'Rule 35',
  },
  {
    id: 'MN-020',
    category: 'sound',
    title: 'Blast lengths',
    mnemonic: 'Short is one, prolonged is four-to-six — count it out.',
    meaning: 'A short blast is about one second; a prolonged blast is four to six seconds.',
    rule: 'Rule 32',
  },
  // ── Distress ──
  {
    id: 'MN-021',
    category: 'distress',
    title: 'Distress colors',
    mnemonic: 'Red rockets, red flares, orange smoke — when you see them, it is no joke.',
    meaning: 'Red pyrotechnics and orange smoke are Annex IV distress signals; report and assist.',
    rule: 'Annex IV',
  },
  {
    id: 'MN-022',
    category: 'distress',
    title: 'Arm signal',
    mnemonic: 'Slow flap means help.',
    meaning: 'Slowly and repeatedly raising and lowering arms outstretched to each side indicates distress.',
    rule: 'Annex IV',
  },
  // ── Annexes ──
  {
    id: 'MN-023',
    category: 'annexes',
    title: 'Whistle, bell, gong',
    mnemonic: '12 whistle, 20 bell, 100 gong.',
    meaning:
      'Vessels 12 m+ carry a whistle; 20 m+ add a bell; 100 m+ add a gong (sounded aft, after the bell forward).',
    rule: 'Rule 33 / Annex III',
  },
  {
    id: 'MN-024',
    category: 'annexes',
    title: 'Trawler signals (Annex II)',
    mnemonic: 'Shooting white-white, hauling white-red, fast red-red.',
    meaning:
      'Trawlers in close proximity: two whites = shooting nets; white over red = hauling; two reds = net fast on an obstruction.',
    rule: 'Annex II',
  },
]

export const MNEMONIC_BY_ID = Object.fromEntries(MNEMONICS.map((m) => [m.id, m]))

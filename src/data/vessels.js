// Lights Lab vessel data. Each vessel is a starboard-side profile drawn in a
// 240×100 viewBox (waterline at y=78, bow to the right). Every light carries
// its own rule reference so the viewer's popover and Rules Index links are
// data-driven. Day mode shows the silhouette (plus any prescribed day shapes);
// night mode shows the lights.
//
// Light fields: { id, color: white|red|green|yellow, x, y, label, ref,
//                 ruleId (Rules Index link), arc, desc, optional? }

export const VESSEL_CATEGORIES = [
  { id: 'navy', label: 'Navy' },
  { id: 'merchant', label: 'Merchant' },
  { id: 'fishing', label: 'Fishing' },
  { id: 'recreational', label: 'Recreational' },
  { id: 'towing', label: 'Towing' },
]

const SIDELIGHT_STBD = {
  color: 'green',
  label: 'Starboard sidelight',
  ref: 'Rule 21(b) / Rule 23(a)(iii)',
  ruleId: 'rule-21',
  arc: '112.5° — right ahead to 22.5° abaft the beam, starboard side',
  desc: 'Green sidelight. The port side carries the matching red light. From this starboard profile only the green is visible.',
}

const STERNLIGHT = {
  color: 'white',
  label: 'Sternlight',
  ref: 'Rule 21(c)',
  ruleId: 'rule-21',
  arc: '135° — centered on dead astern',
  desc: 'White light placed as nearly as practicable at the stern.',
}

export const VESSELS = [
  // ── NAVY ──
  {
    id: 'ddg',
    name: 'Destroyer (DDG)',
    category: 'navy',
    status: 'Power-driven vessel underway, 50 m or more in length',
    rulesSummary: 'Rule 23(a): masthead light forward; second masthead light abaft of and higher than the forward one; sidelights; sternlight.',
    paths: [
      'M18,78 L23,62 L186,62 L226,55 L219,78 Z',
      'M42,62 L42,47 L72,47 L72,62 Z',
      'M72,62 L72,38 L122,38 L122,49 L152,49 L152,62 Z',
      'M88,38 L88,17 L92,17 L92,38 Z',
      'M138,49 L138,29 L142,29 L142,49 Z',
    ],
    lights: [
      { id: 'mast-fwd', color: 'white', x: 140, y: 26, label: 'Forward masthead light', ref: 'Rule 23(a)(i)', ruleId: 'rule-23', arc: '225° — right ahead to 22.5° abaft the beam on each side', desc: 'White masthead light placed over the fore-and-aft centerline, forward.' },
      { id: 'mast-aft', color: 'white', x: 90, y: 14, label: 'After masthead light', ref: 'Rule 23(a)(ii)', ruleId: 'rule-23', arc: '225°', desc: 'Second masthead light, abaft of and at least 4.5 m higher than the forward one (Annex I §2(a)(ii)) so the pair reads as a range: lower light leads.' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 150, y: 45 },
      { ...STERNLIGHT, id: 'stern', x: 21, y: 58 },
    ],
  },
  {
    id: 'lcs',
    name: 'Littoral Combat Ship (LCS)',
    category: 'navy',
    status: 'Power-driven vessel underway, 50 m or more in length',
    rulesSummary: 'Rule 23(a) lights. The enclosed mast carries both masthead lights; warship configurations may vary under Rule 1(e).',
    paths: [
      'M22,78 L34,58 L198,58 L228,68 L210,78 Z',
      'M60,58 L74,32 L148,32 L160,58 Z',
      'M104,32 L108,16 L116,16 L120,32 Z',
    ],
    lights: [
      { id: 'mast-fwd', color: 'white', x: 146, y: 28, label: 'Forward masthead light', ref: 'Rule 23(a)(i)', ruleId: 'rule-23', arc: '225°', desc: 'Forward masthead light on the leading edge of the superstructure.' },
      { id: 'mast-aft', color: 'white', x: 112, y: 13, label: 'After masthead light', ref: 'Rule 23(a)(ii)', ruleId: 'rule-23', arc: '225°', desc: 'Abaft of and higher than the forward light. Where a warship\'s construction prevents full compliance, Rule 1(e) allows the closest possible arrangement.' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 152, y: 44 },
      { ...STERNLIGHT, id: 'stern', x: 26, y: 62 },
    ],
  },
  {
    id: 'cvn',
    name: 'Aircraft Carrier (CVN)',
    category: 'navy',
    status: 'Power-driven vessel underway — vessel of special construction (Rule 1(e))',
    rulesSummary: 'A carrier cannot place lights exactly as Rule 23 prescribes; Rule 1(e) requires the closest possible compliance. Masthead lights are on the island, offset to starboard.',
    paths: [
      'M14,78 L20,58 L226,58 L232,50 L222,78 Z',
      'M18,58 L18,50 L228,50 L228,58 Z',
      'M148,50 L148,26 L176,26 L176,50 Z',
      'M158,26 L158,12 L162,12 L162,26 Z',
    ],
    lights: [
      { id: 'mast-fwd', color: 'white', x: 172, y: 22, label: 'Forward masthead light (island)', ref: 'Rule 1(e) / Rule 23(a)(i)', ruleId: 'rule-1', arc: '225°', desc: 'Carried on the island, offset from the centerline — a Rule 1(e) closest-possible-compliance arrangement.' },
      { id: 'mast-aft', color: 'white', x: 160, y: 9, label: 'After masthead light (island mast)', ref: 'Rule 1(e) / Rule 23(a)(ii)', ruleId: 'rule-1', arc: '225°', desc: 'Higher than the forward light, but with less horizontal separation than Annex I intends — expect a compressed range when judging her aspect.' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 176, y: 40 },
      { ...STERNLIGHT, id: 'stern', x: 18, y: 55 },
    ],
  },

  // ── MERCHANT ──
  {
    id: 'container',
    name: 'Container Ship',
    category: 'merchant',
    status: 'Power-driven vessel underway, 50 m or more in length',
    rulesSummary: 'Rule 23(a) lights. Bridge aft: the forward masthead light rides a foremast near the bow, the after light atop the bridge.',
    paths: [
      'M14,78 L18,60 L212,60 L230,52 L221,78 Z',
      'M62,60 L62,38 L172,38 L172,60 Z',
      'M30,60 L30,28 L56,28 L56,60 Z',
      'M194,60 L194,36 L198,36 L198,60 Z',
    ],
    lights: [
      { id: 'mast-fwd', color: 'white', x: 196, y: 33, label: 'Forward masthead light', ref: 'Rule 23(a)(i)', ruleId: 'rule-23', arc: '225°', desc: 'On the foremast near the bow — not less than 6 m above the hull (Annex I §2(a)(i)).' },
      { id: 'mast-aft', color: 'white', x: 43, y: 20, label: 'After masthead light', ref: 'Rule 23(a)(ii)', ruleId: 'rule-23', arc: '225°', desc: 'Atop the bridge, at least 4.5 m higher than the forward light so the range opens with aspect change.' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 57, y: 32, desc: 'Green sidelight on the starboard bridge wing, screened inboard with matt black (Annex I §9).' },
      { ...STERNLIGHT, id: 'stern', x: 17, y: 57 },
    ],
  },

  // ── FISHING ──
  {
    id: 'trawler',
    name: 'Stern Trawler (trawling)',
    category: 'fishing',
    status: 'Vessel engaged in trawling, making way',
    rulesSummary: 'Rule 26(b): green over white all-round lights; when making way, also sidelights and a sternlight. "Green over white, trawling tonight."',
    paths: [
      'M28,78 L33,60 L162,60 L182,52 L174,78 Z',
      'M58,60 L58,42 L96,42 L96,60 Z',
      'M112,60 L112,22 L116,22 L116,60 Z',
      'M36,60 L36,40 L40,40 L48,60 Z',
    ],
    lights: [
      { id: 'trawl-green', color: 'green', x: 114, y: 18, label: 'All-round green (upper)', ref: 'Rule 26(b)(i)', ruleId: 'rule-26', arc: '360°', desc: 'Upper of the two all-round lights identifying a vessel engaged in trawling.' },
      { id: 'trawl-white', color: 'white', x: 114, y: 28, label: 'All-round white (lower)', ref: 'Rule 26(b)(i)', ruleId: 'rule-26', arc: '360°', desc: 'Lower light of the green-over-white pair. A trawler of 50 m or more would also show a masthead light abaft of and higher than these.' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 97, y: 47, ref: 'Rule 26(b)(iii)', ruleId: 'rule-26', desc: 'Shown only when making way through the water, with the sternlight.' },
      { ...STERNLIGHT, id: 'stern', x: 31, y: 57, ref: 'Rule 26(b)(iii)', ruleId: 'rule-26' },
    ],
  },
  {
    id: 'gillnetter',
    name: 'Fishing Vessel (nets, not trawling)',
    category: 'fishing',
    status: 'Vessel engaged in fishing other than trawling, making way',
    rulesSummary: 'Rule 26(c): red over white all-round lights. "Red over white, fishing at night." Gear extending more than 150 m adds an all-round white toward the gear.',
    paths: [
      'M30,78 L35,62 L150,62 L168,55 L160,78 Z',
      'M52,62 L52,45 L86,45 L86,62 Z',
      'M104,62 L104,24 L108,24 L108,62 Z',
    ],
    lights: [
      { id: 'fish-red', color: 'red', x: 106, y: 20, label: 'All-round red (upper)', ref: 'Rule 26(c)(i)', ruleId: 'rule-26', arc: '360°', desc: 'Upper light of the red-over-white pair for fishing other than trawling.' },
      { id: 'fish-white', color: 'white', x: 106, y: 30, label: 'All-round white (lower)', ref: 'Rule 26(c)(i)', ruleId: 'rule-26', arc: '360°', desc: 'Lower light of the pair. With outlying gear extending more than 150 m horizontally, an all-round white light is shown in the direction of the gear (Rule 26(c)(ii)).' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 87, y: 50, ref: 'Rule 26(c)(iii)', ruleId: 'rule-26', desc: 'Shown only when making way through the water, with the sternlight.' },
      { ...STERNLIGHT, id: 'stern', x: 33, y: 59, ref: 'Rule 26(c)(iii)', ruleId: 'rule-26' },
    ],
  },

  // ── RECREATIONAL ──
  {
    id: 'sailboat',
    name: 'Sailing Yacht (under sail)',
    category: 'recreational',
    status: 'Sailing vessel underway',
    rulesSummary: 'Rule 25(a): sidelights and a sternlight. May add all-round red over green at the masthead (Rule 25(c)) — never with a combined lantern.',
    paths: [
      'M40,78 L46,64 L152,64 L172,57 L162,78 Z',
      'M100,64 L100,8 L103,8 L103,64 Z',
      'M103,12 L150,58 L103,58 Z',
      'M100,16 L56,60 L100,60 Z',
    ],
    lights: [
      { id: 'opt-red', color: 'red', x: 101.5, y: 4, label: 'All-round red (optional)', ref: 'Rule 25(c)', ruleId: 'rule-25', arc: '360°', optional: true, desc: 'Optional red-over-green sailing identity lights at or near the top of the mast.' },
      { id: 'opt-green', color: 'green', x: 101.5, y: 12, label: 'All-round green (optional)', ref: 'Rule 25(c)', ruleId: 'rule-25', arc: '360°', optional: true, desc: 'Lower of the optional pair. Not shown together with a combined masthead lantern.' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 150, y: 60, ref: 'Rule 25(a)(i)', ruleId: 'rule-25', desc: 'A sailing vessel under 20 m may combine sidelights and sternlight in one masthead lantern (Rule 25(b)).' },
      { ...STERNLIGHT, id: 'stern', x: 43, y: 61, ref: 'Rule 25(a)(ii)', ruleId: 'rule-25' },
    ],
  },
  {
    id: 'runabout',
    name: 'Power Boat (under 12 m)',
    category: 'recreational',
    status: 'Power-driven vessel underway, less than 12 m in length',
    rulesSummary: 'Rule 23(d)(i): may show an all-round white light and sidelights in lieu of masthead light and sternlight.',
    paths: [
      'M58,78 L63,66 L150,66 L166,59 L158,78 Z',
      'M96,66 L100,56 L126,56 L130,66 Z',
      'M70,66 L70,44 L73,44 L73,66 Z',
    ],
    lights: [
      { id: 'allround', color: 'white', x: 71.5, y: 41, label: 'All-round white light', ref: 'Rule 23(d)(i)', ruleId: 'rule-23', arc: '360°', desc: 'Replaces the masthead light and sternlight on a power-driven vessel under 12 m.' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 152, y: 62, ref: 'Rule 23(d)(i)', ruleId: 'rule-23', desc: 'Sidelights are still required; small craft often carry them in a combined bow lantern.' },
    ],
  },

  // ── TOWING ──
  {
    id: 'tug-tow',
    name: 'Tug with Tow Astern (tow exceeds 200 m)',
    category: 'towing',
    status: 'Power-driven vessel towing astern, length of tow over 200 m',
    rulesSummary: 'Rule 24(a): three masthead lights in a vertical line, sidelights, sternlight, and a yellow towing light above the sternlight. The tow shows sidelights and a sternlight. By day, both display a diamond.',
    paths: [
      'M118,78 L123,62 L198,62 L214,56 L207,78 Z',
      'M138,62 L138,43 L172,43 L172,62 Z',
      'M152,43 L152,12 L156,12 L156,43 Z',
      'M20,78 L24,68 L92,68 L96,78 Z',
      'M54,68 L54,52 L57,52 L57,68 Z',
    ],
    extras: [
      { kind: 'towline', d: 'M120,64 C108,72 102,70 94,70' },
    ],
    dayShapes: [
      { kind: 'diamond', x: 154, y: 22, label: 'Diamond — tow exceeds 200 m (Rule 24(a)(v))' },
      { kind: 'diamond', x: 55.5, y: 58, label: 'Diamond on the tow (Rule 24(e)(iii))' },
    ],
    lights: [
      { id: 'mast-1', color: 'white', x: 154, y: 9, label: 'Masthead light (top of three)', ref: 'Rule 24(a)(i)', ruleId: 'rule-24', arc: '225°', desc: 'Three masthead lights in a vertical line because the tow, measured from the tug\'s stern to the after end of the tow, exceeds 200 m. "White, white, white — long tow tonight."' },
      { id: 'mast-2', color: 'white', x: 154, y: 18, label: 'Masthead light (middle)', ref: 'Rule 24(a)(i)', ruleId: 'rule-24', arc: '225°', desc: 'Middle of the vertical line of three. Two lights only when the tow is 200 m or less.' },
      { id: 'mast-3', color: 'white', x: 154, y: 27, label: 'Masthead light (bottom)', ref: 'Rule 24(a)(i)', ruleId: 'rule-24', arc: '225°', desc: 'Bottom of the vertical line of three masthead lights.' },
      { ...SIDELIGHT_STBD, id: 'side-stbd', x: 173, y: 48, ref: 'Rule 24(a)(ii)', ruleId: 'rule-24' },
      { id: 'towing-yellow', color: 'yellow', x: 122, y: 50, label: 'Towing light', ref: 'Rule 24(a)(iv) / Rule 21(d)', ruleId: 'rule-24', arc: '135° — same characteristics as the sternlight', desc: 'Yellow light in a vertical line above the sternlight. From astern: "yellow over white, tug and tow in the night."' },
      { ...STERNLIGHT, id: 'stern', x: 122, y: 58, ref: 'Rule 24(a)(iii)', ruleId: 'rule-24' },
      { id: 'tow-side', color: 'green', x: 90, y: 64, label: 'Tow — starboard sidelight', ref: 'Rule 24(e)(i)', ruleId: 'rule-24', arc: '112.5°', desc: 'A vessel or object being towed shows sidelights and a sternlight — no masthead lights.' },
      { id: 'tow-stern', color: 'white', x: 23, y: 71, label: 'Tow — sternlight', ref: 'Rule 24(e)(ii)', ruleId: 'rule-24', arc: '135°', desc: 'Sternlight at the after end of the tow.' },
    ],
  },
]

export const VESSEL_BY_ID = Object.fromEntries(VESSELS.map((v) => [v.id, v]))

// Board Mode fill-in-the-blank items. Multiple-choice items are drawn from
// the main quiz bank; these supply the mixed format. Answers are matched
// after normalization (case, punctuation, whitespace); every accepted
// variant is listed explicitly.

export const BOARD_FIB = [
  {
    id: 'FIB-001',
    category: 'general',
    prompt: 'A vessel is overtaking when coming up from more than ____ degrees abaft the other vessel\'s beam.',
    accept: ['22.5', '22 1/2', '22,5', 'twenty-two and a half'],
    display: '22.5',
    rule: 'Rule 13',
  },
  {
    id: 'FIB-002',
    category: 'sound',
    prompt: 'The danger signal is at least ____ short and rapid blasts on the whistle.',
    accept: ['5', 'five'],
    display: 'five',
    rule: 'Rule 34(d)',
  },
  {
    id: 'FIB-003',
    category: 'sound',
    prompt: 'One short blast means: I am altering my course to ____.',
    accept: ['starboard', 'stbd'],
    display: 'starboard',
    rule: 'Rule 34',
  },
  {
    id: 'FIB-004',
    category: 'sound',
    prompt: 'Three short blasts mean: I am operating ____ propulsion.',
    accept: ['astern', 'stern'],
    display: 'astern',
    rule: 'Rule 34',
  },
  {
    id: 'FIB-005',
    category: 'sound',
    prompt: 'A prolonged blast lasts from four to ____ seconds.',
    accept: ['6', 'six'],
    display: 'six',
    rule: 'Rule 32',
  },
  {
    id: 'FIB-006',
    category: 'towing',
    prompt: 'A towing vessel shows three masthead lights in a vertical line when the tow exceeds ____ meters.',
    accept: ['200', 'two hundred'],
    display: '200',
    rule: 'Rule 24',
  },
  {
    id: 'FIB-007',
    category: 'towing',
    prompt: 'The towing light above the sternlight is ____ in color.',
    accept: ['yellow', 'amber'],
    display: 'yellow',
    rule: 'Rule 24',
  },
  {
    id: 'FIB-008',
    category: 'towing',
    prompt: 'By day, a tow exceeding 200 meters displays a ____ shape.',
    accept: ['diamond'],
    display: 'diamond',
    rule: 'Rule 24',
  },
  {
    id: 'FIB-009',
    category: 'lights_shapes',
    prompt: 'A sidelight shows an unbroken arc of ____ degrees.',
    accept: ['112.5', '112 1/2', '112,5'],
    display: '112.5',
    rule: 'Rule 21',
  },
  {
    id: 'FIB-010',
    category: 'lights_shapes',
    prompt: 'A sternlight shows an unbroken arc of ____ degrees.',
    accept: ['135', 'one hundred thirty-five'],
    display: '135',
    rule: 'Rule 21',
  },
  {
    id: 'FIB-011',
    category: 'lights_shapes',
    prompt: 'A masthead light shows an unbroken arc of ____ degrees.',
    accept: ['225', 'two hundred twenty-five'],
    display: '225',
    rule: 'Rule 21',
  },
  {
    id: 'FIB-012',
    category: 'lights_shapes',
    prompt: 'A vessel at anchor displays one ____ in the fore part by day.',
    accept: ['ball', 'black ball'],
    display: 'ball',
    rule: 'Rule 30',
  },
  {
    id: 'FIB-013',
    category: 'lights_shapes',
    prompt: 'A vessel not under command shows two all-round ____ lights in a vertical line.',
    accept: ['red'],
    display: 'red',
    rule: 'Rule 27',
  },
  {
    id: 'FIB-014',
    category: 'lights_shapes',
    prompt: 'A sailing vessel also propelled by machinery displays a cone, apex ____.',
    accept: ['down', 'downward', 'downwards'],
    display: 'downwards',
    rule: 'Rule 25',
  },
  {
    id: 'FIB-015',
    category: 'general',
    prompt: 'Risk of collision shall be deemed to exist if the compass ____ of an approaching vessel does not appreciably change.',
    accept: ['bearing'],
    display: 'bearing',
    rule: 'Rule 7',
  },
  {
    id: 'FIB-016',
    category: 'general',
    prompt: 'In a crossing situation, the give-way vessel shall avoid crossing ____ of the other vessel.',
    accept: ['ahead', 'in front'],
    display: 'ahead',
    rule: 'Rule 15',
  },
  {
    id: 'FIB-017',
    category: 'general',
    prompt: 'In a narrow channel, keep as near as is safe and practicable to the outer limit on your ____ side.',
    accept: ['starboard', 'stbd'],
    display: 'starboard',
    rule: 'Rule 9',
  },
  {
    id: 'FIB-018',
    category: 'distress',
    prompt: 'The spoken radiotelephone distress signal is the word ____.',
    accept: ['mayday', 'may day'],
    display: 'Mayday',
    rule: 'Annex IV',
  },
  {
    id: 'FIB-019',
    category: 'distress',
    prompt: 'A distress smoke signal gives off ____-colored smoke.',
    accept: ['orange'],
    display: 'orange',
    rule: 'Annex IV',
  },
  {
    id: 'FIB-020',
    category: 'sound',
    prompt: 'A vessel at anchor in restricted visibility rings the bell rapidly for about ____ seconds at intervals of not more than one minute.',
    accept: ['5', 'five'],
    display: 'five',
    rule: 'Rule 35',
  },
  {
    id: 'FIB-021',
    category: 'annexes',
    prompt: 'A vessel of 100 meters or more in length must carry a whistle, a bell, and a ____.',
    accept: ['gong'],
    display: 'gong',
    rule: 'Rule 33',
  },
  {
    id: 'FIB-022',
    category: 'annexes',
    prompt: 'Day shapes shall be ____ in color.',
    accept: ['black'],
    display: 'black',
    rule: 'Annex I',
  },
]

export function normalizeAnswer(s) {
  return String(s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[°º]/g, '')
    .replace(/[^\w\s./,-]/g, '')
    .replace(/\s+/g, ' ')
}

export function fibMatches(item, answer) {
  const norm = normalizeAnswer(answer)
  if (!norm) return false
  return item.accept.some((a) => normalizeAnswer(a) === norm)
}

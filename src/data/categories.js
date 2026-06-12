export const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'lights_shapes', label: 'Lights and Shapes' },
  { id: 'towing', label: 'Towing' },
  { id: 'distress', label: 'Distress Signals' },
  { id: 'sound', label: 'Sound Signals' },
  { id: 'annexes', label: 'Annexes' },
]

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))

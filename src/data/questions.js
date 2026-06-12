// SeaSmart question bank — USCG-style Rules of the Road questions.
// Structure mirrors the official USCG quiz bank so the full bank can be
// imported by extending this array (or replacing it with a Supabase table)
// without touching the quiz engine.
//
// Fields:
//   id        stable question id (used for adaptive stats + bookmarks)
//   category  one of src/data/categories.js ids
//   question  stem text
//   correct   the correct choice
//   distractors  three incorrect choices
//   rule      rule reference shown with feedback
//   ruleText  verbatim rule text shown on an incorrect answer
//   critical  array of phrases inside ruleText to highlight in yellow
//   illo      optional illustration descriptor (rendered as SVG)

export const QUESTIONS = [
  // ───────────────────────── GENERAL ─────────────────────────
  {
    id: 'GEN-001',
    category: 'general',
    question: 'Every vessel shall at all times maintain a proper look-out by what means?',
    correct: 'Sight and hearing as well as all available means appropriate in the prevailing circumstances',
    distractors: [
      'Sight alone, supplemented by radar at night',
      'Radar and AIS whenever fitted and operational',
      'Sight and hearing during daylight hours only',
    ],
    rule: 'Rule 5 — Look-out',
    ruleText:
      'Every vessel shall at all times maintain a proper look-out by sight and hearing as well as by all available means appropriate in the prevailing circumstances and conditions so as to make a full appraisal of the situation and of the risk of collision.',
    critical: ['at all times', 'sight and hearing', 'all available means', 'full appraisal'],
  },
  {
    id: 'GEN-002',
    category: 'general',
    question: 'Every vessel shall at all times proceed at a safe speed so that she can do what?',
    correct: 'Take proper and effective action to avoid collision and be stopped within an appropriate distance',
    distractors: [
      'Maintain steerageway in all sea states',
      'Stop within half the distance of visibility',
      'Keep pace with the flow of traffic in the area',
    ],
    rule: 'Rule 6 — Safe Speed',
    ruleText:
      'Every vessel shall at all times proceed at a safe speed so that she can take proper and effective action to avoid collision and be stopped within a distance appropriate to the prevailing circumstances and conditions.',
    critical: ['safe speed', 'proper and effective action', 'stopped within a distance appropriate'],
  },
  {
    id: 'GEN-003',
    category: 'general',
    question: 'Risk of collision shall be deemed to exist if which of the following occurs?',
    correct: 'The compass bearing of an approaching vessel does not appreciably change',
    distractors: [
      'The relative speed of an approaching vessel exceeds 10 knots',
      'An approaching vessel is detected by radar inside 12 miles',
      'The range to an approaching vessel decreases on two successive observations',
    ],
    rule: 'Rule 7 — Risk of Collision',
    ruleText:
      'Such risk shall be deemed to exist if the compass bearing of an approaching vessel does not appreciably change. Such risk may sometimes exist even when an appreciable bearing change is evident, particularly when approaching a very large vessel or a tow or when approaching a vessel at close range.',
    critical: ['compass bearing', 'does not appreciably change', 'very large vessel or a tow'],
  },
  {
    id: 'GEN-004',
    category: 'general',
    question: 'Any action taken to avoid collision shall, if the circumstances of the case admit, be:',
    correct: 'Positive, made in ample time and with due regard to the observance of good seamanship',
    distractors: [
      'A series of small alterations of course and speed',
      'Limited to a change of speed so the other vessel is not confused',
      'Delayed until risk of collision is confirmed by radar plotting',
    ],
    rule: 'Rule 8 — Action to Avoid Collision',
    ruleText:
      'Any action taken to avoid collision shall, if the circumstances of the case admit, be positive, made in ample time and with due regard to the observance of good seamanship. Any alteration of course and/or speed to avoid collision shall, if the circumstances of the case admit, be large enough to be readily apparent to another vessel observing visually or by radar; a succession of small alterations of course and/or speed should be avoided.',
    critical: ['positive', 'ample time', 'large enough to be readily apparent', 'succession of small alterations', 'should be avoided'],
  },
  {
    id: 'GEN-005',
    category: 'general',
    question: 'A vessel proceeding along the course of a narrow channel or fairway shall keep:',
    correct: 'As near to the outer limit of the channel which lies on her starboard side as is safe and practicable',
    distractors: [
      'To the centerline of the channel whenever depth permits',
      'As near to the outer limit of the channel on her port side as is safe',
      'To whichever side of the channel has the least traffic',
    ],
    rule: 'Rule 9 — Narrow Channels',
    ruleText:
      'A vessel proceeding along the course of a narrow channel or fairway shall keep as near to the outer limit of the channel or fairway which lies on her starboard side as is safe and practicable.',
    critical: ['outer limit', 'starboard side', 'safe and practicable'],
  },
  {
    id: 'GEN-006',
    category: 'general',
    question: 'A vessel using a traffic separation scheme shall join or leave a lane normally:',
    correct: 'At the termination of the lane, but when joining from either side shall do so at as small an angle to the general direction of traffic flow as practicable',
    distractors: [
      'At any point, crossing the separation zone at a right angle',
      'Only at the mid-point of the lane, at a broad angle to traffic flow',
      'At the termination of the lane, and never from the side',
    ],
    rule: 'Rule 10 — Traffic Separation Schemes',
    ruleText:
      'A vessel using a traffic separation scheme shall so far as practicable keep clear of a traffic separation line or separation zone, and normally join or leave a traffic lane at the termination of the lane, but when joining or leaving from either side shall do so at as small an angle to the general direction of traffic flow as practicable.',
    critical: ['termination of the lane', 'as small an angle', 'general direction of traffic flow'],
  },
  {
    id: 'GEN-007',
    category: 'general',
    question: 'When two sailing vessels are approaching one another with the wind on different sides, which vessel shall keep out of the way?',
    correct: 'The vessel which has the wind on the port side',
    distractors: [
      'The vessel which has the wind on the starboard side',
      'The vessel which is to leeward',
      'The smaller of the two vessels',
    ],
    rule: 'Rule 12 — Sailing Vessels',
    ruleText:
      'When two sailing vessels are approaching one another, so as to involve risk of collision, one of them shall keep out of the way of the other as follows: when each has the wind on a different side, the vessel which has the wind on the port side shall keep out of the way of the other.',
    critical: ['wind on the port side', 'keep out of the way'],
  },
  {
    id: 'GEN-008',
    category: 'general',
    question: 'A vessel shall be deemed to be overtaking when coming up with another vessel from a direction more than how many degrees abaft her beam?',
    correct: '22.5 degrees',
    distractors: ['10 degrees', '45 degrees', '90 degrees'],
    rule: 'Rule 13 — Overtaking',
    ruleText:
      'A vessel shall be deemed to be overtaking when coming up with another vessel from a direction more than 22.5 degrees abaft her beam, that is, in such a position with reference to the vessel she is overtaking, that at night she would be able to see only the sternlight of that vessel but neither of her sidelights.',
    critical: ['22.5 degrees abaft her beam', 'only the sternlight', 'neither of her sidelights'],
  },
  {
    id: 'GEN-009',
    category: 'general',
    question: 'When two power-driven vessels are meeting on reciprocal or nearly reciprocal courses so as to involve risk of collision, each shall:',
    correct: 'Alter course to starboard so that each shall pass on the port side of the other',
    distractors: [
      'Alter course to port so that each shall pass on the starboard side of the other',
      'Stop engines and assess the situation before maneuvering',
      'Maintain course and speed and sound one short blast',
    ],
    rule: 'Rule 14 — Head-on Situation',
    ruleText:
      'When two power-driven vessels are meeting on reciprocal or nearly reciprocal courses so as to involve risk of collision each shall alter her course to starboard so that each shall pass on the port side of the other.',
    critical: ['alter her course to starboard', 'pass on the port side of the other'],
  },
  {
    id: 'GEN-010',
    category: 'general',
    question: 'In a crossing situation between two power-driven vessels, the give-way vessel shall, if the circumstances admit:',
    correct: 'Avoid crossing ahead of the other vessel',
    distractors: [
      'Cross ahead of the other vessel at increased speed',
      'Alter course to port and pass astern',
      'Maintain course and sound the danger signal',
    ],
    rule: 'Rule 15 — Crossing Situation',
    ruleText:
      'When two power-driven vessels are crossing so as to involve risk of collision, the vessel which has the other on her own starboard side shall keep out of the way and shall, if the circumstances of the case admit, avoid crossing ahead of the other vessel.',
    critical: ['other on her own starboard side', 'keep out of the way', 'avoid crossing ahead'],
  },
  {
    id: 'GEN-011',
    category: 'general',
    question: 'The stand-on vessel may take action to avoid collision by her maneuver alone:',
    correct: 'As soon as it becomes apparent that the give-way vessel is not taking appropriate action',
    distractors: [
      'Only when collision cannot be avoided by the give-way vessel alone',
      'At any time, since she is free to maneuver as she sees fit',
      'Never — she must hold course and speed until the vessels have passed',
    ],
    rule: 'Rule 17 — Action by Stand-on Vessel',
    ruleText:
      'The latter vessel may however take action to avoid collision by her manoeuvre alone, as soon as it becomes apparent to her that the vessel required to keep out of the way is not taking appropriate action in compliance with these Rules. When, from any cause, the vessel required to keep her course and speed finds herself so close that collision cannot be avoided by the action of the give-way vessel alone, she shall take such action as will best aid to avoid collision.',
    critical: ['as soon as it becomes apparent', 'not taking appropriate action', 'shall take such action as will best aid'],
  },
  {
    id: 'GEN-012',
    category: 'general',
    question: 'Which vessel shall keep out of the way of all the others listed?',
    correct: 'A power-driven vessel underway',
    distractors: [
      'A vessel not under command',
      'A vessel restricted in her ability to maneuver',
      'A vessel engaged in fishing',
    ],
    rule: 'Rule 18 — Responsibilities Between Vessels',
    ruleText:
      'A power-driven vessel underway shall keep out of the way of: a vessel not under command; a vessel restricted in her ability to manoeuvre; a vessel engaged in fishing; a sailing vessel.',
    critical: ['power-driven vessel underway', 'keep out of the way'],
  },
  {
    id: 'GEN-013',
    category: 'general',
    question: 'A vessel which hears, apparently forward of her beam, the fog signal of another vessel shall:',
    correct: 'Reduce her speed to the minimum at which she can be kept on her course',
    distractors: [
      'Sound the danger signal and maintain speed',
      'Alter course to starboard immediately',
      'Stop her engines and anchor without delay',
    ],
    rule: 'Rule 19 — Conduct in Restricted Visibility',
    ruleText:
      'Except where it has been determined that a risk of collision does not exist, every vessel which hears apparently forward of her beam the fog signal of another vessel, or which cannot avoid a close-quarters situation with another vessel forward of her beam, shall reduce her speed to the minimum at which she can be kept on her course. She shall if necessary take all her way off and in any event navigate with extreme caution until danger of collision is over.',
    critical: ['forward of her beam', 'reduce her speed to the minimum', 'take all her way off', 'extreme caution'],
  },

  // ───────────────────── LIGHTS AND SHAPES ─────────────────────
  {
    id: 'LTS-001',
    category: 'lights_shapes',
    question: 'A sidelight shall show an unbroken light over an arc of the horizon of how many degrees?',
    correct: '112.5 degrees',
    distractors: ['135 degrees', '225 degrees', '360 degrees'],
    rule: 'Rule 21 — Definitions',
    ruleText:
      '"Sidelights" means a green light on the starboard side and a red light on the port side each showing an unbroken light over an arc of the horizon of 112.5 degrees and so fixed as to show the light from right ahead to 22.5 degrees abaft the beam on its respective side.',
    critical: ['112.5 degrees', 'right ahead to 22.5 degrees abaft the beam'],
  },
  {
    id: 'LTS-002',
    category: 'lights_shapes',
    question: 'You sight these lights at night. What are you looking at?',
    correct: 'A power-driven vessel underway seen from dead ahead',
    distractors: [
      'A vessel at anchor',
      'A power-driven vessel underway seen from astern',
      'A vessel engaged in trawling',
    ],
    rule: 'Rule 23 — Power-driven Vessels Underway',
    ruleText:
      'A power-driven vessel underway shall exhibit: a masthead light forward; a second masthead light abaft of and higher than the forward one; sidelights; a sternlight.',
    critical: ['masthead light forward', 'second masthead light abaft of and higher', 'sidelights', 'sternlight'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'white', x: 50, y: 22 },
        { c: 'white', x: 50, y: 38 },
        { c: 'red', x: 38, y: 56 },
        { c: 'green', x: 62, y: 56 },
      ],
      caption: 'Night sighting, bow-on',
    },
  },
  {
    id: 'LTS-003',
    category: 'lights_shapes',
    question: 'At night you observe two all-round red lights in a vertical line and no sidelights. What does this indicate?',
    correct: 'A vessel not under command, not making way',
    distractors: [
      'A vessel constrained by her draft',
      'A vessel aground',
      'A vessel engaged in mine clearance',
    ],
    rule: 'Rule 27 — Vessels Not Under Command',
    ruleText:
      'A vessel not under command shall exhibit: two all-round red lights in a vertical line where they can best be seen; two balls or similar shapes in a vertical line where they can best be seen; when making way through the water, in addition to the lights prescribed in this paragraph, sidelights and a sternlight.',
    critical: ['two all-round red lights in a vertical line', 'two balls', 'when making way', 'sidelights and a sternlight'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'red', x: 50, y: 26 },
        { c: 'red', x: 50, y: 44 },
      ],
      caption: 'Night sighting',
    },
  },
  {
    id: 'LTS-004',
    category: 'lights_shapes',
    question: 'A vessel restricted in her ability to maneuver shall exhibit which lights in a vertical line?',
    correct: 'Red, white, red all-round lights',
    distractors: [
      'Red, red, red all-round lights',
      'White, red, white all-round lights',
      'Green, white, green all-round lights',
    ],
    rule: 'Rule 27 — Vessels Restricted in Their Ability to Maneuver',
    ruleText:
      'A vessel restricted in her ability to manoeuvre shall exhibit: three all-round lights in a vertical line where they can best be seen. The highest and lowest of these lights shall be red and the middle light shall be white.',
    critical: ['three all-round lights in a vertical line', 'highest and lowest of these lights shall be red', 'middle light shall be white'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'red', x: 50, y: 20 },
        { c: 'white', x: 50, y: 36 },
        { c: 'red', x: 50, y: 52 },
      ],
      caption: 'Night sighting',
    },
  },
  {
    id: 'LTS-005',
    category: 'lights_shapes',
    question: 'You see this day shape displayed by a vessel. What is the vessel doing?',
    correct: 'She is at anchor',
    distractors: [
      'She is engaged in fishing',
      'She is not under command',
      'She is constrained by her draft',
    ],
    rule: 'Rule 30 — Anchored Vessels',
    ruleText:
      'A vessel at anchor shall exhibit where it can best be seen: in the fore part, an all-round white light or one ball; at or near the stern and at a lower level than the light prescribed in subparagraph (i), an all-round white light.',
    critical: ['at anchor', 'one ball', 'all-round white light'],
    illo: { kind: 'shapes', stack: ['ball'], caption: 'Day shape, fore part of vessel' },
  },
  {
    id: 'LTS-006',
    category: 'lights_shapes',
    question: 'A vessel engaged in trawling shall exhibit which all-round lights in a vertical line?',
    correct: 'Green over white',
    distractors: ['Red over white', 'White over red', 'Red over green'],
    rule: 'Rule 26 — Fishing Vessels',
    ruleText:
      'A vessel engaged in trawling, by which is meant the dragging through the water of a dredge net or other apparatus used as a fishing appliance, shall exhibit: two all-round lights in a vertical line, the upper being green and the lower white.',
    critical: ['trawling', 'upper being green and the lower white'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'green', x: 50, y: 26 },
        { c: 'white', x: 50, y: 44 },
      ],
      caption: 'Night sighting',
    },
  },
  {
    id: 'LTS-007',
    category: 'lights_shapes',
    question: 'A vessel engaged in fishing, other than trawling, shall exhibit which all-round lights in a vertical line?',
    correct: 'Red over white',
    distractors: ['Green over white', 'White over red', 'Red over red'],
    rule: 'Rule 26 — Fishing Vessels',
    ruleText:
      'A vessel engaged in fishing, other than trawling, shall exhibit: two all-round lights in a vertical line, the upper being red and the lower white.',
    critical: ['other than trawling', 'upper being red and the lower white'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'red', x: 50, y: 26 },
        { c: 'white', x: 50, y: 44 },
      ],
      caption: 'Night sighting',
    },
  },
  {
    id: 'LTS-008',
    category: 'lights_shapes',
    question: 'You sight this day shape arrangement: ball — diamond — ball in a vertical line. What does it indicate?',
    correct: 'A vessel restricted in her ability to maneuver',
    distractors: [
      'A vessel not under command',
      'A vessel engaged in fishing',
      'A vessel constrained by her draft',
    ],
    rule: 'Rule 27 — Vessels Restricted in Their Ability to Maneuver',
    ruleText:
      'A vessel restricted in her ability to manoeuvre shall exhibit: three shapes in a vertical line where they can best be seen. The highest and lowest of these shapes shall be balls and the middle one a diamond.',
    critical: ['three shapes in a vertical line', 'highest and lowest', 'balls', 'middle one a diamond'],
    illo: { kind: 'shapes', stack: ['ball', 'diamond', 'ball'], caption: 'Day shapes' },
  },
  {
    id: 'LTS-009',
    category: 'lights_shapes',
    question: 'A vessel constrained by her draft may exhibit which lights in addition to those for a power-driven vessel?',
    correct: 'Three all-round red lights in a vertical line',
    distractors: [
      'Two all-round red lights in a vertical line',
      'Red, white, red all-round lights in a vertical line',
      'A single all-round red light where best seen',
    ],
    rule: 'Rule 28 — Vessels Constrained by Their Draft',
    ruleText:
      'A vessel constrained by her draught may, in addition to the lights prescribed for power-driven vessels in Rule 23, exhibit where they can best be seen three all-round red lights in a vertical line, or a cylinder.',
    critical: ['three all-round red lights in a vertical line', 'cylinder'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'red', x: 50, y: 18 },
        { c: 'red', x: 50, y: 34 },
        { c: 'red', x: 50, y: 50 },
      ],
      caption: 'Night sighting (in addition to Rule 23 lights)',
    },
  },
  {
    id: 'LTS-010',
    category: 'lights_shapes',
    question: 'A vessel proceeding under sail, when also being propelled by machinery, shall exhibit forward where it can best be seen:',
    correct: 'A conical shape, apex downwards',
    distractors: [
      'A ball',
      'A cylinder',
      'A diamond shape',
    ],
    rule: 'Rule 25 — Sailing Vessels Underway',
    ruleText:
      'A vessel proceeding under sail when also being propelled by machinery shall exhibit forward where it can best be seen a conical shape, apex downwards.',
    critical: ['under sail when also being propelled by machinery', 'conical shape, apex downwards'],
    illo: { kind: 'shapes', stack: ['cone-down'], caption: 'Day shape, forward' },
  },
  {
    id: 'LTS-011',
    category: 'lights_shapes',
    question: 'A pilot vessel engaged on pilotage duty shall exhibit at or near the masthead which two all-round lights in a vertical line?',
    correct: 'White over red',
    distractors: ['Red over white', 'White over green', 'Red over red'],
    rule: 'Rule 29 — Pilot Vessels',
    ruleText:
      'A vessel engaged on pilotage duty shall exhibit: at or near the masthead, two all-round lights in a vertical line, the upper being white and the lower red.',
    critical: ['pilotage duty', 'upper being white and the lower red'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'white', x: 50, y: 26 },
        { c: 'red', x: 50, y: 44 },
      ],
      caption: 'Night sighting, at or near the masthead',
    },
  },
  {
    id: 'LTS-012',
    category: 'lights_shapes',
    question: 'A power-driven vessel of less than 12 meters in length may, in lieu of the lights in Rule 23(a), exhibit:',
    correct: 'An all-round white light and sidelights',
    distractors: [
      'A single all-round white light only, with no sidelights required',
      'Sidelights and a sternlight only',
      'An all-round red light and sidelights',
    ],
    rule: 'Rule 23 — Power-driven Vessels Underway',
    ruleText:
      'A power-driven vessel of less than 12 metres in length may in lieu of the lights prescribed in paragraph (a) of this Rule exhibit an all-round white light and sidelights.',
    critical: ['less than 12 metres', 'all-round white light and sidelights'],
  },
  {
    id: 'LTS-013',
    category: 'lights_shapes',
    question: 'A vessel aground shall exhibit, in addition to anchor lights, which lights and shapes?',
    correct: 'Two all-round red lights in a vertical line and three balls in a vertical line',
    distractors: [
      'Three all-round red lights and two balls in a vertical line',
      'Red, white, red lights and ball-diamond-ball shapes',
      'A single red light and a single ball',
    ],
    rule: 'Rule 30 — Vessels Aground',
    ruleText:
      'A vessel aground shall exhibit the lights prescribed in paragraph (a) or (b) of this Rule and in addition, where they can best be seen: two all-round red lights in a vertical line; three balls in a vertical line.',
    critical: ['aground', 'two all-round red lights', 'three balls in a vertical line'],
    illo: { kind: 'shapes', stack: ['ball', 'ball', 'ball'], caption: 'Day shapes' },
  },

  // ───────────────────────── TOWING ─────────────────────────
  {
    id: 'TOW-001',
    category: 'towing',
    question: 'A power-driven vessel towing astern, where the length of the tow exceeds 200 meters, shall exhibit how many masthead lights in a vertical line?',
    correct: 'Three',
    distractors: ['Two', 'Four', 'One, plus a yellow towing light'],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'A power-driven vessel when towing shall exhibit: instead of the light prescribed in Rule 23(a)(i) or (a)(ii), two masthead lights in a vertical line. When the length of the tow, measuring from the stern of the towing vessel to the after end of the tow exceeds 200 metres, three such lights in a vertical line.',
    critical: ['two masthead lights in a vertical line', 'exceeds 200 metres', 'three such lights'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'white', x: 50, y: 16 },
        { c: 'white', x: 50, y: 30 },
        { c: 'white', x: 50, y: 44 },
        { c: 'red', x: 38, y: 62 },
        { c: 'green', x: 62, y: 62 },
      ],
      caption: 'Night sighting, bow-on',
    },
  },
  {
    id: 'TOW-002',
    category: 'towing',
    question: 'A vessel towing astern shall exhibit, in addition to sidelights and a sternlight, what light in a vertical line above the sternlight?',
    correct: 'A towing light (yellow)',
    distractors: [
      'An all-round white light',
      'A second sternlight (white)',
      'An all-round red light',
    ],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'A power-driven vessel when towing shall exhibit: sidelights; a sternlight; a towing light in a vertical line above the sternlight. "Towing light" means a yellow light having the same characteristics as the sternlight.',
    critical: ['towing light in a vertical line above the sternlight', 'yellow light', 'same characteristics as the sternlight'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'yellow', x: 50, y: 30 },
        { c: 'white', x: 50, y: 48 },
      ],
      caption: 'Night sighting, from astern',
    },
  },
  {
    id: 'TOW-003',
    category: 'towing',
    question: 'When the length of the tow exceeds 200 meters, the towing vessel shall display which day shape where it can best be seen?',
    correct: 'A diamond shape',
    distractors: ['A ball', 'A cylinder', 'Two cones, apexes together'],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'A power-driven vessel when towing shall exhibit: when the length of the tow exceeds 200 metres, a diamond shape where it can best be seen.',
    critical: ['exceeds 200 metres', 'diamond shape'],
    illo: { kind: 'shapes', stack: ['diamond'], caption: 'Day shape, tow exceeds 200 m' },
  },
  {
    id: 'TOW-004',
    category: 'towing',
    question: 'A vessel or object being towed astern shall exhibit:',
    correct: 'Sidelights and a sternlight',
    distractors: [
      'Sidelights, a sternlight, and a masthead light',
      'An all-round white light at each end',
      'A yellow towing light and sidelights',
    ],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'A vessel or object being towed, other than those mentioned in paragraph (g) of this Rule, shall exhibit: sidelights; a sternlight; when the length of the tow exceeds 200 metres, a diamond shape where it can best be seen.',
    critical: ['being towed', 'sidelights', 'sternlight', 'diamond shape'],
  },
  {
    id: 'TOW-005',
    category: 'towing',
    question: 'When a power-driven vessel is pushing ahead and is rigidly connected to the vessel being pushed into a composite unit, the unit shall be lighted as:',
    correct: 'A single power-driven vessel',
    distractors: [
      'A vessel towing astern with a tow under 200 meters',
      'A vessel restricted in her ability to maneuver',
      'Two separate vessels, each with full navigation lights',
    ],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'When a pushing vessel and a vessel being pushed ahead are rigidly connected in a composite unit they shall be regarded as a power-driven vessel and exhibit the lights prescribed in Rule 23.',
    critical: ['rigidly connected in a composite unit', 'regarded as a power-driven vessel'],
  },
  {
    id: 'TOW-006',
    category: 'towing',
    question: 'A power-driven vessel pushing ahead or towing alongside (not a composite unit) shall exhibit:',
    correct: 'Two masthead lights in a vertical line, sidelights, and a sternlight',
    distractors: [
      'Three masthead lights in a vertical line, sidelights, and a sternlight',
      'Two masthead lights, sidelights, a sternlight, and a towing light',
      'One masthead light, sidelights, and two towing lights',
    ],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'A power-driven vessel when pushing ahead or towing alongside, except in the case of a composite unit, shall exhibit: two masthead lights in a vertical line; sidelights; a sternlight.',
    critical: ['pushing ahead or towing alongside', 'two masthead lights in a vertical line', 'sternlight'],
  },
  {
    id: 'TOW-007',
    category: 'towing',
    question: 'An inconspicuous, partly submerged vessel or object being towed, where the length of the tow exceeds 200 meters, shall exhibit:',
    correct: 'Four all-round white lights to mark its length and breadth, and additional lights as prescribed',
    distractors: [
      'A single all-round white light at the after end',
      'Sidelights and a sternlight only',
      'Two all-round red lights in a vertical line',
    ],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'An inconspicuous, partly submerged vessel or object, or combination of such vessels or objects being towed, shall exhibit: if it is 25 metres or more in breadth, two additional all-round white lights at or near the extremities of its breadth; if it exceeds 100 metres in length, additional all-round white lights between the lights prescribed so that the distance between the lights shall not exceed 100 metres.',
    critical: ['inconspicuous, partly submerged', 'all-round white lights', 'extremities'],
  },
  {
    id: 'TOW-008',
    category: 'towing',
    question: 'You sight a yellow light above a white light at night, both showing toward you. What are you seeing?',
    correct: 'The stern of a vessel towing astern',
    distractors: [
      'A pilot vessel on pilotage duty seen from astern',
      'A fishing vessel hauling nets',
      'An air-cushion vessel in non-displacement mode',
    ],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'A power-driven vessel when towing shall exhibit: a sternlight; a towing light in a vertical line above the sternlight.',
    critical: ['towing light', 'above the sternlight'],
    illo: {
      kind: 'lights',
      lights: [
        { c: 'yellow', x: 50, y: 30 },
        { c: 'white', x: 50, y: 48 },
      ],
      caption: 'Night sighting',
    },
  },
  {
    id: 'TOW-009',
    category: 'towing',
    question: 'Where it is impracticable for a vessel or object being towed to exhibit the prescribed lights or shapes, what shall be done?',
    correct: 'All possible measures shall be taken to light the vessel or object towed, or at least to indicate the presence of such vessel or object',
    distractors: [
      'The tow may proceed unlighted if the towing vessel doubles her lights',
      'The tow must anchor until proper lights are fitted',
      'The towing vessel shall sound one prolonged blast every minute',
    ],
    rule: 'Rule 24 — Towing and Pushing',
    ruleText:
      'Where from any sufficient cause it is impracticable for a vessel or object being towed to exhibit the lights or shapes prescribed in paragraph (e) or (g) of this Rule, all possible measures shall be taken to light the vessel or object towed or at least to indicate the presence of such vessel or object.',
    critical: ['impracticable', 'all possible measures', 'indicate the presence'],
  },
  {
    id: 'TOW-010',
    category: 'towing',
    question: 'A vessel engaged in a towing operation that severely restricts the towing vessel and her tow in their ability to deviate from their course shall exhibit, in addition to towing lights:',
    correct: 'The lights or shapes for a vessel restricted in her ability to maneuver (red-white-red / ball-diamond-ball)',
    distractors: [
      'The lights or shapes for a vessel not under command',
      'Three all-round red lights or a cylinder',
      'No additional lights or shapes are authorized',
    ],
    rule: 'Rule 24 / Rule 27',
    ruleText:
      'A vessel engaged in a towing operation such as severely restricts the towing vessel and her tow in their ability to deviate from their course shall, in addition to the lights or shapes prescribed in Rule 24(a), exhibit the lights or shapes prescribed in subparagraphs (b)(i) and (ii) of this Rule.',
    critical: ['severely restricts', 'ability to deviate from their course', 'in addition'],
  },

  // ─────────────────────── DISTRESS SIGNALS ───────────────────────
  {
    id: 'DIS-001',
    category: 'distress',
    question: 'Which of the following is a distress signal under Annex IV?',
    correct: 'A gun or other explosive signal fired at intervals of about a minute',
    distractors: [
      'One prolonged blast sounded every two minutes',
      'Three short blasts repeated continuously',
      'A green star shell fired at short intervals',
    ],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals, used or exhibited either together or separately, indicate distress and need of assistance: a gun or other explosive signal fired at intervals of about a minute.',
    critical: ['gun or other explosive signal', 'intervals of about a minute', 'distress and need of assistance'],
  },
  {
    id: 'DIS-002',
    category: 'distress',
    question: 'You sight this day signal: a square flag with a ball above or below it. What does it indicate?',
    correct: 'Distress and need of assistance',
    distractors: [
      'A vessel engaged in dredging operations',
      'A vessel requesting a pilot',
      'A vessel conducting underwater operations',
    ],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: a signal consisting of a square flag having above or below it a ball or anything resembling a ball.',
    critical: ['square flag', 'above or below it a ball', 'distress'],
    illo: { kind: 'flagball', caption: 'Day signal' },
  },
  {
    id: 'DIS-003',
    category: 'distress',
    question: 'What does this signal indicate: flames on a vessel, as from a burning tar or oil barrel?',
    correct: 'Distress and need of assistance',
    distractors: [
      'A vessel engaged in hot work alongside',
      'A vessel testing pyrotechnics',
      'A fishing vessel attracting fish with light',
    ],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: flames on the vessel (as from a burning tar barrel, oil barrel, etc.).',
    critical: ['flames on the vessel', 'distress and need of assistance'],
    illo: { kind: 'flames', caption: 'Sighted on a vessel' },
  },
  {
    id: 'DIS-004',
    category: 'distress',
    question: 'A rocket parachute flare or a hand flare showing what color indicates distress?',
    correct: 'Red',
    distractors: ['White', 'Green', 'Orange'],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: a rocket parachute flare or a hand flare showing a red light.',
    critical: ['rocket parachute flare', 'hand flare', 'red light'],
    illo: { kind: 'flare', caption: 'Pyrotechnic signal' },
  },
  {
    id: 'DIS-005',
    category: 'distress',
    question: 'The radiotelephone spoken distress signal consists of which word?',
    correct: '"Mayday"',
    distractors: ['"Pan-Pan"', '"Securite"', '"SOS"'],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: a signal sent by radiotelephony consisting of the spoken word "Mayday".',
    critical: ['radiotelephony', 'spoken word "Mayday"'],
  },
  {
    id: 'DIS-006',
    category: 'distress',
    question: 'The distress signal made by radiotelegraphy or any other signaling method consists of which group in the Morse Code?',
    correct: '. . . — — — . . . (SOS)',
    distractors: ['— — — . . . — — — (OSO)', '. — . — . — (AAA)', '— . — . — . (NNN)'],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: a signal made by radiotelegraphy or by any other signalling method consisting of the group · · · — — — · · · (SOS) in the Morse Code.',
    critical: ['SOS', 'Morse Code'],
  },
  {
    id: 'DIS-007',
    category: 'distress',
    question: 'Which arm signal indicates distress and need of assistance?',
    correct: 'Slowly and repeatedly raising and lowering arms outstretched to each side',
    distractors: [
      'Waving one arm in a circular motion overhead',
      'Holding both arms straight up without moving them',
      'Crossing the arms repeatedly above the head',
    ],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: a signal consisting of slowly and repeatedly raising and lowering arms outstretched to each side.',
    critical: ['slowly and repeatedly raising and lowering', 'arms outstretched to each side'],
  },
  {
    id: 'DIS-008',
    category: 'distress',
    question: 'An orange-colored canvas with which markings is a distress signal for identification from the air?',
    correct: 'A black square and circle, or other appropriate symbol',
    distractors: [
      'A white cross and anchor',
      'A red diagonal stripe',
      'Black diagonal stripes',
    ],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: a piece of orange-coloured canvas with either a black square and circle or other appropriate symbol (for identification from the air).',
    critical: ['orange-coloured canvas', 'black square and circle', 'identification from the air'],
  },
  {
    id: 'DIS-009',
    category: 'distress',
    question: 'A smoke signal giving off which color of smoke indicates distress?',
    correct: 'Orange',
    distractors: ['Black', 'White', 'Yellow'],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: a smoke signal giving off orange-coloured smoke.',
    critical: ['smoke signal', 'orange-coloured smoke'],
    illo: { kind: 'smoke', caption: 'Sighted at sea' },
  },
  {
    id: 'DIS-010',
    category: 'distress',
    question: 'The use or exhibition of any of the Annex IV distress signals is prohibited except:',
    correct: 'For the purpose of indicating distress and need of assistance',
    distractors: [
      'During scheduled drills announced by broadcast',
      'When testing equipment in port',
      'When authorized by the senior officer present afloat',
    ],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The use or exhibition of any of the foregoing signals except for the purpose of indicating distress and need of assistance and the use of other signals which may be confused with any of the above signals is prohibited.',
    critical: ['prohibited', 'indicating distress and need of assistance', 'confused with'],
  },
  {
    id: 'DIS-011',
    category: 'distress',
    question: 'What does continuous sounding of any fog-signaling apparatus indicate?',
    correct: 'Distress and need of assistance',
    distractors: [
      'A vessel at anchor in restricted visibility',
      'A vessel aground warning approaching traffic',
      'An intent to overtake in a narrow channel',
    ],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: a continuous sounding with any fog-signalling apparatus.',
    critical: ['continuous sounding', 'fog-signalling apparatus'],
  },
  {
    id: 'DIS-012',
    category: 'distress',
    question: 'Rockets or shells throwing which color of stars, fired one at a time at short intervals, indicate distress?',
    correct: 'Red',
    distractors: ['White', 'Green', 'Blue'],
    rule: 'Annex IV — Distress Signals',
    ruleText:
      'The following signals indicate distress and need of assistance: rockets or shells, throwing red stars fired one at a time at short intervals.',
    critical: ['red stars', 'one at a time at short intervals'],
    illo: { kind: 'flare', caption: 'Pyrotechnic signal' },
  },

  // ─────────────────────── SOUND SIGNALS ───────────────────────
  {
    id: 'SND-001',
    category: 'sound',
    question: 'The term "short blast" means a blast of about how long?',
    correct: 'One second',
    distractors: ['Two seconds', 'Four seconds', 'Half a second'],
    rule: 'Rule 32 — Definitions',
    ruleText:
      'The term "short blast" means a blast of about one second\'s duration. The term "prolonged blast" means a blast of from four to six seconds\' duration.',
    critical: ["about one second's duration", "four to six seconds' duration"],
  },
  {
    id: 'SND-002',
    category: 'sound',
    question: 'When vessels are in sight of one another, a power-driven vessel underway altering her course to starboard shall indicate that maneuver by:',
    correct: 'One short blast',
    distractors: ['Two short blasts', 'Three short blasts', 'One prolonged blast'],
    rule: 'Rule 34 — Maneuvering and Warning Signals',
    ruleText:
      'When vessels are in sight of one another, a power-driven vessel underway, when manoeuvring as authorized or required by these Rules, shall indicate that manoeuvre by the following signals on her whistle: one short blast to mean "I am altering my course to starboard".',
    critical: ['in sight of one another', 'one short blast', 'altering my course to starboard'],
  },
  {
    id: 'SND-003',
    category: 'sound',
    question: 'Three short blasts on the whistle by a power-driven vessel in sight of another means:',
    correct: '"I am operating astern propulsion"',
    distractors: [
      '"I am altering my course to port"',
      '"I intend to overtake you on your starboard side"',
      '"I am in doubt as to your intentions"',
    ],
    rule: 'Rule 34 — Maneuvering and Warning Signals',
    ruleText:
      'Three short blasts to mean "I am operating astern propulsion".',
    critical: ['three short blasts', 'operating astern propulsion'],
  },
  {
    id: 'SND-004',
    category: 'sound',
    question: 'When vessels in sight of one another are approaching each other and either vessel fails to understand the intentions or actions of the other, the vessel in doubt shall sound:',
    correct: 'At least five short and rapid blasts',
    distractors: [
      'Three prolonged blasts',
      'One prolonged followed by two short blasts',
      'Two prolonged blasts repeated until answered',
    ],
    rule: 'Rule 34(d) — Danger Signal',
    ruleText:
      'When vessels in sight of one another are approaching each other and from any cause either vessel fails to understand the intentions or actions of the other, or is in doubt whether sufficient action is being taken by the other to avoid collision, the vessel in doubt shall immediately indicate such doubt by giving at least five short and rapid blasts on the whistle.',
    critical: ['fails to understand', 'in doubt', 'at least five short and rapid blasts'],
  },
  {
    id: 'SND-005',
    category: 'sound',
    question: 'A power-driven vessel making way through the water in restricted visibility shall sound, at intervals of not more than 2 minutes:',
    correct: 'One prolonged blast',
    distractors: [
      'Two prolonged blasts in succession',
      'One prolonged followed by two short blasts',
      'Three short blasts',
    ],
    rule: 'Rule 35 — Sound Signals in Restricted Visibility',
    ruleText:
      'A power-driven vessel making way through the water shall sound at intervals of not more than 2 minutes one prolonged blast.',
    critical: ['making way through the water', 'not more than 2 minutes', 'one prolonged blast'],
  },
  {
    id: 'SND-006',
    category: 'sound',
    question: 'A power-driven vessel underway but stopped and making no way through the water in restricted visibility shall sound, at intervals of not more than 2 minutes:',
    correct: 'Two prolonged blasts in succession with an interval of about 2 seconds between them',
    distractors: [
      'One prolonged blast',
      'One prolonged followed by two short blasts',
      'Rapid ringing of the bell for about 5 seconds',
    ],
    rule: 'Rule 35 — Sound Signals in Restricted Visibility',
    ruleText:
      'A power-driven vessel underway but stopped and making no way through the water shall sound at intervals of not more than 2 minutes two prolonged blasts in succession with an interval of about 2 seconds between them.',
    critical: ['stopped and making no way', 'two prolonged blasts', 'about 2 seconds between them'],
  },
  {
    id: 'SND-007',
    category: 'sound',
    question: 'In restricted visibility, which signal is sounded by a vessel not under command, a vessel restricted in her ability to maneuver, a sailing vessel, or a vessel engaged in fishing?',
    correct: 'One prolonged followed by two short blasts, at intervals of not more than 2 minutes',
    distractors: [
      'One prolonged blast at intervals of not more than 1 minute',
      'Two prolonged followed by one short blast every 2 minutes',
      'Four short blasts at intervals of not more than 2 minutes',
    ],
    rule: 'Rule 35 — Sound Signals in Restricted Visibility',
    ruleText:
      'A vessel not under command, a vessel restricted in her ability to manoeuvre, a vessel constrained by her draught, a sailing vessel, a vessel engaged in fishing and a vessel engaged in towing or pushing another vessel shall, instead of the signals prescribed in paragraphs (a) or (b) of this Rule, sound at intervals of not more than 2 minutes three blasts in succession, namely one prolonged followed by two short blasts.',
    critical: ['one prolonged followed by two short blasts', 'not more than 2 minutes'],
  },
  {
    id: 'SND-008',
    category: 'sound',
    question: 'A vessel at anchor in restricted visibility shall, at intervals of not more than 1 minute:',
    correct: 'Ring the bell rapidly for about 5 seconds',
    distractors: [
      'Sound one prolonged blast',
      'Sound one short, one prolonged, and one short blast',
      'Ring the bell and gong simultaneously for 10 seconds',
    ],
    rule: 'Rule 35 — Sound Signals in Restricted Visibility',
    ruleText:
      'A vessel at anchor shall at intervals of not more than 1 minute ring the bell rapidly for about 5 seconds. In a vessel of 100 metres or more in length the bell shall be sounded in the forepart of the vessel and immediately after the ringing of the bell the gong shall be sounded rapidly for about 5 seconds in the after part of the vessel.',
    critical: ['at anchor', 'not more than 1 minute', 'ring the bell rapidly for about 5 seconds', 'gong'],
  },
  {
    id: 'SND-009',
    category: 'sound',
    question: 'In a narrow channel, a vessel intending to overtake another on the other vessel\'s starboard side shall sound:',
    correct: 'Two prolonged blasts followed by one short blast',
    distractors: [
      'Two prolonged blasts followed by two short blasts',
      'One prolonged blast followed by one short blast',
      'One short blast only',
    ],
    rule: 'Rule 34(c) — Overtaking in a Narrow Channel',
    ruleText:
      'When in sight of one another in a narrow channel or fairway: a vessel intending to overtake another shall in compliance with Rule 9(e)(i) indicate her intention by the following signals on her whistle: two prolonged blasts followed by one short blast to mean "I intend to overtake you on your starboard side"; two prolonged blasts followed by two short blasts to mean "I intend to overtake you on your port side".',
    critical: ['two prolonged blasts followed by one short blast', 'overtake you on your starboard side'],
  },
  {
    id: 'SND-010',
    category: 'sound',
    question: 'A vessel nearing a bend or an area of a channel where other vessels may be obscured by an intervening obstruction shall sound:',
    correct: 'One prolonged blast',
    distractors: [
      'Five short and rapid blasts',
      'Two short blasts',
      'One prolonged followed by two short blasts',
    ],
    rule: 'Rule 34(e) — Bend Signal',
    ruleText:
      'A vessel nearing a bend or an area of a channel or fairway where other vessels may be obscured by an intervening obstruction shall sound one prolonged blast. Such signal shall be answered with a prolonged blast by any approaching vessel that may be within hearing around the bend or behind the intervening obstruction.',
    critical: ['nearing a bend', 'obscured by an intervening obstruction', 'one prolonged blast', 'answered with a prolonged blast'],
  },
  {
    id: 'SND-011',
    category: 'sound',
    question: 'A vessel of 12 meters or more but less than 20 meters in length shall be provided with which sound signaling appliances?',
    correct: 'A whistle',
    distractors: [
      'A whistle and a bell',
      'A whistle, a bell, and a gong',
      'A bell only',
    ],
    rule: 'Rule 33 — Equipment for Sound Signals',
    ruleText:
      'A vessel of 12 metres or more in length shall be provided with a whistle, a vessel of 20 metres or more in length shall be provided with a bell in addition to a whistle, and a vessel of 100 metres or more in length shall, in addition, be provided with a gong.',
    critical: ['12 metres or more', 'whistle', '20 metres or more', 'bell', '100 metres or more', 'gong'],
  },
  {
    id: 'SND-012',
    category: 'sound',
    question: 'Under the Inland Rules, two short blasts from a power-driven vessel signal:',
    correct: '"I intend to leave you on my starboard side"',
    distractors: [
      '"I am altering my course to port"',
      '"I am operating astern propulsion"',
      '"I intend to leave you on my port side"',
    ],
    rule: 'Inland Rule 34 — Maneuvering Signals',
    ruleText:
      'When power-driven vessels are in sight of one another and meeting or crossing at a distance within half a mile of each other, each vessel underway, when manoeuvring as authorized or required by these Rules, shall indicate that manoeuvre by the following signals on her whistle: two short blasts to mean "I intend to leave you on my starboard side".',
    critical: ['two short blasts', 'leave you on my starboard side'],
  },

  // ───────────────────────── ANNEXES ─────────────────────────
  {
    id: 'ANX-001',
    category: 'annexes',
    question: 'Per Annex I, the forward masthead light of a power-driven vessel of 20 meters or more in length shall be placed at a height above the hull of:',
    correct: 'Not less than 6 meters',
    distractors: ['Not less than 2.5 meters', 'Not less than 12 meters', 'Not less than 4 meters'],
    rule: 'Annex I — Positioning of Lights',
    ruleText:
      'On a power-driven vessel of 20 metres or more in length the masthead lights shall be placed as follows: the forward masthead light, or if only one masthead light is carried, then that light, at a height above the hull of not less than 6 metres, and, if the breadth of the vessel exceeds 6 metres, then at a height above the hull not less than such breadth, so however that the light need not be placed at a greater height above the hull than 12 metres.',
    critical: ['not less than 6 metres', 'need not be placed at a greater height', '12 metres'],
  },
  {
    id: 'ANX-002',
    category: 'annexes',
    question: 'Per Annex I, when two masthead lights are carried, the after one shall be at least how much higher than the forward one (vessels of 20 m or more)?',
    correct: '4.5 meters vertically higher',
    distractors: ['2 meters vertically higher', '6 meters vertically higher', '1 meter vertically higher'],
    rule: 'Annex I — Positioning of Lights',
    ruleText:
      'When two masthead lights are prescribed for a power-driven vessel, the vertical distance between them shall be such that in all normal conditions of trim the after light shall be seen over and separate from the forward light at a distance of 1000 metres from the stem when viewed from sea level. On a power-driven vessel of 20 metres or more in length the after masthead light shall be at least 4.5 metres vertically higher than the forward one.',
    critical: ['4.5 metres vertically higher', 'seen over and separate', '1000 metres'],
  },
  {
    id: 'ANX-003',
    category: 'annexes',
    question: 'Per Annex I, what is the color specification requirement for navigation lights?',
    correct: 'The chromaticity of all navigation lights shall conform to standards within the boundaries of the area of the diagram specified for each color by the International Commission on Illumination (CIE)',
    distractors: [
      'Colors are left to the discretion of the flag administration',
      'Lights must match the nearest paint standard of the vessel\'s registry',
      'Only red and green lights have chromaticity standards',
    ],
    rule: 'Annex I — Color Specification of Lights',
    ruleText:
      'The chromaticity of all navigation lights shall conform to the following standards, which lie within the boundaries of the area of the diagram specified for each colour by the International Commission on Illumination (CIE).',
    critical: ['chromaticity', 'International Commission on Illumination (CIE)'],
  },
  {
    id: 'ANX-004',
    category: 'annexes',
    question: 'Per Annex I, a ball as a day shape shall have a diameter of not less than:',
    correct: '0.6 meter',
    distractors: ['0.3 meter', '1.0 meter', '1.5 meters'],
    rule: 'Annex I — Shapes',
    ruleText:
      'Shapes shall be black and of the following sizes: a ball shall have a diameter of not less than 0.6 metre; a cone shall have a base diameter of not less than 0.6 metre and a height equal to its diameter; a diamond shape shall consist of two cones having a common base.',
    critical: ['black', 'diameter of not less than 0.6 metre', 'two cones having a common base'],
  },
  {
    id: 'ANX-005',
    category: 'annexes',
    question: 'Per Annex II, a vessel engaged in trawling with purse seine gear hampered by its gear may exhibit:',
    correct: 'Two yellow lights in a vertical line flashing alternately every second',
    distractors: [
      'Two red lights in a vertical line flashing together',
      'A single blue flashing light',
      'White over white all-round lights',
    ],
    rule: 'Annex II — Additional Signals for Fishing Vessels',
    ruleText:
      'Vessels engaged in fishing with purse seine gear may exhibit two yellow lights in a vertical line. These lights shall flash alternately every second and with equal light and occultation duration. These lights may be exhibited only when the vessel is hampered by its fishing gear.',
    critical: ['purse seine gear', 'two yellow lights', 'flash alternately every second', 'hampered by its fishing gear'],
  },
  {
    id: 'ANX-006',
    category: 'annexes',
    question: 'Per Annex II, a vessel engaged in trawling, when shooting her nets, may exhibit:',
    correct: 'Two white lights in a vertical line',
    distractors: [
      'One white light over one red light',
      'Two red lights in a vertical line',
      'One red light over one white light',
    ],
    rule: 'Annex II — Signals for Trawlers',
    ruleText:
      'Vessels of 20 metres or more in length engaged in trawling, whether using demersal or pelagic gear, shall exhibit: when shooting their nets: two white lights in a vertical line; when hauling their nets: one white light over one red light in a vertical line; when the net has come fast upon an obstruction: two red lights in a vertical line.',
    critical: ['shooting their nets', 'two white lights', 'hauling their nets', 'one white light over one red light', 'come fast upon an obstruction', 'two red lights'],
  },
  {
    id: 'ANX-007',
    category: 'annexes',
    question: 'Per Annex III, a whistle on a vessel of 200 meters or more in length shall have a fundamental frequency between:',
    correct: '70 and 200 Hz',
    distractors: ['250 and 700 Hz', '130 and 350 Hz', '20 and 50 Hz'],
    rule: 'Annex III — Technical Details of Sound Signal Appliances',
    ruleText:
      'The fundamental frequency of the signal shall lie within the range 70-700 Hz. The frequency range shall be 70-200 Hz, for a vessel 200 metres or more in length.',
    critical: ['70-200 Hz', '200 metres or more in length'],
  },
  {
    id: 'ANX-008',
    category: 'annexes',
    question: 'Per Annex III, the bell or gong shall produce a sound pressure level of not less than how many decibels at 1 meter?',
    correct: '110 dB',
    distractors: ['90 dB', '120 dB', '100 dB'],
    rule: 'Annex III — Bell or Gong',
    ruleText:
      'A bell or gong, or other device having similar sound characteristics shall produce a sound pressure level of not less than 110 dB at a distance of 1 metre from it.',
    critical: ['110 dB', '1 metre'],
  },
  {
    id: 'ANX-009',
    category: 'annexes',
    question: 'Per Annex I, the minimum luminous range of a masthead light on a vessel of 50 meters or more in length is:',
    correct: '6 miles',
    distractors: ['3 miles', '5 miles', '2 miles'],
    rule: 'Annex I / Rule 22 — Visibility of Lights',
    ruleText:
      'The lights prescribed in these Rules shall have an intensity as specified in Section 8 of Annex I so as to be visible at the following minimum ranges: in vessels of 50 metres or more in length: a masthead light, 6 miles; a sidelight, 3 miles; a sternlight, 3 miles; a towing light, 3 miles.',
    critical: ['50 metres or more', 'masthead light, 6 miles', 'sidelight, 3 miles'],
  },
  {
    id: 'ANX-010',
    category: 'annexes',
    question: 'Per Annex I, the diameter of the mouth of the bell on a vessel of 20 meters or more in length shall be not less than:',
    correct: '300 mm',
    distractors: ['200 mm', '500 mm', '150 mm'],
    rule: 'Annex III — Bell or Gong',
    ruleText:
      'The diameter of the mouth of the bell shall be not less than 300 mm for vessels of 20 metres or more in length.',
    critical: ['300 mm', '20 metres or more'],
  },
  {
    id: 'ANX-011',
    category: 'annexes',
    question: 'Per Annex I, sidelights on vessels of 20 meters or more in length shall be fitted with:',
    correct: 'Inboard screens painted matt black',
    distractors: [
      'Polished metal reflectors',
      'White-painted inboard screens',
      'No screens — sidelights must be visible across the bow',
    ],
    rule: 'Annex I — Screens for Sidelights',
    ruleText:
      'The sidelights of vessels of 20 metres or more in length shall be fitted with inboard screens painted matt black, and meeting the requirements of Section 9 of this Annex.',
    critical: ['inboard screens', 'matt black'],
  },
  {
    id: 'ANX-012',
    category: 'annexes',
    question: 'Per Annex II, the additional fishing vessel signals apply to vessels engaged in fishing in close proximity to:',
    correct: 'Other vessels engaged in fishing',
    distractors: [
      'A traffic separation scheme',
      'Naval formations',
      'Shoal water or navigational hazards',
    ],
    rule: 'Annex II — General',
    ruleText:
      'The lights mentioned herein shall, if exhibited in pursuance of Rule 26(d), be placed where they can best be seen. They shall be at least 0.9 metre apart but at a lower level than lights prescribed in Rule 26(b)(i) and (c)(i). The lights shall be visible all round the horizon at a distance of at least 1 mile but at a lesser distance than the lights prescribed by these Rules for fishing vessels. These signals apply to vessels engaged in fishing in close proximity to other vessels engaged in fishing.',
    critical: ['close proximity', 'other vessels engaged in fishing'],
  },
]

export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]))

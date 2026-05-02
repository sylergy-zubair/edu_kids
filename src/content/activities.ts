/**
 * Activity specs for daily path (PRD Phase 2 templates).
 */

export type VisualToken = {
  id: string;
  emoji?: string;
  colorHex?: string;
  shape?: import('./contentMap').ShapeName;
};

export type ActivitySpec =
  | {
      id: string;
      kind: 'tap';
      instruction: string;
      choices: VisualToken[];
      answerId: string;
    }
  | {
      id: string;
      kind: 'match';
      instruction: string;
      target: VisualToken;
      choices: VisualToken[];
      answerId: string;
    }
  | {
      id: string;
      kind: 'matchSound';
      instruction: string;
      /** Exact TTS line */
      spokenWord: string;
      choices: VisualToken[];
      answerId: string;
    }
  | {
      id: string;
      kind: 'count';
      instruction: string;
      count: number;
      pileEmoji: string;
      /** number keys 1-5 include answer */
      answerValue: number;
    }
  | {
      id: string;
      kind: 'findFeature';
      feature: 'color' | 'shape';
      instruction: string;
      choices: VisualToken[];
      answerId: string;
    }
  | {
      id: string;
      kind: 'drag';
      instruction: string;
      /** draggable token */
      item: VisualToken;
      /** drop zone label for visuals only */
      zoneLabel: string;
    }
  | {
      id: string;
      kind: 'routine';
      routineId: string;
      instruction: string;
    };

import {
  COLORS,
  ROUTINES,
  SHAPES,
  type ShapeName,
} from './contentMap';

const byId = <T extends { id: string }>(arr: T[], id: string) =>
  arr.find((x) => x.id === id)!;

/** PRD 2.5 — find color (oversized tokens, mixed distractor shapes). */
function findColorActivity(id: string, colorId: string): ActivitySpec {
  const c = byId(COLORS, colorId);
  const others = shuffle(COLORS.filter((x) => x.id !== colorId)).slice(0, 3);
  const shapeMix: ShapeName[] = ['square', 'triangle', 'star'];
  const choices: VisualToken[] = [
    { id: 'ans', colorHex: c.hex, shape: 'circle' },
    ...others.map((o, i) => ({
      id: `d${i}`,
      colorHex: o.hex,
      shape: shapeMix[i % shapeMix.length]!,
    })),
  ];
  return {
    id,
    kind: 'findFeature',
    feature: 'color',
    instruction: `Touch the ${c.promptWord} one.`,
    choices: shuffle(choices),
    answerId: 'ans',
  };
}

/** PRD 2.5 — find shape (distinct colors per option). */
function findShapeActivity(id: string, targetShape: ShapeName): ActivitySpec {
  const s = SHAPES.find((sh) => sh.shape === targetShape)!;
  const others = shuffle(SHAPES.filter((sh) => sh.shape !== targetShape)).slice(
    0,
    3,
  );
  const hues = [
    '#FFD93D',
    '#9B7EDE',
    '#FF6B9D',
    '#3CB371',
    '#E84A4A',
    '#3D7AFC',
  ];
  const choices: VisualToken[] = [
    { id: 'ans', colorHex: hues[0]!, shape: targetShape },
    ...others.map((sh, i) => ({
      id: `d${i}`,
      colorHex: hues[(i + 1) % hues.length]!,
      shape: sh.shape,
    })),
  ];
  return {
    id,
    kind: 'findFeature',
    feature: 'shape',
    instruction: `Touch the ${s.spoken}.`,
    choices: shuffle(choices),
    answerId: 'ans',
  };
}

function tapFromColorShape(
  id: string,
  colorId: string,
  shape: import('./contentMap').ShapeName,
  distractors: VisualToken[],
): ActivitySpec {
  const c = byId(COLORS, colorId);
  const s = SHAPES.find((sh) => sh.shape === shape)!;
  const target: VisualToken = {
    id: 'target',
    colorHex: c.hex,
    shape: s.shape,
  };
  const choices = [target, ...distractors];
  return {
    id,
    kind: 'tap',
    instruction: `Touch the ${c.promptWord} ${s.spoken}.`,
    choices: shuffle(choices),
    answerId: target.id,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Functional activities (PRD Phase 2). Daily path includes the full ordered set
 * so every template appears in “Play today” without shifting earlier indices.
 */
export const ALL_ACTIVITIES: ActivitySpec[] = [
  tapFromColorShape(
    'tap_red_circle',
    'red',
    'circle',
    [
      { id: 'd1', colorHex: byId(COLORS, 'blue').hex, shape: 'circle' },
      { id: 'd2', colorHex: byId(COLORS, 'red').hex, shape: 'square' },
      { id: 'd3', colorHex: byId(COLORS, 'yellow').hex, shape: 'triangle' },
    ],
  ),
  tapFromColorShape(
    'tap_blue_square',
    'blue',
    'square',
    [
      { id: 'd1', colorHex: byId(COLORS, 'green').hex, shape: 'square' },
      { id: 'd2', colorHex: byId(COLORS, 'blue').hex, shape: 'circle' },
      { id: 'd3', colorHex: byId(COLORS, 'purple').hex, shape: 'star' },
    ],
  ),
  {
    id: 'match_cat',
    kind: 'match',
    instruction: 'Pick the same animal.',
    target: { id: 't', emoji: '🐱' },
    choices: shuffle([
      { id: 'a', emoji: '🐱' },
      { id: 'b', emoji: '🐶' },
      { id: 'c', emoji: '🐦' },
      { id: 'd', emoji: '🐟' },
    ]),
    answerId: 'a',
  },
  {
    id: 'sound_dog',
    kind: 'matchSound',
    instruction: 'Touch the picture that matches.',
    spokenWord: 'dog',
    choices: shuffle([
      { id: 'a', emoji: '🐶' },
      { id: 'b', emoji: '🐱' },
      { id: 'c', emoji: '🐻' },
      { id: 'd', emoji: '🐸' },
    ]),
    answerId: 'a',
  },
  {
    id: 'count_three',
    kind: 'count',
    instruction: 'How many apples?',
    count: 3,
    pileEmoji: '🍎',
    answerValue: 3,
  },
  findColorActivity('find_green', 'green'),
  findShapeActivity('find_triangle', 'triangle'),
  tapFromColorShape(
    'tap_yellow_star',
    'yellow',
    'star',
    [
      { id: 'd1', colorHex: byId(COLORS, 'orange').hex, shape: 'star' },
      { id: 'd2', colorHex: byId(COLORS, 'yellow').hex, shape: 'heart' },
      { id: 'd3', colorHex: byId(COLORS, 'purple').hex, shape: 'star' },
    ],
  ),
  {
    id: 'match_cow',
    kind: 'match',
    instruction: 'Find the matching cow.',
    target: { id: 't', emoji: '🐮' },
    choices: shuffle([
      { id: 'a', emoji: '🐮' },
      { id: 'b', emoji: '🐰' },
      { id: 'c', emoji: '🐸' },
    ]),
    answerId: 'a',
  },
  {
    id: 'sound_bird',
    kind: 'matchSound',
    instruction: 'Listen, then touch.',
    spokenWord: 'bird',
    choices: shuffle([
      { id: 'a', emoji: '🐦' },
      { id: 'b', emoji: '🐟' },
      { id: 'c', emoji: '🐶' },
      { id: 'd', emoji: '🐱' },
    ]),
    answerId: 'a',
  },
  {
    id: 'count_five',
    kind: 'count',
    instruction: 'Count the stars.',
    count: 5,
    pileEmoji: '⭐',
    answerValue: 5,
  },
  {
    id: 'drag_ball_box',
    kind: 'drag',
    instruction: 'Drag the ball into the toy box.',
    item: { id: 'ball', emoji: '⚽' },
    zoneLabel: 'Toy box',
  },
  {
    id: 'drag_star_basket',
    kind: 'drag',
    instruction: 'Drag the star into the basket.',
    item: { id: 'star', emoji: '⭐' },
    zoneLabel: 'Basket',
  },
  {
    id: 'routine_hands',
    kind: 'routine',
    routineId: ROUTINES[0].id,
    instruction: 'Let’s wash hands together!',
  },
  tapFromColorShape(
    'tap_purple_circle',
    'purple',
    'circle',
    [
      { id: 'd1', colorHex: byId(COLORS, 'orange').hex, shape: 'circle' },
      { id: 'd2', colorHex: byId(COLORS, 'purple').hex, shape: 'square' },
      { id: 'd3', colorHex: byId(COLORS, 'green').hex, shape: 'circle' },
    ],
  ),
  {
    id: 'count_two',
    kind: 'count',
    instruction: 'How many ducks?',
    count: 2,
    pileEmoji: '🦆',
    answerValue: 2,
  },
  {
    id: 'sound_fish',
    kind: 'matchSound',
    instruction: 'Listen, then touch.',
    spokenWord: 'fish',
    choices: shuffle([
      { id: 'a', emoji: '🐟' },
      { id: 'b', emoji: '🐦' },
      { id: 'c', emoji: '🐸' },
      { id: 'd', emoji: '🐶' },
    ]),
    answerId: 'a',
  },
  tapFromColorShape(
    'tap_orange_square',
    'orange',
    'square',
    [
      { id: 'd1', colorHex: byId(COLORS, 'orange').hex, shape: 'triangle' },
      { id: 'd2', colorHex: byId(COLORS, 'red').hex, shape: 'square' },
      { id: 'd3', colorHex: byId(COLORS, 'yellow').hex, shape: 'square' },
    ],
  ),
  /** Extra rotations for variety */
  {
    id: 'match_bear',
    kind: 'match',
    instruction: 'Pick the same bear.',
    target: { id: 't', emoji: '🐻' },
    choices: shuffle([
      { id: 'a', emoji: '🐻' },
      { id: 'b', emoji: '🐮' },
      { id: 'c', emoji: '🐱' },
    ]),
    answerId: 'a',
  },
  {
    id: 'count_four',
    kind: 'count',
    instruction: 'How many balls?',
    count: 4,
    pileEmoji: '⚽',
    answerValue: 4,
  },
  /** PRD 2.3 — fourth match-sound variation */
  {
    id: 'sound_cat',
    kind: 'matchSound',
    instruction: 'Listen, then touch.',
    spokenWord: 'cat',
    choices: shuffle([
      { id: 'a', emoji: '🐱' },
      { id: 'b', emoji: '🐶' },
      { id: 'c', emoji: '🐻' },
      { id: 'd', emoji: '🐮' },
    ]),
    answerId: 'a',
  },
  /** PRD 2.4 — fifth counting variation (1–5) */
  {
    id: 'count_one',
    kind: 'count',
    instruction: 'How many moons?',
    count: 1,
    pileEmoji: '🌙',
    answerValue: 1,
  },
  /** PRD 2.5 — four more color finds (with find_green → five total) */
  findColorActivity('find_red', 'red'),
  findColorActivity('find_blue', 'blue'),
  findColorActivity('find_yellow', 'yellow'),
  findColorActivity('find_purple', 'purple'),
  /** PRD 2.5 — four more shape finds (with find_triangle → five total) */
  findShapeActivity('find_circle', 'circle'),
  findShapeActivity('find_square', 'square'),
  findShapeActivity('find_star', 'star'),
  findShapeActivity('find_heart', 'heart'),
  /** PRD 2.6 — third drag variation */
  {
    id: 'drag_apple_bowl',
    kind: 'drag',
    instruction: 'Drag the apple into the bowl.',
    item: { id: 'apple', emoji: '🍎' },
    zoneLabel: 'Bowl',
  },
  /** PRD 2.7 — additional routine mini-games */
  {
    id: 'routine_brush',
    kind: 'routine',
    routineId: 'brush_teeth',
    instruction: 'Time to brush teeth!',
  },
  {
    id: 'routine_clean',
    kind: 'routine',
    routineId: 'clean_toys',
    instruction: 'Let’s clean up toys!',
  },
];

export const DAILY_ACTIVITIES = ALL_ACTIVITIES;

export function getActivityById(id: string): ActivitySpec | undefined {
  return ALL_ACTIVITIES.find((a) => a.id === id);
}

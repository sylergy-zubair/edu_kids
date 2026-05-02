/**
 * Activity specs for daily path + free play (PRD Phase 2 templates).
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

import { ANIMALS, COLORS, ROUTINES, SHAPES } from './contentMap';

const byId = <T extends { id: string }>(arr: T[], id: string) =>
  arr.find((x) => x.id === id)!;

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

/** Random order for free-play mode */
export function shuffledCopy<T>(array: T[]): T[] {
  return shuffle([...array]);
}

/** 20 functional activities — PRD 3.4 asks for 15+ in path; daily uses first 18 */
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
  {
    id: 'find_green',
    kind: 'findFeature',
    feature: 'color',
    instruction: 'Touch the green one.',
    choices: shuffle([
      { id: 'g', colorHex: byId(COLORS, 'green').hex, shape: 'circle' },
      { id: 'x1', colorHex: byId(COLORS, 'red').hex, shape: 'circle' },
      { id: 'x2', colorHex: byId(COLORS, 'blue').hex, shape: 'square' },
      { id: 'x3', colorHex: byId(COLORS, 'yellow').hex, shape: 'triangle' },
    ]),
    answerId: 'g',
  },
  {
    id: 'find_triangle',
    kind: 'findFeature',
    feature: 'shape',
    instruction: 'Touch the triangle.',
    choices: shuffle([
      { id: 'tr', colorHex: '#FFD93D', shape: 'triangle' },
      { id: 'c1', colorHex: '#9B7EDE', shape: 'circle' },
      { id: 's1', colorHex: '#FF6B9D', shape: 'square' },
      { id: 'st', colorHex: '#3CB371', shape: 'star' },
    ]),
    answerId: 'tr',
  },
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
  /** Extra rotations for free play / variety */
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
];

export const DAILY_ACTIVITIES = ALL_ACTIVITIES.slice(0, 18);

export function getActivityById(id: string): ActivitySpec | undefined {
  return ALL_ACTIVITIES.find((a) => a.id === id);
}

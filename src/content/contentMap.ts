/**
 * PRD Issue 0.1 — structured content: labels, spoken prompts, visual hints.
 * All prompts are English, short, and listenable (no reading required).
 */

export type ShapeName = 'circle' | 'square' | 'triangle' | 'star' | 'heart';

export interface ColorConcept {
  id: string;
  displayLabel: string;
  /** Spoken to the child */
  promptWord: string;
  hex: string;
}

export interface NumberConcept {
  value: number;
  displayLabel: string;
  spoken: string;
}

export interface ShapeConcept {
  id: string;
  displayLabel: string;
  spoken: string;
  /** How we draw it in simple Views */
  shape: ShapeName;
}

export interface AnimalConcept {
  id: string;
  displayLabel: string;
  /** Spoken name */
  spoken: string;
  emoji: string;
}

export interface RoutineConcept {
  id: string;
  title: string;
  steps: { id: string; emoji: string; shortPrompt: string; spoken: string }[];
}

export const COLORS: ColorConcept[] = [
  { id: 'red', displayLabel: 'Red', promptWord: 'red', hex: '#E84A4A' },
  { id: 'blue', displayLabel: 'Blue', promptWord: 'blue', hex: '#3D7AFC' },
  { id: 'green', displayLabel: 'Green', promptWord: 'green', hex: '#3CB371' },
  { id: 'yellow', displayLabel: 'Yellow', promptWord: 'yellow', hex: '#FFD93D' },
  { id: 'purple', displayLabel: 'Purple', promptWord: 'purple', hex: '#9B7EDE' },
  { id: 'orange', displayLabel: 'Orange', promptWord: 'orange', hex: '#FF9F43' },
];

export const NUMBERS: NumberConcept[] = [1, 2, 3, 4, 5].map((n) => ({
  value: n,
  displayLabel: String(n),
  spoken: n === 1 ? 'one' : n === 2 ? 'two' : n === 3 ? 'three' : n === 4 ? 'four' : 'five',
}));

export const SHAPES: ShapeConcept[] = [
  { id: 'circle', displayLabel: 'Circle', spoken: 'circle', shape: 'circle' },
  { id: 'square', displayLabel: 'Square', spoken: 'square', shape: 'square' },
  { id: 'triangle', displayLabel: 'Triangle', spoken: 'triangle', shape: 'triangle' },
  { id: 'star', displayLabel: 'Star', spoken: 'star', shape: 'star' },
  { id: 'heart', displayLabel: 'Heart', spoken: 'heart', shape: 'heart' },
];

export const ANIMALS: AnimalConcept[] = [
  { id: 'cat', displayLabel: 'Cat', spoken: 'cat', emoji: '🐱' },
  { id: 'dog', displayLabel: 'Dog', spoken: 'dog', emoji: '🐶' },
  { id: 'bird', displayLabel: 'Bird', spoken: 'bird', emoji: '🐦' },
  { id: 'fish', displayLabel: 'Fish', spoken: 'fish', emoji: '🐟' },
  { id: 'cow', displayLabel: 'Cow', spoken: 'cow', emoji: '🐮' },
  { id: 'bunny', displayLabel: 'Bunny', spoken: 'bunny', emoji: '🐰' },
  { id: 'bear', displayLabel: 'Bear', spoken: 'bear', emoji: '🐻' },
  { id: 'frog', displayLabel: 'Frog', spoken: 'frog', emoji: '🐸' },
];

export const ROUTINES: RoutineConcept[] = [
  {
    id: 'wash_hands',
    title: 'Wash hands',
    steps: [
      {
        id: 'water',
        emoji: '💧',
        shortPrompt: 'Water',
        spoken: 'Turn on the water.',
      },
      {
        id: 'soap',
        emoji: '🧼',
        shortPrompt: 'Soap',
        spoken: 'Add soap.',
      },
      {
        id: 'dry',
        emoji: '🧻',
        shortPrompt: 'Dry',
        spoken: 'Dry your hands.',
      },
    ],
  },
  {
    id: 'brush_teeth',
    title: 'Brush teeth',
    steps: [
      {
        id: 'paste',
        emoji: '🪥',
        shortPrompt: 'Brush',
        spoken: 'Brush gently.',
      },
      {
        id: 'rinse',
        emoji: '💦',
        shortPrompt: 'Rinse',
        spoken: 'Rinse your mouth.',
      },
      {
        id: 'smile',
        emoji: '😊',
        shortPrompt: 'Smile',
        spoken: 'Big smile!',
      },
    ],
  },
  {
    id: 'clean_toys',
    title: 'Clean up toys',
    steps: [
      {
        id: 'pick',
        emoji: '🧸',
        shortPrompt: 'Pick up',
        spoken: 'Pick up a toy.',
      },
      {
        id: 'box',
        emoji: '📦',
        shortPrompt: 'Into box',
        spoken: 'Put it in the toy box.',
      },
      {
        id: 'wave',
        emoji: '👋',
        shortPrompt: 'All done',
        spoken: 'All clean!',
      },
    ],
  },
];

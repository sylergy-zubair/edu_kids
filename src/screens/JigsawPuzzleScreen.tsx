import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { speak, stopSpeak } from '../services/tts';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'JigsawPuzzle'>;

type PieceDef = {
  color: string;
  light: string;
  emoji: string;
};

const PIECE_DEFS: PieceDef[] = [
  { color: '#E91E8C', light: '#FF8BC4', emoji: '⭐' },
  { color: '#FF9800', light: '#FFE082', emoji: '🌟' },
  { color: '#00C853', light: '#B9F6CA', emoji: '✨' },
  { color: '#7C4DFF', light: '#D1C4E9', emoji: '💫' },
];

type SlotRect = { x: number; y: number; w: number; h: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function randomUnsolvedOrder(): number[] {
  let order = [0, 1, 2, 3];
  do {
    order = shuffle(order);
  } while (order.every((id, i) => id === i));
  return order;
}

function isSolved(order: number[]): boolean {
  return order.every((id, i) => id === i);
}

function findSlotAt(
  px: number,
  py: number,
  rects: (SlotRect | null)[],
  pad: number,
): number | null {
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (!r) {
      continue;
    }
    if (
      px >= r.x - pad &&
      px <= r.x + r.w + pad &&
      py >= r.y - pad &&
      py <= r.y + r.h + pad
    ) {
      return i;
    }
  }
  return null;
}

/** Knob positions follow the piece's *home* slot so shapes stay consistent while dragging. */
function PuzzlePiece({
  color,
  light,
  emoji,
  size,
  homeIndex,
  lifted,
}: {
  color: string;
  light: string;
  emoji: string;
  size: number;
  homeIndex: number;
  lifted: boolean;
}) {
  const bump = Math.round(size * 0.2);
  const body = Math.round(size * 0.78);
  const offset = (size - body) / 2;
  const edge = size * 0.04;

  const knob = (style: object) => (
    <View
      style={[
        styles.knob,
        {
          width: bump,
          height: bump,
          borderRadius: bump / 2,
          backgroundColor: color,
          borderColor: light,
        },
        style,
      ]}
    />
  );

  const knobs: React.ReactNode[] = [];
  if (homeIndex === 0 || homeIndex === 2) {
    knobs.push(
      knob({
        right: edge,
        top: size / 2 - bump / 2,
      }),
    );
  } else {
    knobs.push(
      knob({
        left: edge,
        top: size / 2 - bump / 2,
      }),
    );
  }
  if (homeIndex === 0 || homeIndex === 1) {
    knobs.push(
      knob({
        bottom: edge,
        left: size / 2 - bump / 2,
      }),
    );
  } else {
    knobs.push(
      knob({
        top: edge,
        left: size / 2 - bump / 2,
      }),
    );
  }

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.pieceInnerRing,
          {
            width: body + 6,
            height: body + 6,
            top: offset - 3,
            left: offset - 3,
            borderColor: light,
            opacity: lifted ? 1 : 0.95,
          },
        ]}
      />
      <View
        style={[
          styles.pieceBody,
          {
            width: body,
            height: body,
            top: offset,
            left: offset,
            backgroundColor: color,
            borderColor: lifted ? '#FFFFFF' : light,
            borderWidth: lifted ? 4 : 3,
            shadowOpacity: lifted ? 0.35 : 0.18,
            elevation: lifted ? 8 : 4,
          },
        ]}>
        <Text style={[styles.pieceEmoji, { fontSize: size * 0.28 }]}>{emoji}</Text>
      </View>
      {knobs}
    </View>
  );
}

function DraggableSlotPiece({
  slotIndex,
  pieceId,
  tileSize,
  won,
  draggingSlot,
  onDragStart,
  onReleaseComplete,
}: {
  slotIndex: number;
  pieceId: number;
  tileSize: number;
  won: boolean;
  draggingSlot: number | null;
  onDragStart: (slot: number) => void;
  onReleaseComplete: (from: number, pageX: number, pageY: number) => void;
}) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const def = PIECE_DEFS[pieceId]!;
  const locked = won;
  const lifted = draggingSlot === slotIndex;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !locked,
      onMoveShouldSetPanResponder: () => !locked,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        if (locked) {
          return;
        }
        pan.extractOffset();
        onDragStart(slotIndex);
        Animated.spring(scale, {
          toValue: 1.06,
          friction: 6,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e) => {
        if (locked) {
          return;
        }
        pan.flattenOffset();
        const { pageX, pageY } = e.nativeEvent;
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 120,
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 6,
            useNativeDriver: false,
          }),
        ]).start(({ finished }) => {
          if (finished) {
            onReleaseComplete(slotIndex, pageX, pageY);
          }
        });
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 6,
            useNativeDriver: false,
          }),
        ]).start(({ finished }) => {
          if (finished) {
            onReleaseComplete(slotIndex, -1, -1);
          }
        });
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggablePiece,
        {
          zIndex: lifted ? 50 : 1,
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
        },
      ]}
      accessibilityRole="adjustable"
      accessibilityLabel={`Puzzle piece ${slotIndex + 1}, drag to swap`}>
      <PuzzlePiece
        color={def.color}
        light={def.light}
        emoji={def.emoji}
        size={tileSize}
        homeIndex={pieceId}
        lifted={lifted}
      />
    </Animated.View>
  );
}

export function JigsawPuzzleScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const [order, setOrder] = useState<number[]>(() => randomUnsolvedOrder());
  const [draggingSlot, setDraggingSlot] = useState<number | null>(null);
  const [won, setWon] = useState(false);

  const slotRefs = useRef<(View | null)[]>([null, null, null, null]);
  const slotRects = useRef<(SlotRect | null)[]>([null, null, null, null]);

  const tileSize = useMemo(() => {
    const pad = spacing.lg * 2 + spacing.xl * 2;
    const max = Math.min(width - pad, 340);
    return Math.max(120, Math.floor(max / 2) - spacing.sm);
  }, [width]);

  const remeasureSlots = useCallback(() => {
    for (let i = 0; i < 4; i++) {
      const node = slotRefs.current[i];
      if (node) {
        node.measureInWindow((x, y, w, h) => {
          slotRects.current[i] = { x, y, w, h };
        });
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopSpeak().catch(() => {});
      };
    }, []),
  );

  const goHome = useCallback(() => {
    stopSpeak().catch(() => {});
    navigation.navigate('Home');
  }, [navigation]);

  const onDragStart = useCallback((slot: number) => {
    setDraggingSlot(slot);
  }, []);

  const onReleaseComplete = useCallback(
    (from: number, pageX: number, pageY: number) => {
      setDraggingSlot(null);
      if (won || pageX < 0) {
        return;
      }
      const rects = slotRects.current;
      const to = findSlotAt(pageX, pageY, rects, 12);
      if (to === null || to === from) {
        return;
      }
      setOrder((prev) => {
        const next = [...prev];
        const tmp = next[from]!;
        next[from] = next[to]!;
        next[to] = tmp;
        if (isSolved(next)) {
          setWon(true);
          speak('You did it!').catch(() => {});
        }
        return next;
      });
    },
    [won],
  );

  const playAgain = useCallback(() => {
    setWon(false);
    setDraggingSlot(null);
    setOrder(randomUnsolvedOrder());
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
    

      <View style={styles.boardWrap}>
        <View
          style={[styles.grid, { width: tileSize * 2 + spacing.md }]}
          onLayout={remeasureSlots}>
          {[0, 1, 2, 3].map((slot) => {
            const pieceId = order[slot]!;
            const home = PIECE_DEFS[slot]!;
            const correct = pieceId === slot;
            return (
              <View
                key={slot}
                ref={(el) => {
                  slotRefs.current[slot] = el;
                }}
                onLayout={remeasureSlots}
                style={[styles.slot, { width: tileSize, height: tileSize }]}>
                <View
                  style={[
                    styles.slotShadow,
                    {
                      width: tileSize,
                      height: tileSize,
                      backgroundColor: `${home.light}55`,
                      borderColor: home.color,
                    },
                  ]}
                />
                <DraggableSlotPiece
                  slotIndex={slot}
                  pieceId={pieceId}
                  tileSize={tileSize}
                  won={won}
                  draggingSlot={draggingSlot}
                  onDragStart={onDragStart}
                  onReleaseComplete={onReleaseComplete}
                />
                {correct ? (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkTxt}>✓</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      {won ? (
        <View style={styles.winBanner}>
          <Text style={styles.winTitle}>Puzzle complete!</Text>
          <Pressable
            style={({ pressed }) => [styles.againBtn, pressed && styles.againPressed]}
            onPress={playAgain}
            accessibilityRole="button"
            accessibilityLabel="Play jigsaw again">
            <Text style={styles.againTxt}>Play again</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.skyBottom,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  homeChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: 'rgba(45,52,54,0.12)',
  },
  homeChipTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.text,
  },
  hint: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(45,52,54,0.85)',
    lineHeight: 24,
  },
  boardWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slotShadow: {
    position: 'absolute',
    borderRadius: radii.card,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  draggablePiece: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceInnerRing: {
    position: 'absolute',
    borderRadius: 20,
    borderWidth: 3,
  },
  pieceBody: {
    position: 'absolute',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  pieceEmoji: {
    fontWeight: '800',
  },
  knob: {
    position: 'absolute',
    borderWidth: 2,
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#6BCB77',
  },
  checkTxt: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2D8B6F',
  },
  winBanner: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  winTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
  },
  againBtn: {
    backgroundColor: colors.playOrange,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.playOrangeDark,
  },
  againPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  againTxt: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
});

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
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

const PIECE_DEFS = [
  { color: '#FF6B9D', emoji: '⭐' },
  { color: '#FFD93D', emoji: '🌟' },
  { color: '#6BCB77', emoji: '✨' },
  { color: '#4D96FF', emoji: '💫' },
] as const;

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

function PuzzlePiece({
  color,
  emoji,
  size,
  selected,
}: {
  color: string;
  emoji: string;
  size: number;
  selected: boolean;
}) {
  const bump = Math.round(size * 0.2);
  const body = Math.round(size * 0.78);
  const offset = (size - body) / 2;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.pieceBody,
          {
            width: body,
            height: body,
            top: offset,
            left: offset,
            backgroundColor: color,
            borderColor: selected ? '#FFFFFF' : 'rgba(255,255,255,0.92)',
            borderWidth: selected ? 5 : 3,
            shadowOpacity: selected ? 0.22 : 0.14,
          },
        ]}>
        <Text style={[styles.pieceEmoji, { fontSize: size * 0.26 }]}>{emoji}</Text>
      </View>
      <View
        style={[
          styles.knob,
          {
            width: bump,
            height: bump,
            borderRadius: bump / 2,
            backgroundColor: color,
            right: size * 0.04,
            top: size / 2 - bump / 2,
            borderColor: 'rgba(255,255,255,0.85)',
          },
        ]}
      />
      <View
        style={[
          styles.knob,
          {
            width: bump,
            height: bump,
            borderRadius: bump / 2,
            backgroundColor: color,
            bottom: size * 0.04,
            left: size / 2 - bump / 2,
            borderColor: 'rgba(255,255,255,0.85)',
          },
        ]}
      />
    </View>
  );
}

export function JigsawPuzzleScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const [order, setOrder] = useState<number[]>(() => randomUnsolvedOrder());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [won, setWon] = useState(false);

  const tileSize = useMemo(() => {
    const pad = spacing.lg * 2 + spacing.xl * 2;
    const max = Math.min(width - pad, 340);
    return Math.max(120, Math.floor(max / 2) - spacing.sm);
  }, [width]);

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

  const onSlotPress = useCallback(
    (slot: number) => {
      if (won) {
        return;
      }
      if (selectedSlot === null) {
        setSelectedSlot(slot);
        return;
      }
      if (selectedSlot === slot) {
        setSelectedSlot(null);
        return;
      }
      const next = [...order];
      const tmp = next[selectedSlot]!;
      next[selectedSlot] = next[slot]!;
      next[slot] = tmp;
      setOrder(next);
      setSelectedSlot(null);
      if (isSolved(next)) {
        setWon(true);
        speak('You did it!').catch(() => {});
      }
    },
    [order, selectedSlot, won],
  );

  const playAgain = useCallback(() => {
    setWon(false);
    setSelectedSlot(null);
    setOrder(randomUnsolvedOrder());
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          style={styles.homeChip}
          onPress={goHome}
          accessibilityRole="button"
          accessibilityLabel="Back to playground">
          <Text style={styles.homeChipTxt}>🏠 Home</Text>
        </Pressable>
        <Text style={styles.title}>Jigsaw</Text>
      </View>

      <Text style={styles.hint}>Tap two pieces to swap them into the matching spots.</Text>

      <View style={styles.boardWrap}>
        <View style={[styles.grid, { width: tileSize * 2 + spacing.md }]}>
          {[0, 1, 2, 3].map((slot) => {
            const pieceId = order[slot]!;
            const def = PIECE_DEFS[pieceId]!;
            const home = PIECE_DEFS[slot]!;
            const correct = pieceId === slot;
            return (
              <Pressable
                key={slot}
                style={({ pressed }) => [
                  styles.slot,
                  { width: tileSize, height: tileSize },
                  pressed && styles.slotPressed,
                ]}
                onPress={() => onSlotPress(slot)}
                accessibilityRole="button"
                accessibilityLabel={`Puzzle piece slot ${slot + 1}`}>
                <View
                  style={[
                    styles.slotShadow,
                    {
                      width: tileSize,
                      height: tileSize,
                      backgroundColor: `${home.color}44`,
                      borderColor: `${home.color}99`,
                    },
                  ]}
                />
                <PuzzlePiece
                  color={def.color}
                  emoji={def.emoji}
                  size={tileSize}
                  selected={selectedSlot === slot}
                />
                {correct ? (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkTxt}>✓</Text>
                  </View>
                ) : null}
              </Pressable>
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
  slotPressed: { opacity: 0.92 },
  slotShadow: {
    position: 'absolute',
    borderRadius: radii.card,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  pieceBody: {
    position: 'absolute',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
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

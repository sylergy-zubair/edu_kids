import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { playTapSound } from '../services/sounds';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'ObstacleGame'>;

type ObstacleKind = 'rock' | 'tree' | 'wall';

type Obstacle = { id: string; x: number; kind: ObstacleKind };

const { width: SCREEN_W } = Dimensions.get('window');

const GROUND_H = 64;
/** Blade tints slightly darker/lighter than `colors.grass` for texture. */
const GRASS_TINTS = ['#5A9048', '#5E944C', '#6BA85C', '#528946', '#8FD17E', '#4A7A3E'];

function makeGrassBladeSpecs(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const u = ((i * 9973) % 10000) / 10000;
    const leftPct = (i / Math.max(1, count - 1)) * 96 + u * 0.8;
    const h = 7 + ((i * 13) % 11);
    const w = 2 + (i % 2);
    const color = GRASS_TINTS[i % GRASS_TINTS.length];
    return { leftPct, h, w, color };
  });
}

const GRASS_BLADE_SPECS = makeGrassBladeSpecs(56);

const CAT_LEFT = Math.min(72, SCREEN_W * 0.14);
/** Full-body cat sprite (🐈); box sized for standing silhouette. */
const CAT_SIZE = 66;
/** Narrow inner band on the cat — avoids huge emoji glyph bounds. */
const CAT_HIT_L = CAT_LEFT + 18;
const CAT_HIT_R = CAT_LEFT + 48;

const OBSTACLE_SPECS: Record<
  ObstacleKind,
  { w: number; h: number; hitInset: number; emoji: string; emojiSize: number }
> = {
  rock: { w: 52, h: 44, hitInset: 12, emoji: '🪨', emojiSize: 40 },
  /** Taller; inset narrows hit to trunk zone. */
  tree: { w: 56, h: 58, hitInset: 18, emoji: '🌳', emojiSize: 50 },
  /** Low brick wall — wider obstacle. */
  wall: { w: 64, h: 38, hitInset: 10, emoji: '🧱', emojiSize: 34 },
};

const OBSTACLE_KINDS: ObstacleKind[] = ['rock', 'tree', 'wall'];

const CAT_EMOJI = '🐈';
const SPEED_PX = 5;
const TICK_MS = 20;
const JUMP_PEAK = -128;
/** Normalized jump 0 = ground, 1 = peak — lower = easier (counts smaller hops as clearing). */
const SAFE_JUMP = 0.14;

function randomSpawnMs() {
  return 1450 + Math.floor(Math.random() * 1100);
}

function randomObstacleKind(): ObstacleKind {
  return OBSTACLE_KINDS[Math.floor(Math.random() * OBSTACLE_KINDS.length)];
}

export function ObstacleGameScreen({ navigation }: Props) {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(true);

  const jumpAnim = useRef(new Animated.Value(0)).current;
  const catJumpRef = useRef(0);
  const jumpLockRef = useRef(false);
  const nextSpawnRef = useRef(900);
  const scoredRef = useRef<Set<string>>(new Set());
  const gameOverRef = useRef(false);

  useEffect(() => {
    const sub = jumpAnim.addListener(({ value }) => {
      catJumpRef.current = value;
    });
    return () => {
      jumpAnim.removeListener(sub);
    };
  }, [jumpAnim]);

  useFocusEffect(
    useCallback(() => {
      gameOverRef.current = false;
      setGameOver(false);
      setScore(0);
      setObstacles([]);
      scoredRef.current = new Set();
      nextSpawnRef.current = 900;
      setRunning(true);
      jumpAnim.setValue(0);
      return () => {
        setRunning(false);
      };
    }, [jumpAnim]),
  );

  const doJump = useCallback(() => {
    if (gameOverRef.current) {
      return;
    }
    if (jumpLockRef.current) {
      return;
    }
    jumpLockRef.current = true;
    playTapSound();
    Animated.sequence([
      Animated.timing(jumpAnim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(jumpAnim, {
        toValue: 0,
        duration: 380,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      jumpLockRef.current = false;
    });
  }, [jumpAnim]);

  const restart = useCallback(() => {
    gameOverRef.current = false;
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    scoredRef.current = new Set();
    nextSpawnRef.current = 900;
    jumpAnim.setValue(0);
    jumpLockRef.current = false;
  }, [jumpAnim]);

  useEffect(() => {
    if (!running) {
      return;
    }
    const id = setInterval(() => {
      if (gameOverRef.current) {
        return;
      }

      nextSpawnRef.current -= TICK_MS;
      let spawnNew: Obstacle | null = null;
      if (nextSpawnRef.current <= 0) {
        nextSpawnRef.current = randomSpawnMs();
        const kind = randomObstacleKind();
        const spec = OBSTACLE_SPECS[kind];
        spawnNew = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          x: SCREEN_W + spec.w,
          kind,
        };
      }

      setObstacles((prev) => {
        const start = spawnNew ? [...prev, spawnNew] : prev;
        const jump = catJumpRef.current;
        let died = false;

        const moved = start.map((r) => {
          const spec = OBSTACLE_SPECS[r.kind];
          const nx = r.x - SPEED_PX;
          const obsL = nx + spec.hitInset;
          const obsR = nx + spec.w - spec.hitInset;
          const overlapX = obsL < CAT_HIT_R && obsR > CAT_HIT_L;
          const safe = jump >= SAFE_JUMP;
          if (overlapX && !safe) {
            died = true;
          }
          return { ...r, x: nx };
        });

        if (died) {
          gameOverRef.current = true;
          setGameOver(true);
          return moved;
        }

        let addScore = 0;
        for (const r of moved) {
          const spec = OBSTACLE_SPECS[r.kind];
          if (r.x + spec.w < CAT_LEFT && !scoredRef.current.has(r.id)) {
            scoredRef.current.add(r.id);
            addScore += 1;
          }
        }
        if (addScore > 0) {
          setScore((s) => s + addScore);
        }

        return moved.filter((r) => {
          const spec = OBSTACLE_SPECS[r.kind];
          return r.x > -spec.w;
        });
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [running]);

  const catY = jumpAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, JUMP_PEAK],
  });

  const onPlayfieldPress = useCallback(() => {
    if (gameOverRef.current) {
      restart();
      doJump();
      return;
    }
    doJump();
  }, [doJump, restart]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          style={styles.homeChip}
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Home">
          <Text style={styles.homeChipTxt}>Home</Text>
        </Pressable>
        <Text style={styles.title}>Obstacle jump</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Pressable
        style={styles.playfield}
        onPress={onPlayfieldPress}
        accessibilityRole="button"
        accessibilityLabel={
          gameOver ? 'Tap to play again' : 'Tap to make the cat jump'
        }>
        <View style={styles.horizon} />
        <View style={styles.ground} pointerEvents="none">
          <View style={styles.groundTopSheen} />
          {GRASS_BLADE_SPECS.map((b, i) => (
            <View
              key={`blade-${i}`}
              style={[
                styles.grassBlade,
                {
                  left: `${b.leftPct}%`,
                  width: b.w,
                  height: b.h,
                  backgroundColor: b.color,
                },
              ]}
            />
          ))}
        </View>

        {obstacles.map((r) => {
          const spec = OBSTACLE_SPECS[r.kind];
          return (
            <View
              key={r.id}
              pointerEvents="none"
              style={[
                styles.obstacle,
                {
                  left: r.x,
                  bottom: GROUND_H - 4,
                  width: spec.w,
                  height: spec.h,
                },
              ]}>
              <Text
                style={{
                  fontSize: spec.emojiSize,
                  lineHeight: Math.round(spec.emojiSize * 1.02),
                }}>
                {spec.emoji}
              </Text>
            </View>
          );
        })}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.cat,
            {
              left: CAT_LEFT,
              bottom: GROUND_H - 4,
              transform: [{ translateY: catY }, { scaleX: -1 }],
            },
          ]}>
          <Text style={styles.catEmoji}>{CAT_EMOJI}</Text>
        </Animated.View>

        {gameOver && (
          <View style={styles.overlay} pointerEvents="box-none">
            <View style={styles.gameOverCard}>
              <Text style={styles.gameOverTitle}>Nice try!</Text>
              <Text style={styles.gameOverScore}>Obstacles passed: {score}</Text>
              <Text style={styles.gameOverHint}>Tap to play again</Text>
            </View>
          </View>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.skyBottom,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  homeChip: {
    backgroundColor: colors.card,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: 'rgba(45,52,54,0.08)',
  },
  homeChipTxt: { fontSize: 18, fontWeight: '800', color: colors.text },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  scorePill: {
    backgroundColor: colors.yellow,
    minWidth: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: 'rgba(45,52,54,0.12)',
    alignItems: 'center',
  },
  scoreTxt: { fontSize: 20, fontWeight: '900', color: colors.text },
  hint: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(45,52,54,0.75)',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  playfield: {
    flex: 1,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.skyTop,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  horizon: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: GROUND_H + 48,
    backgroundColor: 'rgba(224,246,255,0.35)',
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: GROUND_H,
    backgroundColor: colors.grass,
    borderTopWidth: 3,
    borderColor: 'rgba(255,255,255,0.45)',
    overflow: 'hidden',
  },
  groundTopSheen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  grassBlade: {
    position: 'absolute',
    bottom: 3,
    borderRadius: 2,
    opacity: 0.92,
  },
  obstacle: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerSpacer: { width: 72 },
  cat: {
    position: 'absolute',
    width: CAT_SIZE,
    height: CAT_SIZE,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  catEmoji: {
    fontSize: Math.round(CAT_SIZE * 0.92),
    lineHeight: Math.round(CAT_SIZE * 0.98),
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(45,52,54,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  gameOverCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    maxWidth: 320,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  gameOverScore: {
    fontSize: 20,
    fontWeight: '800',
    color: 'rgba(45,52,54,0.85)',
    marginBottom: spacing.md,
  },
  gameOverHint: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.playOrangeDark,
  },
});

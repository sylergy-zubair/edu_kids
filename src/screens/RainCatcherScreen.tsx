import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { playSlapSound, stopBundledSound } from '../services/sounds';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'RainCatcher'>;

const TICK_MS = 36;
const SPAWN_MS = 280;
const DROP_SPEED = 13;
const UMB_W = 142;
const UMB_H = 66;
/** Same full-body 🐈 sprite box as `ObstacleGameScreen`. */
const CAT_SIZE = 66;
const CAT_EMOJI = '🐈';
const CAT_BOTTOM = 20;
const CAT_MOVE_MIN = 6.55;
const CAT_MOVE_MAX = 13.05;
const CAT_EDGE_PAD = 10;

type Drop = { id: string; x: number; y: number };

type Rect = { x: number; y: number; w: number; h: number };

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function hitRect(px: number, py: number, r: Rect, pad: number) {
  return (
    px >= r.x - pad &&
    px <= r.x + r.w + pad &&
    py >= r.y - pad &&
    py <= r.y + r.h + pad
  );
}

function randomCatSpeed() {
  const s =
    CAT_MOVE_MIN + Math.random() * (CAT_MOVE_MAX - CAT_MOVE_MIN);
  return Math.random() < 0.5 ? -s : s;
}

export function RainCatcherScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const focusedRef = useRef(false);
  const arenaRef = useRef({ w: 0, h: 0 });
  const [arena, setArena] = useState({ w: 0, h: 0 });

  const umbrellaRef = useRef<Rect>({
    x: 0,
    y: 0,
    w: UMB_W,
    h: UMB_H,
  });
  const catRef = useRef<Rect>({ x: 0, y: 0, w: CAT_SIZE, h: CAT_SIZE });
  const gestureStart = useRef({ x: 0, y: 0 });

  const [umbrellaPos, setUmbrellaPos] = useState({ x: 0, y: 0 });
  const [catPos, setCatPos] = useState({ x: 0, y: 0 });
  const [drops, setDrops] = useState<Drop[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameOverRef = useRef(false);
  const dropsRef = useRef<Drop[]>([]);
  const spawnAccRef = useRef(0);
  const catVelRef = useRef(randomCatSpeed());
  const [catFacingRight, setCatFacingRight] = useState(true);

  const initCatAndUmbrella = useCallback((w: number, h: number) => {
    if (w < 40 || h < 120) {
      return;
    }
    const catY = h - CAT_BOTTOM - CAT_SIZE;
    const catX = w / 2 - CAT_SIZE / 2;
    catRef.current = { x: catX, y: catY, w: CAT_SIZE, h: CAT_SIZE };
    setCatPos({ x: catX, y: catY });
    catVelRef.current = randomCatSpeed();
    setCatFacingRight(catVelRef.current >= 0);

    const ux = clamp(w / 2 - UMB_W / 2, 8, w - UMB_W - 8);
    const uy = clamp(catY - UMB_H - 28, 36, catY - UMB_H - 8);
    umbrellaRef.current = { x: ux, y: uy, w: UMB_W, h: UMB_H };
    setUmbrellaPos({ x: ux, y: uy });
  }, []);

  const resetRound = useCallback(
    (w: number, h: number) => {
      dropsRef.current = [];
      setDrops([]);
      spawnAccRef.current = 0;
      scoreRef.current = 0;
      livesRef.current = 3;
      gameOverRef.current = false;
      setScore(0);
      setLives(3);
      setGameOver(false);
      initCatAndUmbrella(w, h);
    },
    [initCatAndUmbrella],
  );

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      const { w, h } = arenaRef.current;
      if (w > 0) {
        resetRound(w, h);
      } else {
        scoreRef.current = 0;
        livesRef.current = 3;
        gameOverRef.current = false;
        setScore(0);
        setLives(3);
        setGameOver(false);
        setDrops([]);
        dropsRef.current = [];
      }
      return () => {
        focusedRef.current = false;
        stopBundledSound();
      };
    }, [resetRound]),
  );

  const onArenaLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width: w, height: h } = e.nativeEvent.layout;
      arenaRef.current = { w, h };
      setArena((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
      if (focusedRef.current) {
        resetRound(w, h);
      } else {
        initCatAndUmbrella(w, h);
      }
    },
    [initCatAndUmbrella, resetRound],
  );

  const minUmbrellaY = 32;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !gameOverRef.current,
        onMoveShouldSetPanResponder: () => !gameOverRef.current,
        onPanResponderGrant: () => {
          gestureStart.current = {
            x: umbrellaRef.current.x,
            y: umbrellaRef.current.y,
          };
        },
        onPanResponderMove: (_, g) => {
          if (gameOverRef.current) {
            return;
          }
          const { w } = arenaRef.current;
          if (w < 40) {
            return;
          }
          const cat = catRef.current;
          const maxY = cat.y - UMB_H - 4;
          const nx = clamp(
            gestureStart.current.x + g.dx,
            6,
            w - UMB_W - 6,
          );
          const ny = clamp(gestureStart.current.y + g.dy, minUmbrellaY, maxY);
          umbrellaRef.current = { ...umbrellaRef.current, x: nx, y: ny };
          setUmbrellaPos({ x: nx, y: ny });
        },
      }),
    [],
  );

  useEffect(() => {
    if (!isFocused || arena.w < 40 || gameOver) {
      return;
    }
    const id = setInterval(() => {
      if (!focusedRef.current || gameOverRef.current) {
        return;
      }
      const { w, h } = arenaRef.current;
      if (w < 40) {
        return;
      }

      spawnAccRef.current += TICK_MS;
      if (spawnAccRef.current >= SPAWN_MS) {
        spawnAccRef.current = 0;
        const rx = 16 + Math.random() * Math.max(20, w - 32);
        const newDrop: Drop = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          x: rx,
          y: -8,
        };
        dropsRef.current = [...dropsRef.current, newDrop];
      }

      const u = umbrellaRef.current;
      let cat = catRef.current;

      if (!gameOverRef.current) {
        const minX = CAT_EDGE_PAD;
        const maxX = w - CAT_SIZE - CAT_EDGE_PAD;
        let nx = cat.x + catVelRef.current;
        let v = catVelRef.current;

        if (nx <= minX) {
          nx = minX;
          v = CAT_MOVE_MIN + Math.random() * (CAT_MOVE_MAX - CAT_MOVE_MIN);
        } else if (nx >= maxX) {
          nx = maxX;
          v = -(CAT_MOVE_MIN + Math.random() * (CAT_MOVE_MAX - CAT_MOVE_MIN));
        } else if (Math.random() < 0.006) {
          v *= -1;
          v =
            (v >= 0 ? 1 : -1) *
            (CAT_MOVE_MIN + Math.random() * (CAT_MOVE_MAX - CAT_MOVE_MIN));
        }

        catVelRef.current = v;
        cat = { ...cat, x: nx };
        catRef.current = cat;
        setCatPos({ x: nx, y: cat.y });
        setCatFacingRight(v >= 0);
      }

      let next: Drop[] = [];
      let caught = 0;
      let catHitsThisTick = 0;

      for (const d of dropsRef.current) {
        const y = d.y + DROP_SPEED;
        if (y > h + 24) {
          continue;
        }
        if (hitRect(d.x, y, u, 14)) {
          caught++;
          continue;
        }
        if (hitRect(d.x, y, cat, 10)) {
          catHitsThisTick++;
          continue;
        }
        next.push({ ...d, y });
      }

      if (caught > 0) {
        scoreRef.current += caught;
        setScore(scoreRef.current);
      }
      if (catHitsThisTick > 0) {
        livesRef.current = Math.max(0, livesRef.current - 1);
        setLives(livesRef.current);
        playSlapSound();
        if (livesRef.current <= 0) {
          gameOverRef.current = true;
          setGameOver(true);
        }
      }

      dropsRef.current = next;
      setDrops(next);
    }, TICK_MS);

    return () => clearInterval(id);
  }, [isFocused, arena.w, arena.h, gameOver]);

  const goHome = useCallback(() => {
    stopBundledSound();
    navigation.navigate('Home');
  }, [navigation]);

  const playAgain = useCallback(() => {
    const { w, h } = arenaRef.current;
    resetRound(w, h);
  }, [resetRound]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
     

      <View style={styles.hud}>
        <Text style={styles.hudTxt}>Caught: {score}</Text>
        <Text style={styles.hudTxt}>❤️ × {lives}</Text>
      </View>

      <View style={styles.arena} onLayout={onArenaLayout}>
        {drops.map((d) => (
          <Text
            key={d.id}
            style={[styles.drop, { left: d.x - 10, top: d.y }]}
            pointerEvents="none">
            💧
          </Text>
        ))}

        {arena.w > 0 ? (
          <View
            pointerEvents="none"
            style={[
              styles.cat,
              {
                left: catPos.x,
                top: catPos.y,
                transform: [{ scaleX: catFacingRight ? -1 : 1 }],
              },
            ]}>
            <Text style={styles.catEmoji}>{CAT_EMOJI}</Text>
          </View>
        ) : null}

        <View
          style={[
            styles.umbrellaWrap,
            { left: umbrellaPos.x, top: umbrellaPos.y },
          ]}
          {...panResponder.panHandlers}
          accessibilityRole="adjustable"
          accessibilityLabel="Umbrella — drag to shield the cat">
          <Text style={styles.umbrellaEmoji}>☂️</Text>
          <Text style={styles.dragHint}>↔</Text>
        </View>
      </View>

      {gameOver ? (
        <View style={styles.overlay}>
          <Text style={styles.overTitle}>The cat got wet!</Text>
          <Text style={styles.overSub}>You caught {score} raindrops.</Text>
          <Pressable
            style={({ pressed }) => [styles.againBtn, pressed && styles.againPressed]}
            onPress={playAgain}
            accessibilityRole="button"
            accessibilityLabel="Play rain catcher again">
            <Text style={styles.againTxt}>Try again</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#7EC8E3',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
  },
  hint: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(45,52,54,0.88)',
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  hudTxt: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  arena: {
    flex: 1,
    margin: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radii.card,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.65)',
    overflow: 'hidden',
  },
  drop: {
    position: 'absolute',
    fontSize: 22,
  },
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
  umbrellaWrap: {
    position: 'absolute',
    width: UMB_W,
    minHeight: UMB_H + 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  umbrellaEmoji: {
    fontSize: 90
  },
  dragHint: {
    marginTop: -6,
    fontSize: 16,
    fontWeight: '900',
    color: 'rgba(45,52,54,0.45)',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  overTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
  },
  overSub: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
  },
  againBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.playOrange,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.playOrangeDark,
  },
  againPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  againTxt: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
});

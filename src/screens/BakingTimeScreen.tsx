import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'BakingTime'>;

const ITEM = 52;
const PIZZA_W = 208;
const PIZZA_H = 208;
const OVEN_W = 128;
const OVEN_H = 108;
const EDGE = 12;
const DROP_PAD = 38;

// No Unicode emoji for literal tomato/pepper *slices*; 🔴 / 🟢🟡🟠 read as rounds & rings on pizza.
const TOPPINGS: { id: string; emoji: string }[] = [
  { id: 'bt-t0', emoji: '🔴' },
  { id: 'bt-t1', emoji: '🔴' },
  { id: 'bt-t2', emoji: '🔴' },
  { id: 'bt-p0', emoji: '🟢' },
  { id: 'bt-p1', emoji: '🟡' },
  { id: 'bt-p2', emoji: '🟠' },
  { id: 'bt-m0', emoji: '🥓' },
  { id: 'bt-m1', emoji: '🥓' },
  { id: 'bt-m2', emoji: '🥓' },
];

function pizzaRect(w: number, h: number) {
  const left = Math.max(EDGE, (w - PIZZA_W) / 2);
  const top = Math.max(EDGE, (h - PIZZA_H) / 2 - 6);
  return {
    left,
    top,
    right: left + PIZZA_W,
    bottom: top + PIZZA_H,
  };
}

function ovenRect(w: number, h: number) {
  const left = w - OVEN_W - EDGE;
  const top = h - OVEN_H - EDGE;
  return {
    left,
    top,
    right: w - EDGE,
    bottom: h - EDGE,
  };
}

function scatterPositions(w: number, h: number) {
  const pz = pizzaRect(w, h);
  const ov = ovenRect(w, h);
  const pad = 10;

  const overlaps = (x: number, y: number) => {
    const il = x;
    const it = y;
    const ir = x + ITEM;
    const ib = y + ITEM;
    const hitPizza =
      il < pz.right + pad &&
      ir > pz.left - pad &&
      it < pz.bottom + pad &&
      ib > pz.top - pad;
    const hitOven =
      il < ov.right + pad &&
      ir > ov.left - pad &&
      it < ov.bottom + pad &&
      ib > ov.top - pad;
    return hitPizza || hitOven;
  };

  const xSpan = Math.max(ITEM, w - ITEM - EDGE * 2);
  const ySpan = Math.max(ITEM, h - ITEM - EDGE * 2);

  return TOPPINGS.map(() => {
    let x = EDGE;
    let y = EDGE;
    for (let attempt = 0; attempt < 56; attempt++) {
      x = EDGE + Math.random() * xSpan;
      y = EDGE + Math.random() * ySpan;
      if (!overlaps(x, y)) {
        break;
      }
    }
    return { x, y };
  });
}

function DraggableTopping({
  id,
  emoji,
  left,
  top,
  targetRef,
  locked,
  onDropped,
}: {
  id: string;
  emoji: string;
  left: number;
  top: number;
  targetRef: React.RefObject<View | null>;
  locked: boolean;
  onDropped: (pieceId: string) => void;
}) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !locked,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (e) => {
        if (locked) {
          return;
        }
        const mx = e.nativeEvent.pageX;
        const my = e.nativeEvent.pageY;
        pan.flattenOffset();
        const target = targetRef.current;
        if (!target) {
          return;
        }
        target.measureInWindow((zx, zy, zw, zh) => {
          const hit =
            mx >= zx - DROP_PAD &&
            mx <= zx + zw + DROP_PAD &&
            my >= zy - DROP_PAD &&
            my <= zy + zh + DROP_PAD;
          if (hit) {
            onDropped(id);
            pan.setValue({ x: 0, y: 0 });
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              friction: 8,
              useNativeDriver: false,
            }).start();
          }
        });
      },
    }),
  ).current;

  return (
    <View
      style={[styles.toppingAnchor, { left, top, width: ITEM, height: ITEM }]}
      pointerEvents="box-none">
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.topping, { transform: pan.getTranslateTransform() }]}>
        <Text style={styles.toppingEmoji}>{emoji}</Text>
      </Animated.View>
    </View>
  );
}

export function BakingTimeScreen({ navigation }: Props) {
  const pizzaRef = useRef<View>(null);
  const [field, setField] = useState({ w: 0, h: 0 });
  const [resetKey, setResetKey] = useState(0);
  const [spots, setSpots] = useState<{ x: number; y: number }[]>([]);
  const [collected, setCollected] = useState<string[]>([]);
  const [phase, setPhase] = useState<'play' | 'baking' | 'done'>('play');

  const bakeShiftX = useRef(new Animated.Value(0)).current;
  const bakeShiftY = useRef(new Animated.Value(0)).current;
  const bakeScale = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      setCollected([]);
      setPhase('play');
      setResetKey((k) => k + 1);
      bakeShiftX.setValue(0);
      bakeShiftY.setValue(0);
      bakeScale.setValue(1);
    }, [bakeShiftX, bakeShiftY, bakeScale]),
  );

  useEffect(() => {
    if (field.w < 40 || field.h < 40) {
      return;
    }
    setSpots(scatterPositions(field.w, field.h));
  }, [field.w, field.h, resetKey]);

  const onFieldLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = e.nativeEvent.layout;
      setField({ w: width, h: height });
    },
    [],
  );

  const onDropped = useCallback((id: string) => {
    setCollected((c) => (c.includes(id) ? c : [...c, id]));
  }, []);

  const runBakeAnimation = useCallback(() => {
    const w = field.w;
    const h = field.h;
    if (w < 40) {
      return;
    }
    const pz = pizzaRect(w, h);
    const pizzaCx = pz.left + PIZZA_W / 2;
    const pizzaCy = pz.top + PIZZA_H / 2;
    const ovenCx = w - EDGE - OVEN_W / 2;
    const ovenCy = h - EDGE - OVEN_H / 2;
    const tx = ovenCx - pizzaCx;
    const ty = ovenCy - pizzaCy;

    setPhase('baking');
    Animated.parallel([
      Animated.timing(bakeShiftX, {
        toValue: tx,
        duration: 1100,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bakeShiftY, {
        toValue: ty,
        duration: 1100,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bakeScale, {
        toValue: 0.38,
        duration: 1100,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPhase('done');
    });
  }, [bakeShiftX, bakeShiftY, bakeScale, field.w, field.h]);

  useEffect(() => {
    if (
      collected.length === TOPPINGS.length &&
      TOPPINGS.length > 0 &&
      phase === 'play'
    ) {
      const t = setTimeout(() => runBakeAnimation(), 420);
      return () => clearTimeout(t);
    }
  }, [collected.length, phase, runBakeAnimation]);

  const goHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const playAgain = useCallback(() => {
    setCollected([]);
    setPhase('play');
    setResetKey((k) => k + 1);
    bakeShiftX.setValue(0);
    bakeShiftY.setValue(0);
    bakeScale.setValue(1);
  }, [bakeShiftX, bakeShiftY, bakeScale]);

  const collectedSet = new Set(collected);
  const pz =
    field.w > 0 ? pizzaRect(field.w, field.h) : { left: 0, top: 0, right: 0, bottom: 0 };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      

      <View style={styles.field} onLayout={onFieldLayout}>
        <View style={styles.counter} />

        <View
          style={[
            styles.oven,
            {
              width: OVEN_W,
              height: OVEN_H,
              right: EDGE,
              bottom: EDGE,
            },
          ]}
          pointerEvents="none">
          <Text style={styles.ovenFlame}>🔥</Text>
          <Text style={styles.ovenLbl}>Oven</Text>
          <View style={styles.ovenWindow} />
        </View>

        <Animated.View
          style={[
            styles.pizzaStage,
            {
              left: pz.left,
              top: pz.top,
              width: PIZZA_W,
              height: PIZZA_H,
              transform: [
                { translateX: bakeShiftX },
                { translateY: bakeShiftY },
                { scale: bakeScale },
              ],
            },
          ]}>
          <View
            ref={pizzaRef}
            collapsable={false}
            style={styles.pizza}
            pointerEvents="box-none">
            <View style={styles.sauceArea}>
              {collected.length === 0 ? (
                <Text style={styles.pizzaHint}>Add toppings</Text>
              ) : (
                <View style={styles.onPizzaPile}>
                  {collected.map((cid) => {
                    const t = TOPPINGS.find((x) => x.id === cid);
                    return t ? (
                      <Text key={cid} style={styles.onPizzaEmoji}>
                        {t.emoji}
                      </Text>
                    ) : null;
                  })}
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {phase === 'play' &&
          field.w > 0 &&
          spots.length === TOPPINGS.length &&
          TOPPINGS.map((piece, i) =>
            !collectedSet.has(piece.id) ? (
              <DraggableTopping
                key={`${piece.id}-${resetKey}`}
                id={piece.id}
                emoji={piece.emoji}
                left={spots[i].x}
                top={spots[i].y}
                targetRef={pizzaRef}
                locked={false}
                onDropped={onDropped}
              />
            ) : null,
          )}

        {phase === 'done' && (
          <Pressable
            style={styles.winOverlay}
            onPress={playAgain}
            accessibilityRole="button"
            accessibilityLabel="Bake another pizza">
            <View style={styles.winCard}>
              <Text style={styles.winTitle}>Hot and yummy!</Text>
              <Text style={styles.winHint}>Tap to bake another pizza</Text>
            </View>
          </Pressable>
        )}
      </View>
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
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  countPill: {
    backgroundColor: 'rgba(45,52,54,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    minWidth: 52,
    alignItems: 'center',
  },
  countTxt: { fontSize: 17, fontWeight: '900', color: colors.text },
  hint: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(45,52,54,0.75)',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  field: {
    flex: 1,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: '#C4A882',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  counter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#D9C4A8',
  },
  oven: {
    position: 'absolute',
    zIndex: 2,
    elevation: 3,
    backgroundColor: '#4A4A4A',
    borderRadius: radii.card,
    borderWidth: 4,
    borderColor: '#2D2D2D',
    alignItems: 'center',
    paddingTop: 6,
  },
  ovenFlame: { fontSize: 26 },
  ovenLbl: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EEE',
    marginBottom: 4,
  },
  ovenWindow: {
    flex: 1,
    width: '78%',
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#333',
  },
  pizzaStage: {
    position: 'absolute',
    zIndex: 4,
    elevation: 5,
  },
  pizza: {
    width: PIZZA_W,
    height: PIZZA_H,
    borderRadius: PIZZA_W / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5A055',
    borderWidth: 12,
    borderColor: '#FFFFFF',
  },
  sauceArea: {
    width: PIZZA_W - 52,
    height: PIZZA_H - 52,
    borderRadius: (PIZZA_W - 52) / 2,
    backgroundColor: '#ff8d6e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  pizzaHint: {
    fontSize: 15,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.75)',
  },
  onPizzaPile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 4,
  },
  onPizzaEmoji: { fontSize: 26 },
  toppingAnchor: {
    position: 'absolute',
    zIndex: 6,
    elevation: 8,
  },
  topping: {
    width: ITEM,
    height: ITEM,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(45,52,54,0.1)',
  },
  toppingEmoji: { fontSize: 30 },
  winOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(45,52,54,0.32)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    zIndex: 20,
  },
  winCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  winTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  winHint: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.playOrangeDark,
    textAlign: 'center',
  },
});

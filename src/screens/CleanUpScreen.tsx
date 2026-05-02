import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
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

type Props = NativeStackScreenProps<RootStackParamList, 'CleanUp'>;

const ITEM = 56;
const BOX_W = 142;
const BOX_H = 128;
const EDGE = 12;
const DROP_PAD = 32;

const MESS_PIECES: { id: string; emoji: string }[] = [
  { id: 'cu-0', emoji: '🧸' },
  { id: 'cu-1', emoji: '🎲' },
  { id: 'cu-2', emoji: '👕' },
  { id: 'cu-3', emoji: '🚗' },
  { id: 'cu-4', emoji: '👖' },
  { id: 'cu-5', emoji: '🧩' },
  { id: 'cu-6', emoji: '🧦' },
  { id: 'cu-7', emoji: '🪀' },
  { id: 'cu-8', emoji: '👗' },
  { id: 'cu-9', emoji: '🧢' },
];

/** Full floor minus edges, avoiding only the bottom-right box (so items can use top-right too). */
function scatterPositions(w: number, h: number) {
  const boxLeft = w - BOX_W - EDGE;
  const boxTop = h - BOX_H - EDGE;
  const boxRight = w - EDGE;
  const boxBottom = h - EDGE;
  const pad = 8;

  const overlapsBox = (x: number, y: number) => {
    const il = x;
    const it = y;
    const ir = x + ITEM;
    const ib = y + ITEM;
    return (
      il < boxRight + pad &&
      ir > boxLeft - pad &&
      it < boxBottom + pad &&
      ib > boxTop - pad
    );
  };

  const xSpan = Math.max(ITEM, w - ITEM - EDGE * 2);
  const ySpan = Math.max(ITEM, h - ITEM - EDGE * 2);

  return MESS_PIECES.map(() => {
    let x = EDGE;
    let y = EDGE;
    for (let attempt = 0; attempt < 48; attempt++) {
      x = EDGE + Math.random() * xSpan;
      y = EDGE + Math.random() * ySpan;
      if (!overlapsBox(x, y)) {
        break;
      }
    }
    return { x, y };
  });
}

function DraggablePiece({
  id,
  emoji,
  left,
  top,
  boxRef,
  onDropped,
}: {
  id: string;
  emoji: string;
  left: number;
  top: number;
  boxRef: React.RefObject<View | null>;
  onDropped: (pieceId: string) => void;
}) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (e) => {
        const mx = e.nativeEvent.pageX;
        const my = e.nativeEvent.pageY;
        pan.flattenOffset();
        const box = boxRef.current;
        if (!box) {
          return;
        }
        box.measureInWindow((zx, zy, zw, zh) => {
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
      style={[styles.pieceAnchor, { left, top, width: ITEM, height: ITEM }]}
      pointerEvents="box-none">
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.piece,
          { transform: pan.getTranslateTransform() },
        ]}>
        <Text style={styles.pieceEmoji}>{emoji}</Text>
      </Animated.View>
    </View>
  );
}

export function CleanUpScreen({ navigation }: Props) {
  const boxRef = useRef<View>(null);
  const [field, setField] = useState({ w: 0, h: 0 });
  const [resetKey, setResetKey] = useState(0);
  const [spots, setSpots] = useState<{ x: number; y: number }[]>([]);
  const [collected, setCollected] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      setCollected([]);
      setResetKey((k) => k + 1);
    }, []),
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

  const goHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const playAgain = useCallback(() => {
    setCollected([]);
    setResetKey((k) => k + 1);
  }, []);

  const done = collected.length === MESS_PIECES.length && MESS_PIECES.length > 0;
  const collectedSet = new Set(collected);

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
        <Text style={styles.title}>Clean-up</Text>
        <View style={styles.countPill}>
          <Text style={styles.countTxt}>
            {collected.length}/{MESS_PIECES.length}
          </Text>
        </View>
      </View>

      <Text style={styles.hint}>Drag toys and clothes into the box.</Text>

      <View style={styles.field} onLayout={onFieldLayout}>
        <View style={styles.floor} />

        {field.w > 0 &&
          spots.length === MESS_PIECES.length &&
          MESS_PIECES.map((piece, i) =>
            !collectedSet.has(piece.id) ? (
              <DraggablePiece
                key={`${piece.id}-${resetKey}`}
                id={piece.id}
                emoji={piece.emoji}
                left={spots[i].x}
                top={spots[i].y}
                boxRef={boxRef}
                onDropped={onDropped}
              />
            ) : null,
          )}

        <View
          ref={boxRef}
          collapsable={false}
          style={[
            styles.box,
            {
              width: BOX_W,
              height: BOX_H,
              right: EDGE,
              bottom: EDGE,
            },
          ]}
          pointerEvents="none">
          <Text style={styles.boxIcon}>📦</Text>
          <Text style={styles.boxLbl}>Box</Text>
          <View style={styles.boxPile}>
            {collected.map((cid) => {
              const p = MESS_PIECES.find((x) => x.id === cid);
              return p ? (
                <Text key={cid} style={styles.pileEmoji}>
                  {p.emoji}
                </Text>
              ) : null;
            })}
          </View>
        </View>

        {done && (
          <Pressable
            style={styles.winOverlay}
            onPress={playAgain}
            accessibilityRole="button"
            accessibilityLabel="Play again">
            <View style={styles.winCard}>
              <Text style={styles.winTitle}>Nice and tidy!</Text>
              <Text style={styles.winHint}>Tap to make another mess</Text>
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
    fontSize: 22,
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
    backgroundColor: '#D4C4A8',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#C9B896',
  },
  pieceAnchor: {
    position: 'absolute',
    zIndex: 4,
    elevation: 6,
  },
  piece: {
    width: ITEM,
    height: ITEM,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(45,52,54,0.12)',
  },
  pieceEmoji: { fontSize: 34 },
  box: {
    position: 'absolute',
    zIndex: 2,
    elevation: 4,
    backgroundColor: '#C4A574',
    borderRadius: radii.card,
    borderWidth: 4,
    borderColor: '#8B6914',
    alignItems: 'center',
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  boxIcon: { fontSize: 28 },
  boxLbl: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  boxPile: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 2,
    width: '100%',
  },
  pileEmoji: { fontSize: 22 },
  winOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(45,52,54,0.3)',
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

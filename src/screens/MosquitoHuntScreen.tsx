import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { playSlapSound } from '../services/sounds';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'MosquitoHunt'>;

const MOSQUITO_COUNT = 12;
const BUG_SIZE = 44;
const SPLAT_MS = 380;

type BugRow = { id: string };

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

type FlyProps = {
  id: string;
  w: number;
  h: number;
  onSplat: (id: string) => void;
};

function FlyingMosquito({ id, w, h, onSplat }: FlyProps) {
  const x = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<'fly' | 'splat'>('fly');
  const deadRef = useRef(false);

  const maxX = Math.max(8, w - BUG_SIZE - 8);
  const maxY = Math.max(8, h - BUG_SIZE - 8);

  useEffect(() => {
    x.setValue(randomInRange(8, maxX));
    y.setValue(randomInRange(8, maxY));
  }, [maxX, maxY, x, y]);

  useEffect(() => {
    if (w < 50 || h < 50) {
      return;
    }
    let cancelled = false;

    const flutter = () => {
      if (cancelled || deadRef.current) {
        return;
      }
      const tx = randomInRange(8, maxX);
      const ty = randomInRange(8, maxY);
      const dur = 1400 + Math.random() * 1800;
      Animated.parallel([
        Animated.timing(x, {
          toValue: tx,
          duration: dur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: ty,
          duration: dur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && !cancelled && !deadRef.current) {
          flutter();
        }
      });
    };

    flutter();

    return () => {
      cancelled = true;
      x.stopAnimation();
      y.stopAnimation();
    };
  }, [w, h, maxX, maxY, x, y]);

  useEffect(() => {
    if (phase !== 'fly' || w < 50) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, {
          toValue: 1,
          duration: 220,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wobble, {
          toValue: -1,
          duration: 220,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase, w, wobble]);

  const tilt = wobble.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-14deg', '14deg'],
  });

  const squash = useCallback(() => {
    if (phase !== 'fly' || deadRef.current) {
      return;
    }
    deadRef.current = true;
    x.stopAnimation();
    y.stopAnimation();
    playSlapSound();
    setPhase('splat');
    setTimeout(() => onSplat(id), SPLAT_MS);
  }, [id, onSplat, phase, x, y]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.bugWrap,
        {
          transform: [{ translateX: x }, { translateY: y }, { rotate: tilt }],
        },
      ]}>
      <Pressable
        onPress={squash}
        disabled={phase !== 'fly'}
        hitSlop={18}
        accessibilityRole="button"
        accessibilityLabel={phase === 'fly' ? 'Squash mosquito' : 'Splat'}>
        <Text style={styles.bugEmoji}>{phase === 'fly' ? '🦟' : '💥'}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function MosquitoHuntScreen({ navigation }: Props) {
  const [bounds, setBounds] = useState({ w: 0, h: 0 });
  const [bugs, setBugs] = useState<BugRow[]>(() =>
    Array.from({ length: MOSQUITO_COUNT }, (_, i) => ({ id: `mq-${i}` })),
  );

  const reset = useCallback(() => {
    setBugs(
      Array.from({ length: MOSQUITO_COUNT }, (_, i) => ({
        id: `mq-${Date.now()}-${i}`,
      })),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      reset();
    }, [reset]),
  );

  const onSplat = useCallback((id: string) => {
    setBugs((b) => b.filter((row) => row.id !== id));
  }, []);

  const goHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const onLayoutField = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = e.nativeEvent.layout;
      setBounds({ w: width, h: height });
    },
    [],
  );

  const cleared = bugs.length === 0;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.field} onLayout={onLayoutField}>
        {bounds.w > 0 &&
          bugs.map((b) => (
            <FlyingMosquito
              key={b.id}
              id={b.id}
              w={bounds.w}
              h={bounds.h}
              onSplat={onSplat}
            />
          ))}

        {cleared && (
          <Pressable
            style={styles.winOverlay}
            onPress={reset}
            accessibilityRole="button"
            accessibilityLabel="Play again">
            <View style={styles.winCard}>
              <Text style={styles.winTitle}>All clear!</Text>
              <Text style={styles.winHint}>Tap here for more mosquitos</Text>
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
    backgroundColor: 'rgba(45,52,54,0.12)',
    minWidth: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  countTxt: { fontSize: 18, fontWeight: '900', color: colors.text },
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
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: 'rgba(86, 169, 105, 0.75)',
  },
  bugWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: BUG_SIZE,
    height: BUG_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bugEmoji: {
    fontSize: 34,
    textAlign: 'center',
  },
  winOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(45,52,54,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
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

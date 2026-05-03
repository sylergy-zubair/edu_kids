import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { DriftingCloud } from '../components/DriftingCloud';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { playSuccessSound, stopBundledSound } from '../services/sounds';
import { speak } from '../services/tts';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Moonsight'>;

/** Same night silhouettes as `LightningScreen` ground row. */
function GroundSilhouettes() {
  return (
    <View style={styles.ground}>
      <View style={styles.silhouetteRow}>
        <Text style={styles.silhouette}>🌲</Text>
        <Text style={styles.silhouette}>🏠</Text>
        <Text style={styles.silhouette}>🌳</Text>
        <Text style={styles.silhouette}>🏘️</Text>
        <Text style={styles.silhouette}>🌲</Text>
        <Text style={styles.silhouette}>🏠</Text>
        <Text style={styles.silhouette}>🌳</Text>
      </View>
    </View>
  );
}

const STARS: { top: `${number}%`; left: `${number}%`; s: number }[] = [
  { top: '8%', left: '22%', s: 3 },
  { top: '14%', left: '45%', s: 2 },
  { top: '6%', left: '58%', s: 2 },
  { top: '20%', left: '8%', s: 2 },
  { top: '12%', left: '92%', s: 3 },
  { top: '26%', left: '35%', s: 2 },
  { top: '4%', left: '78%', s: 2 },
  { top: '18%', left: '65%', s: 3 },
];

type CloudItem = {
  id: string;
  top: `${number}%`;
  left: `${number}%`;
  fontSize: number;
  drift: number;
  durationMs: number;
};

function randomInRange(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo);
}

/** Build moon position and clouds that overlap it so the moon stays hidden until clouds are cleared. */
function generateNight(roundKey: number): { moonTop: number; moonLeft: number; clouds: CloudItem[] } {
  const nudge = (roundKey % 5) * 0.4;
  const moonTop = randomInRange(18, 34) + nudge;
  const moonLeft = randomInRange(22, 62) - nudge * 0.5;
  const clouds: CloudItem[] = [];

  const offsets: { dt: number; dl: number; fs: number; drift: number; dur: number }[] = [
    { dt: -2, dl: -4, fs: 48, drift: 14, dur: 10200 },
    { dt: 1, dl: 6, fs: 40, drift: 18, dur: 8800 },
    { dt: 5, dl: -8, fs: 44, drift: 12, dur: 11500 },
    { dt: -4, dl: 10, fs: 36, drift: 16, dur: 9600 },
    { dt: 8, dl: -2, fs: 42, drift: 11, dur: 10400 },
    { dt: -1, dl: -12, fs: 38, drift: 15, dur: 9000 },
  ];

  offsets.forEach((o, i) => {
    clouds.push({
      id: `cover-${i}`,
      top: `${Math.round(moonTop + o.dt)}%` as `${number}%`,
      left: `${Math.round(moonLeft + o.dl)}%` as `${number}%`,
      fontSize: o.fs,
      drift: o.drift,
      durationMs: o.dur,
    });
  });

  const decoys: { t: number; l: number; fs: number }[] = [
    { t: 8, l: 6, fs: 34 },
    { t: 10, l: 78, fs: 36 },
    { t: 22, l: 4, fs: 32 },
    { t: 16, l: 88, fs: 34 },
  ];
  decoys.forEach((d, i) => {
    clouds.push({
      id: `decoy-${i}`,
      top: `${d.t}%`,
      left: `${d.l}%`,
      fontSize: d.fs,
      drift: 10 + i * 2,
      durationMs: 10000 + i * 400,
    });
  });

  return { moonTop, moonLeft, clouds };
}

function CloudToClear({
  item,
  cleared,
  onClear,
}: {
  item: CloudItem;
  cleared: boolean;
  onClear: (id: string) => void;
}) {
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!cleared) {
      fade.setValue(1);
      scale.setValue(1);
    }
  }, [cleared, fade, scale]);

  const dismiss = () => {
    if (cleared) {
      return;
    }
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.25,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => onClear(item.id));
  };

  if (cleared) {
    return null;
  }

  return (
    <Pressable
      style={[styles.cloudHit, { top: item.top, left: item.left }]}
      onPress={dismiss}
      accessibilityRole="button"
      accessibilityLabel="Cloud — tap to blow away"
      hitSlop={10}>
      <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
        <DriftingCloud
          emoji="☁️"
          fontSize={item.fontSize}
          top={0}
          left={0}
          drift={item.drift}
          durationMs={item.durationMs}
        />
      </Animated.View>
    </Pressable>
  );
}

export function MoonsightScreen({ navigation }: Props) {
  const [round, setRound] = useState(0);
  const [clearedIds, setClearedIds] = useState<Set<string>>(new Set());
  const [won, setWon] = useState(false);

  const night = useMemo(() => generateNight(round), [round]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopBundledSound();
      };
    }, []),
  );

  const goHome = useCallback(() => {
    stopBundledSound();
    navigation.navigate('Home');
  }, [navigation]);

  const onCloudClear = useCallback((id: string) => {
    setClearedIds((prev) => new Set([...prev, id]));
  }, []);

  const onMoonPress = useCallback(() => {
    if (won) {
      return;
    }
    if (clearedIds.size < night.clouds.length) {
      return;
    }
    setWon(true);
    playSuccessSound();
    speak('You found the moon!').catch(() => {});
  }, [won, clearedIds.size, night.clouds.length]);

  const playAgain = useCallback(() => {
    setWon(false);
    setClearedIds(new Set());
    setRound((r) => r + 1);
  }, []);

  const moonTopPct = `${Math.round(night.moonTop)}%` as `${number}%`;
  const moonLeftPct = `${Math.round(night.moonLeft)}%` as `${number}%`;
  const allCloudsGone = clearedIds.size >= night.clouds.length;

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
        <Text style={styles.title}>Moonsight</Text>
      </View>
      <Text style={styles.hint}>
        Tap the clouds to clear the sky, then tap the moon.
      </Text>

      <View style={styles.scene}>
        <View style={styles.sky}>
          {STARS.map((st, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  top: st.top,
                  left: st.left,
                  width: st.s,
                  height: st.s,
                  borderRadius: st.s / 2,
                },
              ]}
            />
          ))}

          <Pressable
            onPress={onMoonPress}
            style={[
              styles.moonHit,
              { top: moonTopPct, left: moonLeftPct },
              allCloudsGone ? styles.moonHitOnTop : styles.moonHitBehind,
            ]}
            disabled={!allCloudsGone || won}
            accessibilityRole="button"
            accessibilityLabel={
              allCloudsGone ? 'Moon — tap when you see it' : 'Moon hidden behind clouds'
            }
            hitSlop={12}>
            <Text
              style={[
                styles.moonEmoji,
                allCloudsGone && styles.moonRevealed,
                won && styles.moonEmojiWin,
              ]}>
              🌕
            </Text>
          </Pressable>

          {night.clouds.map((c) => (
            <CloudToClear
              key={c.id}
              item={c}
              cleared={clearedIds.has(c.id)}
              onClear={onCloudClear}
            />
          ))}
        </View>

        <GroundSilhouettes />
      </View>

      {won ? (
        <View style={styles.winBar}>
          <Text style={styles.winTxt}>Moon found!</Text>
          <Pressable
            style={({ pressed }) => [styles.againBtn, pressed && styles.againPressed]}
            onPress={playAgain}
            accessibilityRole="button"
            accessibilityLabel="Play Moonsight again">
            <Text style={styles.againTxt}>Again</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1520' },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  homeChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  homeChipTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
  },
  hint: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.72)',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  scene: { flex: 1 },
  sky: {
    flex: 3,
    backgroundColor: '#0a1628',
    borderBottomWidth: 3,
    borderColor: 'rgba(20,35,55,0.9)',
    position: 'relative',
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.92)',
    zIndex: 0,
  },
  moonHit: {
    position: 'absolute',
    marginLeft: -26,
    marginTop: -26,
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonHitBehind: { zIndex: 2 },
  moonHitOnTop: { zIndex: 8 },
  moonEmoji: {
    fontSize: 56,
    opacity: 0.22,
  },
  moonRevealed: {
    opacity: 0.92,
  },
  moonEmojiWin: {
    opacity: 1,
  },
  cloudHit: {
    position: 'absolute',
    zIndex: 5,
  },
  ground: {
    flex: 1.15,
    backgroundColor: '#050a10',
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
  },
  silhouetteRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xs,
    opacity: 0.92,
  },
  silhouette: { fontSize: 52, marginHorizontal: -2 },
  winBar: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  winTxt: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
  },
  againBtn: {
    backgroundColor: colors.playOrange,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.playOrangeDark,
  },
  againPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  againTxt: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
});

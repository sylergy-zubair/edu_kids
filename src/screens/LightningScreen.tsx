import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  type DimensionValue,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DriftingCloud } from '../components/DriftingCloud';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { playThunderSound, stopBundledSound } from '../services/sounds';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Lightning'>;

type CloudSpec = {
  id: string;
  fontSize: number;
  top: `${number}%`;
  left: `${number}%`;
  drift: number;
  durationMs: number;
  /** Where the bolt appears (night sky), roughly under the cloud */
  boltTop: `${number}%`;
  boltLeft: `${number}%`;
};

const CLOUDS: CloudSpec[] = [
  {
    id: 'c1',
    fontSize: 48,
    top: '6%',
    left: '4%',
    drift: 20,
    durationMs: 11000,
    boltTop: '20%',
    boltLeft: '10%',
  },
  {
    id: 'c2',
    fontSize: 40,
    top: '10%',
    left: '38%',
    drift: 14,
    durationMs: 9500,
    boltTop: '24%',
    boltLeft: '44%',
  },
  {
    id: 'c3',
    fontSize: 36,
    top: '5%',
    left: '68%',
    drift: 16,
    durationMs: 12000,
    boltTop: '18%',
    boltLeft: '74%',
  },
  {
    id: 'c4',
    fontSize: 44,
    top: '18%',
    left: '18%',
    drift: 12,
    durationMs: 10500,
    boltTop: '32%',
    boltLeft: '24%',
  },
  {
    id: 'c5',
    fontSize: 34,
    top: '16%',
    left: '52%',
    drift: 18,
    durationMs: 8800,
    boltTop: '30%',
    boltLeft: '58%',
  },
  {
    id: 'c6',
    fontSize: 38,
    top: '22%',
    left: '82%',
    drift: 10,
    durationMs: 13200,
    boltTop: '36%',
    boltLeft: '86%',
  },
];

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

type RainSpec = {
  left: DimensionValue;
  delay: number;
  duration: number;
  height: number;
  opacity: number;
};

const RAIN_SPECS: RainSpec[] = Array.from({ length: 34 }, (_, i) => ({
  left: `${((i * 19 + (i % 13) * 11) % 94) + 2}%` as DimensionValue,
  delay: (i * 83) % 2200,
  duration: 720 + (i % 9) * 85,
  height: 6 + (i % 6) * 2.5,
  opacity: 0.26 + (i % 5) * 0.11,
}));

function RainStrip({ spec, skyHeight }: { spec: RainSpec; skyHeight: number }) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (skyHeight < 40) {
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(spec.delay),
        Animated.timing(y, {
          toValue: 1,
          duration: spec.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [spec.delay, spec.duration, skyHeight, y]);

  const translateY = y.interpolate({
    inputRange: [0, 1],
    outputRange: [-(spec.height + 12), skyHeight < 40 ? 200 : skyHeight + 28],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.rainDrop,
        {
          left: spec.left,
          height: spec.height,
          opacity: spec.opacity,
          transform: [{ rotate: '11deg' }, { translateY }],
        },
      ]}
    />
  );
}

function FallingRain({ skyHeight }: { skyHeight: number }) {
  return (
    <>
      {RAIN_SPECS.map((spec, i) => (
        <RainStrip key={i} spec={spec} skyHeight={skyHeight} />
      ))}
    </>
  );
}

export function LightningScreen({ navigation }: Props) {
  const [strikeCloudId, setStrikeCloudId] = useState<string | null>(null);
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const boltOpacity = useRef(new Animated.Value(0)).current;
  const boltScale = useRef(new Animated.Value(0.6)).current;

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

  const runFlash = useCallback(() => {
    flashOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(flashOpacity, {
        toValue: 0.42,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(flashOpacity, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [flashOpacity]);

  const onCloudPress = useCallback(
    (id: string) => {
      stopBundledSound();
      playThunderSound();
      setStrikeCloudId(id);
      runFlash();
      boltOpacity.setValue(1);
      boltScale.setValue(0.55);
      Animated.parallel([
        Animated.timing(boltOpacity, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(boltScale, {
          toValue: 1.15,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setStrikeCloudId(null);
        }
      });
    },
    [boltOpacity, boltScale, runFlash],
  );

  const strikeLayout = strikeCloudId
    ? CLOUDS.find((c) => c.id === strikeCloudId)
    : undefined;

  const [skyHeight, setSkyHeight] = useState(280);
  const onSkyLayout = useCallback((e: LayoutChangeEvent) => {
    setSkyHeight(e.nativeEvent.layout.height);
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      

      <View style={styles.scene}>
        <View style={styles.sky} onLayout={onSkyLayout}>
          <Animated.View
            pointerEvents="none"
            style={[styles.flash, { opacity: flashOpacity }]}>
            <View style={styles.flashFill} />
          </Animated.View>

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

          <View style={styles.rainLayer} pointerEvents="none">
            <FallingRain skyHeight={skyHeight} />
          </View>

          {strikeLayout ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.boltWrap,
                {
                  top: strikeLayout.boltTop,
                  left: strikeLayout.boltLeft,
                  opacity: boltOpacity,
                  transform: [{ scale: boltScale }, { rotate: '-12deg' }],
                },
              ]}>
              <Text style={styles.bolt}>⚡</Text>
            </Animated.View>
          ) : null}

          {CLOUDS.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.cloudHit, { top: c.top, left: c.left }]}
              onPress={() => onCloudPress(c.id)}
              accessibilityRole="button"
              accessibilityLabel="Cloud, tap for lightning"
              hitSlop={16}>
              <DriftingCloud
                emoji="☁️"
                fontSize={c.fontSize}
                top={0}
                left={0}
                drift={c.drift}
                durationMs={c.durationMs}
              />
            </Pressable>
          ))}
        </View>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1520' },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  homeChip: {
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
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    marginRight: 72,
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
  flash: {
    ...StyleSheet.absoluteFill,
    zIndex: 30,
  },
  flashFill: {
    flex: 1,
    backgroundColor: '#eef6ff',
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.92)',
    zIndex: 0,
  },
  rainLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    overflow: 'hidden',
  },
  rainDrop: {
    position: 'absolute',
    top: 0,
    width: 2,
    marginLeft: -1,
    borderRadius: 1,
    backgroundColor: 'rgba(190, 220, 255, 0.65)',
  },
  boltWrap: {
    position: 'absolute',
    zIndex: 15,
    marginLeft: -28,
    marginTop: -36,
  },
  bolt: {
    fontSize: 72,
    textShadowColor: 'rgba(180,220,255,0.95)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
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
});

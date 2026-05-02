import React, { useCallback, useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DriftingCloud } from '../components/DriftingCloud';
import { MascotBob } from '../components/MascotBob';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { clearAllProgress, getDailyPathIndex } from '../services/storage';
import { speak } from '../services/tts';
import { colors, radii, spacing } from '../theme/playgroundTheme';
import { DAILY_ACTIVITIES } from '../content/activities';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [pathStep, setPathStep] = React.useState(0);
  const playPulse = useRef(new Animated.Value(1)).current;
  const sunSpin = useRef(new Animated.Value(0)).current;

  const refresh = useCallback(() => {
    getDailyPathIndex()
      .then((i) =>
        setPathStep(Math.min(i + 1, DAILY_ACTIVITIES.length)),
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', refresh);
    return unsub;
  }, [navigation, refresh]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(playPulse, {
          toValue: 1.035,
          duration: 720,
          useNativeDriver: true,
        }),
        Animated.timing(playPulse, {
          toValue: 1,
          duration: 720,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [playPulse]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sunSpin, {
        toValue: 1,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [sunSpin]);

  const sunRotate = sunSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.column}>
        <ScrollView
          style={styles.grassScroll}
          contentContainerStyle={styles.grassScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces>
          <View style={styles.sky}>
            <Animated.View
              style={[styles.sunWrap, { transform: [{ rotate: sunRotate }] }]}>
              <Text style={styles.sun}>☀️</Text>
            </Animated.View>
            <DriftingCloud
              emoji="☁️"
              fontSize={44}
              top={22}
              left="10%"
              drift={14}
              durationMs={11000}
            />
            <DriftingCloud
              emoji="☁️"
              fontSize={34}
              top={48}
              left="48%"
              drift={10}
              durationMs={9000}
            />
            <DriftingCloud
              emoji="☁️"
              fontSize={28}
              top={36}
              left="72%"
              drift={12}
              durationMs={13000}
            />
          </View>

          <View style={styles.grass}>

            <View style={styles.mascotRow}>
              <Pressable
                onPress={() => {
                  speak('Hello Hidayah').catch(() => {});
                }}
                accessibilityRole="button"
                accessibilityLabel="Friendly bear"
                hitSlop={12}>
                <MascotBob emoji="🐻" style={styles.mascot} delayMs={0} />
              </Pressable>
              <Pressable
                onPress={() => {
                  speak('How are you?').catch(() => {});
                }}
                accessibilityRole="button"
                accessibilityLabel="Friendly fox"
                hitSlop={12}>
                <MascotBob emoji="🦊" style={styles.mascot} delayMs={200} />
              </Pressable>
              <Pressable
                onPress={() => {
                  speak('Lets play a game').catch(() => {});
                }}
                accessibilityRole="button"
                accessibilityLabel="Friendly frog"
                hitSlop={12}>
                <MascotBob emoji="🐸" style={styles.mascot} delayMs={400} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => navigation.navigate('Play', { mode: 'daily' })}
              accessibilityRole="button"
              accessibilityLabel="Play today">
              <Animated.View
                style={[
                  styles.playBtn,
                  { transform: [{ scale: playPulse }] },
                ]}>
                <Text style={styles.playLead}>🎪</Text>
                <Text style={styles.playTxt}>Let’s play!</Text>
              </Animated.View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.freeBtn, pressed && styles.pressed]}
              onPress={() => navigation.navigate('Play', { mode: 'free' })}
              accessibilityRole="button"
              accessibilityLabel="Free play">
              <Text style={styles.freeTxt}>🎲  Free mix</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.animalBtn, pressed && styles.pressed]}
              onPress={() => navigation.navigate('AnimalSounds')}
              accessibilityRole="button"
              accessibilityLabel="Animal sounds">
              <Text style={styles.animalTxt}>🔊  Animal sounds</Text>
            </Pressable>

            <View style={styles.progressPill}>
              <Text style={styles.progressLbl}>
                ⭐ {pathStep} / {DAILY_ACTIVITIES.length}
              </Text>
            </View>

            <Pressable
              style={styles.resetBtn}
              onLongPress={() => {
                Alert.alert(
                  'Reset progress?',
                  'Clears daily path for testing.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: () => {
                        clearAllProgress().then(refresh).catch(() => {});
                      },
                    },
                  ],
                );
              }}>
              <Text style={styles.resetHint}>Hold to reset (grown-ups)</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.skyBottom },
  column: { flex: 1 },
  grassScroll: { flex: 1 },
  grassScrollContent: { flexGrow: 1 },
  sky: {
    flex: 0.4,
    flexShrink: 1,
    minHeight: 100,
    backgroundColor: colors.skyTop,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
  },
  sunWrap: {
    position: 'absolute',
    top: 12,
    right: '8%' as const,
  },
  sun: { fontSize: 56 },
  grass: {
    flexGrow: 1,
    backgroundColor: colors.grass,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 4,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  mascotRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginVertical: spacing.xs,
    alignItems: 'flex-end',
  },
  mascot: { fontSize: 56 },
  propsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    opacity: 0.95,
  },
  propEmoji: { fontSize: 24 },
  playBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.red,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: radii.pill,
    borderWidth: 4,
    borderColor: colors.white,
    maxWidth: '100%',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  playLead: { fontSize: 36, marginBottom: 2 },
  playTxt: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
  },
  playSub: {
    marginTop: 2,
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.92)',
  },
  freeBtn: {
    backgroundColor: colors.lavender,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 1.5,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: '#7C5FC7',
    maxWidth: '100%',
    width: '100%',
    alignItems: 'center',
  },
  freeTxt: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  animalBtn: {
    backgroundColor: colors.playOrange,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 1.5,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.playOrangeDark,
    maxWidth: '100%',
    width: '100%',
    alignItems: 'center',
  },
  animalTxt: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  progressPill: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  progressLbl: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  resetBtn: { marginTop: spacing.lg, padding: spacing.sm },
  resetHint: { fontSize: 13, color: 'rgba(45,52,54,0.5)', fontWeight: '600' },
});

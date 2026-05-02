import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
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

type HomeGameTile = {
  id: string;
  title: string;
  emoji: string;
  backgroundColor: string;
  borderColor: string;
  accessibilityLabel: string;
  pulse?: boolean;
  onPress: () => void;
};

export function HomeScreen({ navigation }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const [pathStep, setPathStep] = React.useState(0);
  const playPulse = useRef(new Animated.Value(1)).current;
  const sunSpin = useRef(new Animated.Value(0)).current;

  const gameTiles = useMemo<HomeGameTile[]>(
    () => [
      {
        id: 'daily',
        title: 'Mix n Match',
        emoji: '🎨',
        backgroundColor: colors.red,
        borderColor: colors.white,
        accessibilityLabel: 'Play today',
        pulse: true,
        onPress: () => navigation.navigate('Play'),
      },
      {
        id: 'animal',
        title: 'Animal sounds',
        emoji: '🦁',
        backgroundColor: colors.playOrange,
        borderColor: colors.playOrangeDark,
        accessibilityLabel: 'Animal sounds',
        onPress: () => navigation.navigate('AnimalSounds'),
      },
      {
        id: 'obstacle',
        title: 'Obstacle',
        emoji: '🪨',
        backgroundColor: colors.pink,
        borderColor: '#E85A8C',
        accessibilityLabel: 'Obstacle jump game',
        onPress: () => navigation.navigate('ObstacleGame'),
      },
      {
        id: 'mosquito',
        title: 'Mosquito Hunt',
        emoji: '🦟',
        backgroundColor: '#2D8B6F',
        borderColor: '#1F6B55',
        accessibilityLabel: 'Mosquito hunt game',
        onPress: () => navigation.navigate('MosquitoHunt'),
      },
      {
        id: 'cleanup',
        title: 'Clean-up',
        emoji: '📦',
        backgroundColor: '#C19A6B',
        borderColor: '#9A7349',
        accessibilityLabel: 'Clean up toys game',
        onPress: () => navigation.navigate('CleanUp'),
      },
      {
        id: 'baking',
        title: 'Baking time',
        emoji: '🍕',
        backgroundColor: '#E88A3D',
        borderColor: '#C96E28',
        accessibilityLabel: 'Baking time pizza game',
        onPress: () => navigation.navigate('BakingTime'),
      },
      {
        id: 'jigsaw',
        title: 'Jigsaw',
        emoji: '🧩',
        backgroundColor: '#7C4DFF',
        borderColor: '#5E35B1',
        accessibilityLabel: 'Jigsaw puzzle game',
        onPress: () => navigation.navigate('JigsawPuzzle'),
      },
    ],
    [navigation],
  );

  const grassPad = spacing.xl * 2;
  const gridGap = spacing.sm;
  const tileWidth = (windowWidth - grassPad - gridGap) / 2;

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
                  speak('Bye bye Hidayah').catch(() => {});
                }}
                accessibilityRole="button"
                accessibilityLabel="Friendly frog"
                hitSlop={12}>
                <MascotBob emoji="🐸" style={styles.mascot} delayMs={400} />
              </Pressable>
            </View>

            <View style={[styles.gamesGrid, { gap: gridGap }]}>
              {gameTiles.map((tile) => {
                const inner = (
                  <View
                    style={[
                      styles.gameTile,
                      {
                        width: tileWidth,
                        backgroundColor: tile.backgroundColor,
                        borderColor: tile.borderColor,
                      },
                    ]}>
                    <Text style={styles.gameTileEmoji}>{tile.emoji}</Text>
                    <Text style={styles.gameTileTitle}>{tile.title}</Text>
                  </View>
                );

                return (
                  <Pressable
                    key={tile.id}
                    style={({ pressed }) => [
                      pressed && styles.gameTilePressed,
                    ]}
                    onPress={tile.onPress}
                    accessibilityRole="button"
                    accessibilityLabel={tile.accessibilityLabel}>
                    {tile.pulse ? (
                      <Animated.View
                        style={{ transform: [{ scale: playPulse }] }}>
                        {inner}
                      </Animated.View>
                    ) : (
                      inner
                    )}
                  </Pressable>
                );
              })}
            </View>

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
  gamesGrid: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
  },
  gameTile: {
    borderRadius: radii.card,
    borderWidth: 3,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 118,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  gameTileEmoji: {
    fontSize: 44,
    marginBottom: spacing.xs,
  },
  gameTileTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  gameTilePressed: { opacity: 0.92, transform: [{ scale: 0.97 }] },
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

import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { clearAllProgress, getDailyPathIndex } from '../services/storage';
import { colors, radii, spacing } from '../theme/playgroundTheme';
import { DAILY_ACTIVITIES } from '../content/activities';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [pathStep, setPathStep] = useState(0);

  const refresh = useCallback(() => {
    void getDailyPathIndex().then((i) =>
      setPathStep(Math.min(i + 1, DAILY_ACTIVITIES.length)),
    );
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', refresh);
    return unsub;
  }, [navigation, refresh]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.column}>
        
        <ScrollView
          style={styles.grassScroll}
          contentContainerStyle={styles.grassScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces>
          <View style={styles.grass}>
          <View style={styles.sky}>
          <Text style={styles.sun}>☀️</Text>
          <Text style={styles.cloud}>☁️</Text>
          <Text style={styles.cloud2}>☁️</Text>
        </View>
            <Text style={styles.title}>Playground</Text>
            <View style={styles.mascotRow}>
              <Text style={styles.mascot}>🐻</Text>
              <Text style={styles.mascot}>🦊</Text>
              <Text style={styles.mascot}>🐸</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
              onPress={() => navigation.navigate('Play', { mode: 'daily' })}>
              <Text style={styles.playTxt}>▶ Play today</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.freeBtn, pressed && styles.pressed]}
              onPress={() => navigation.navigate('Play', { mode: 'free' })}>
              <Text style={styles.freeTxt}>Free play</Text>
            </Pressable>

            <Text style={styles.progressLbl}>
              Today: activity {pathStep} / {DAILY_ACTIVITIES.length}
            </Text>

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
                        void clearAllProgress().then(refresh);
                      },
                    },
                  ],
                );
              }}>
              <Text style={styles.resetHint}>Hold to reset progress</Text>
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
    flex: 0.42,
    flexShrink: 1,
    minHeight: 100,
    backgroundColor: colors.skyTop,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.lg,
  },
  sun: { fontSize: 56, position: 'absolute', top: 18, right: 36 },
  cloud: { fontSize: 44, position: 'absolute', top: 28, left: '18%' },
  cloud2: { fontSize: 36, position: 'absolute', top: 52, left: '52%' },
  grass: {
    flexGrow: 1,
    backgroundColor: colors.grass,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  mascotRow: { flexDirection: 'row', gap: spacing.lg, marginVertical: spacing.sm },
  mascot: { fontSize: 52 },
  playBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.playOrange,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: radii.pill,
    borderWidth: 4,
    borderColor: colors.playOrangeDark,
    maxWidth: '100%',
    width: '100%',
    alignItems: 'center',
  },
  playTxt: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.white,
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
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  progressLbl: {
    marginTop: spacing.sm,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  resetBtn: { marginTop: spacing.xl, padding: spacing.sm },
  resetHint: { fontSize: 13, color: 'rgba(45,52,54,0.55)', fontWeight: '600' },
});

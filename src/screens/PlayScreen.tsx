import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityBody } from '../activities/ActivityBody';
import {
  ALL_ACTIVITIES,
  DAILY_ACTIVITIES,
  shuffledCopy,
} from '../content/activities';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  addCompletedId,
  bumpAttempt,
  getDailyPathIndex,
  setDailyPathIndex,
} from '../services/storage';
import { playSuccessSound, playTransitionSound } from '../services/sounds';
import { speak, stopSpeak } from '../services/tts';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Play'>;

export function PlayScreen({ navigation, route }: Props) {
  const mode = route.params.mode;
  const pathList = useMemo(
    () =>
      mode === 'daily' ? DAILY_ACTIVITIES : shuffledCopy(ALL_ACTIVITIES),
    [mode],
  );

  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (mode === 'daily') {
      void getDailyPathIndex().then((i) =>
        setIndex(Math.min(Math.max(0, i), pathList.length - 1)),
      );
    } else {
      setIndex(0);
    }
  }, [mode, pathList.length]);

  const activity = pathList[index];

  useEffect(() => {
    stopSpeak();
    if (!activity) {
      return;
    }
    const t = setTimeout(() => {
      void speak(activity.instruction);
    }, 200);
    return () => clearTimeout(t);
  }, [activity]);

  const goHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const handleCorrect = useCallback(async () => {
    if (!activity) {
      return;
    }
    playSuccessSound();
    setLocked(true);
    await addCompletedId(activity.id);
    await bumpAttempt(activity.id);

    const next = index + 1;
    if (next >= pathList.length) {
      playTransitionSound();
      if (mode === 'daily') {
        await setDailyPathIndex(0);
      }
      void speak('You finished!');
      setTimeout(() => {
        setLocked(false);
        goHome();
      }, 2200);
      return;
    }

    playTransitionSound();
    if (mode === 'daily') {
      await setDailyPathIndex(next);
    }
    setTimeout(() => {
      setIndex(next);
      setLocked(false);
    }, 1050);
  }, [activity, goHome, index, mode, pathList.length]);

  const handleWrong = useCallback(async () => {
    if (!activity) {
      return;
    }
    await bumpAttempt(activity.id);
  }, [activity]);

  if (!activity) {
    return (
      <SafeAreaView style={styles.safeEmpty} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.warn}>No activities</Text>
          <Pressable style={styles.backBtn} onPress={goHome}>
            <Text style={styles.backTxt}>Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.homeChip} onPress={goHome}>
          <Text style={styles.homeChipTxt}>🏠 Home</Text>
        </Pressable>
        <Text style={styles.stepLbl}>
          {index + 1} / {pathList.length}
        </Text>
      </View>

      <ScrollView
        style={styles.cardScroll}
        contentContainerStyle={styles.cardScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces>
        <View style={styles.card}>
          <ActivityBody
            key={activity.id}
            activity={activity}
            locked={locked}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.skyBottom,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  safeEmpty: { flex: 1, backgroundColor: colors.skyBottom },
  cardScroll: { flex: 1 },
  cardScrollContent: { flexGrow: 1, paddingBottom: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  stepLbl: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  card: {
    flexGrow: 1,
    minHeight: 200,
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  warn: { fontSize: 20, color: colors.text },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.playOrange,
    borderRadius: radii.pill,
  },
  backTxt: { color: colors.white, fontWeight: '800', fontSize: 18 },
});

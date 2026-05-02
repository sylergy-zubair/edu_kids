import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { playAnimalSound, stopBundledSound } from '../services/sounds';
import { stopSpeak } from '../services/tts';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'AnimalSounds'>;

const ANIMALS: { emoji: string; label: string; sound: string }[] = [
  { emoji: '🐶', label: 'Dog', sound: 'anim_dog' },
  { emoji: '🐱', label: 'Cat', sound: 'anim_cat' },
  { emoji: '🐮', label: 'Cow', sound: 'anim_cow' },
  { emoji: '🦆', label: 'Duck', sound: 'anim_duck' },
  { emoji: '🐑', label: 'Sheep', sound: 'anim_sheep' },
  { emoji: '🐴', label: 'Horse', sound: 'anim_horse' },
  { emoji: '🦁', label: 'Lion', sound: 'anim_lion' },
  { emoji: '🐸', label: 'Frog', sound: 'anim_frog' },
  { emoji: '🐔', label: 'Chicken', sound: 'anim_bird' },
];

export function AnimalSoundsScreen({ navigation }: Props) {
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopBundledSound();
        stopSpeak().catch(() => {});
      };
    }, []),
  );

  const goHome = useCallback(() => {
    stopBundledSound();
    stopSpeak().catch(() => {});
    navigation.navigate('Home');
  }, [navigation]);

  const onAnimal = useCallback((sound: string) => {
    stopSpeak().catch(() => {});
    playAnimalSound(sound);
  }, []);

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
        <Text style={styles.title}>Animal sounds</Text>
      </View>

      <Text style={styles.hint}>Tap an animal to hear it.</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {ANIMALS.map((a) => (
          <Pressable
            key={a.label}
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
            onPress={() => onAnimal(a.sound)}
            accessibilityRole="button"
            accessibilityLabel={`${a.label} sound`}>
            <Text style={styles.emoji}>{a.emoji}</Text>
            <Text style={styles.tileLbl}>{a.label}</Text>
          </Pressable>
        ))}
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
    textAlign: 'right',
  },
  hint: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(45,52,54,0.75)',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  scroll: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  tile: {
    width: '42%',
    maxWidth: 160,
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tilePressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  emoji: { fontSize: 52, marginBottom: spacing.xs },
  tileLbl: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
});

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/playgroundTheme';

const SURPRISE_EMOJIS = ['🐵', '🦄', '🐙', '🦖', '🎈', '🍌', '🤪'];

/**
 * Success overlay: scale + sparkle + optional silly surprise (PRD 3.2).
 * Keeps total celebration short so the next activity is not delayed.
 */
export function CelebrationBurst({ visible }: { visible: boolean }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const partyY = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const twA = useRef(new Animated.Value(0.4)).current;
  const twB = useRef(new Animated.Value(0.7)).current;
  const [surprise, setSurprise] = useState<string | null>(null);

  const sparkles = useMemo(
    () => [
      { label: '✨', top: '12%', left: '8%' },
      { label: '⭐', top: '18%', right: '10%' },
      { label: '✨', top: '62%', left: '6%' },
      { label: '⭐', top: '58%', right: '8%' },
    ],
    [],
  );

  useEffect(() => {
    if (!visible) {
      scale.setValue(0);
      opacity.setValue(0);
      partyY.setValue(0);
      spin.setValue(0);
      setSurprise(null);
      return;
    }

    const showSurprise = Math.random() < 0.34;
    setSurprise(
      showSurprise
        ? SURPRISE_EMOJIS[Math.floor(Math.random() * SURPRISE_EMOJIS.length)]!
        : null,
    );

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(partyY, {
          toValue: -14,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(partyY, {
          toValue: 0,
          friction: 4,
          tension: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    if (showSurprise) {
      spin.setValue(0);
      Animated.timing(spin, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }).start();
    }

    const twinkle = Animated.loop(
      Animated.stagger(120, [
        Animated.sequence([
          Animated.timing(twA, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(twA, {
            toValue: 0.35,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(twB, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(twB, {
            toValue: 0.4,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    twinkle.start();
    return () => twinkle.stop();
  }, [visible, opacity, partyY, scale, spin, twA, twB]);

  if (!visible) {
    return null;
  }

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.overlay]}
      pointerEvents="none">
      {sparkles.map((s, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.sparkleFloat,
            {
              top: s.top as `${number}%`,
              left: 'left' in s ? (s.left as `${number}%`) : undefined,
              right: 'right' in s ? (s.right as `${number}%`) : undefined,
              opacity: i % 2 === 0 ? twA : twB,
            },
          ]}>
          {s.label}
        </Animated.Text>
      ))}
      <Animated.View
        style={[
          styles.burst,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}>
        <Animated.View style={{ transform: [{ translateY: partyY }] }}>
          <Text style={styles.emoji}>🎉</Text>
        </Animated.View>
        {surprise ? (
          <Animated.Text style={[styles.surprise, { transform: [{ rotate }] }]}>
            {surprise}
          </Animated.Text>
        ) : null}
        <Text style={styles.spark}>✨⭐✨</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  sparkleFloat: {
    position: 'absolute',
    fontSize: 26,
  },
  burst: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 28,
    backgroundColor: colors.card,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  emoji: {
    fontSize: 72,
  },
  surprise: {
    fontSize: 46,
    marginTop: 6,
  },
  spark: {
    marginTop: 8,
    fontSize: 28,
  },
});

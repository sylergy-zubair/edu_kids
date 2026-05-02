import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/playgroundTheme';

export function CelebrationBurst({ visible }: { visible: boolean }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [silly, setSilly] = useState(false);

  useEffect(() => {
    if (!visible) {
      scale.setValue(0);
      opacity.setValue(0);
      return;
    }
    setSilly(Math.random() > 0.78);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, scale]);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.overlay]}
      pointerEvents="none">
      <Animated.View
        style={[
          styles.burst,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}>
        <Text style={styles.emoji}>🎉</Text>
        {silly ? <Text style={styles.silly}>🐵</Text> : null}
        <Text style={styles.spark}>✨⭐✨</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  burst: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 28,
    backgroundColor: colors.card,
  },
  emoji: {
    fontSize: 72,
  },
  silly: {
    fontSize: 48,
    marginTop: 4,
  },
  spark: {
    marginTop: 8,
    fontSize: 28,
  },
});

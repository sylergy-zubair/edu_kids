import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, Text, TextStyle } from 'react-native';

/** Gentle idle bob for home-screen mascots (PRD 3.1 / visual-style motion mood). */
export function MascotBob({
  emoji,
  style,
  delayMs = 0,
}: {
  emoji: string;
  style?: StyleProp<TextStyle>;
  delayMs?: number;
}) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bob = Animated.loop(
      Animated.sequence([
        Animated.delay(delayMs),
        Animated.timing(y, {
          toValue: -7,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );
    bob.start();
    return () => bob.stop();
  }, [delayMs, y]);

  return (
    <Animated.View style={{ transform: [{ translateY: y }] }}>
      <Text style={style}>{emoji}</Text>
    </Animated.View>
  );
}

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  type DimensionValue,
  StyleSheet,
  Text,
} from 'react-native';

type Props = {
  emoji: string;
  fontSize: number;
  top: DimensionValue;
  left: DimensionValue;
  /** Horizontal drift amplitude (px). */
  drift: number;
  durationMs: number;
};

/** Slow horizontal drift for sky decoration (PRD 3.1 playground feel). */
export function DriftingCloud({
  emoji,
  fontSize,
  top,
  left,
  drift,
  durationMs,
}: Props) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, {
          toValue: 1,
          duration: durationMs,
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: 0,
          duration: durationMs,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [durationMs, x]);

  const translateX = x.interpolate({
    inputRange: [0, 1],
    outputRange: [-drift, drift],
  });

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          top,
          left,
          transform: [{ translateX }],
        },
      ]}>
      <Text style={{ fontSize }}>{emoji}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
  },
});

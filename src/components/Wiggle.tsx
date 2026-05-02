import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

export function Wiggle({
  active,
  children,
  style,
}: {
  active: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      x.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, {
          toValue: 5,
          duration: 85,
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: -5,
          duration: 85,
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: 0,
          duration: 85,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 },
    );
    loop.start();
    return () => loop.stop();
  }, [active, x]);

  return (
    <Animated.View style={[style, { transform: [{ translateX: x }] }]}>
      {children}
    </Animated.View>
  );
}

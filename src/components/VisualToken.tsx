import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { VisualToken } from '../content/activities';
import type { ShapeName } from '../content/contentMap';

const SHAPE_TEXT: Record<ShapeName, string> = {
  circle: '●',
  square: '■',
  triangle: '▲',
  star: '★',
  heart: '♥',
};

export function VisualTokenView({
  token,
  size = 76,
}: {
  token: VisualToken;
  size?: number;
}) {
  if (token.emoji) {
    return (
      <View style={[styles.wrap, { width: size + 16, height: size + 16 }]}>
        <Text style={{ fontSize: size * 0.82 }}>{token.emoji}</Text>
      </View>
    );
  }

  const bg = token.colorHex ?? '#CCCCCC';
  const shape = token.shape ?? 'circle';

  if (shape === 'circle') {
    return (
      <View
        style={[
          styles.fill,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bg,
          },
        ]}
      />
    );
  }

  if (shape === 'square') {
    return (
      <View
        style={[
          styles.fill,
          {
            width: size * 0.92,
            height: size * 0.92,
            borderRadius: size * 0.14,
            backgroundColor: bg,
          },
        ]}
      />
    );
  }

  return (
    <View style={[styles.wrap, { width: size + 8, height: size + 8 }]}>
      <Text style={[styles.shapeGlyph, { color: bg, fontSize: size * 0.85 }]}>
        {SHAPE_TEXT[shape]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {},
  shapeGlyph: {
    fontWeight: '900',
    textAlign: 'center',
  },
});

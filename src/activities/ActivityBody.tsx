import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { VisualToken } from '../content/activities';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ActivitySpec } from '../content/activities';
import { ROUTINES } from '../content/contentMap';
import { CelebrationBurst } from '../components/CelebrationBurst';
import { VisualTokenView } from '../components/VisualToken';
import { Wiggle } from '../components/Wiggle';
import { speak } from '../services/tts';
import { playRetrySound, playTapSound } from '../services/sounds';
import { colors, radii, spacing } from '../theme/playgroundTheme';

type Props = {
  activity: ActivitySpec;
  locked: boolean;
  onCorrect: () => void;
  onWrong: () => void;
};

export function ActivityBody({
  activity,
  locked,
  onCorrect,
  onWrong,
}: Props) {
  const [wiggleId, setWiggleId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (activity.kind === 'matchSound') {
      const t = setTimeout(() => {
        void speak(activity.spokenWord);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [activity]);

  const flashWrong = useCallback(
    (id: string) => {
      if (locked) {
        return;
      }
      setWiggleId(id);
      setTimeout(() => setWiggleId(null), 420);
      playRetrySound();
      void speak('Try again');
      onWrong();
    },
    [locked, onWrong],
  );

  const celebrateThenHold = useCallback(() => {
    setCelebrate(true);
    onCorrect();
    setTimeout(() => setCelebrate(false), 900);
  }, [onCorrect]);

  switch (activity.kind) {
    case 'tap':
    case 'findFeature':
      return (
        <>
          <ChoiceGrid
            choices={activity.choices}
            locked={locked}
            wiggleId={wiggleId}
            onPick={(id) => {
              playTapSound();
              if (id === activity.answerId) {
                void speak('Great job!');
                celebrateThenHold();
              } else {
                flashWrong(id);
              }
            }}
          />
          <CelebrationBurst visible={celebrate} />
        </>
      );
    case 'match':
      return (
        <>
          <View style={styles.rowCenter}>
            <Text style={styles.hint}>Same as</Text>
            <VisualTokenView token={activity.target} size={84} />
          </View>
          <ChoiceGrid
            choices={activity.choices}
            locked={locked}
            wiggleId={wiggleId}
            onPick={(id) => {
              playTapSound();
              if (id === activity.answerId) {
                void speak('You matched it!');
                celebrateThenHold();
              } else {
                flashWrong(id);
              }
            }}
          />
          <CelebrationBurst visible={celebrate} />
        </>
      );
    case 'matchSound':
      return (
        <>
          <ReplayRow
            locked={locked}
            onReplay={() => {
              playTapSound();
              void speak(activity.spokenWord);
            }}
          />
          <ChoiceGrid
            choices={activity.choices}
            locked={locked}
            wiggleId={wiggleId}
            onPick={(id) => {
              playTapSound();
              if (id === activity.answerId) {
                void speak('Yes!');
                celebrateThenHold();
              } else {
                flashWrong(id);
              }
            }}
          />
          <CelebrationBurst visible={celebrate} />
        </>
      );
    case 'count':
      return (
        <CountPick
          activity={activity}
          locked={locked}
          celebrate={celebrate}
          onCelebrate={() => setCelebrate(true)}
          onEndCelebrate={() => setCelebrate(false)}
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      );
    case 'drag':
      return (
        <DragToZone
          activity={activity}
          locked={locked}
          celebrate={celebrate}
          onCorrect={() => {
            void speak('Nice!');
            setCelebrate(true);
            onCorrect();
            setTimeout(() => setCelebrate(false), 900);
          }}
          onWrong={() => {
            playRetrySound();
            void speak('Almost. Try again.');
            onWrong();
          }}
        />
      );
    case 'routine':
      return (
        <>
          <RoutineSteps
            activity={activity}
            locked={locked}
            onDone={() => {
              void speak('All done!');
              setCelebrate(true);
              onCorrect();
              setTimeout(() => setCelebrate(false), 900);
            }}
          />
          <CelebrationBurst visible={celebrate} />
        </>
      );
    default:
      return null;
  }
}

function ChoiceGrid({
  choices,
  locked,
  wiggleId,
  onPick,
}: {
  choices: VisualToken[];
  locked: boolean;
  wiggleId: string | null;
  onPick: (id: string) => void;
}) {
  return (
    <View style={styles.grid}>
      {choices.map((c) => (
        <Wiggle key={c.id} active={wiggleId === c.id}>
          <Pressable
            disabled={locked}
            onPress={() => onPick(c.id)}
            style={({ pressed }) => [
              styles.choiceBubble,
              pressed && styles.choicePressed,
            ]}>
            <VisualTokenView token={c} size={72} />
          </Pressable>
        </Wiggle>
      ))}
    </View>
  );
}

function ReplayRow({
  locked,
  onReplay,
}: {
  locked: boolean;
  onReplay: () => void;
}) {
  return (
    <Pressable
      disabled={locked}
      onPress={onReplay}
      style={styles.replay}>
      <Text style={styles.replayText}>🔊 Hear again</Text>
    </Pressable>
  );
}

function CountPick({
  activity,
  locked,
  celebrate,
  onCelebrate,
  onEndCelebrate,
  onCorrect,
  onWrong,
}: {
  activity: Extract<ActivitySpec, { kind: 'count' }>;
  locked: boolean;
  celebrate: boolean;
  onCelebrate: () => void;
  onEndCelebrate: () => void;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const pile = Array.from({ length: activity.count }, (_, i) => (
    <Text key={i} style={styles.pileEmoji}>
      {activity.pileEmoji}
    </Text>
  ));

  return (
    <>
      <View style={styles.pileRow}>{pile}</View>
      <View style={styles.numRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            disabled={locked}
            onPress={() => {
              playTapSound();
              if (n === activity.answerValue) {
                void speak(String(n));
                onCelebrate();
                onCorrect();
                setTimeout(() => {
                  onEndCelebrate();
                  void speak('You counted!');
                }, 550);
              } else {
                playRetrySound();
                void speak('Count again.');
                onWrong();
              }
            }}
            style={({ pressed }) => [
              styles.numBtn,
              pressed && styles.choicePressed,
            ]}>
            <Text style={styles.numBtnText}>{n}</Text>
          </Pressable>
        ))}
      </View>
      <CelebrationBurst visible={celebrate} />
    </>
  );
}

function DragToZone({
  activity,
  locked,
  celebrate,
  onCorrect,
  onWrong,
}: {
  activity: Extract<ActivitySpec, { kind: 'drag' }>;
  locked: boolean;
  celebrate: boolean;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const zoneRef = useRef<View>(null);

  const reset = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 6,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !locked,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (e) => {
        const mx = e.nativeEvent.pageX;
        const my = e.nativeEvent.pageY;
        pan.flattenOffset();
        zoneRef.current?.measureInWindow((zx, zy, zw, zh) => {
          const pad = 56;
          const hit =
            mx >= zx - pad &&
            mx <= zx + zw + pad &&
            my >= zy - pad &&
            my <= zy + zh + pad;
          if (hit) {
            onCorrect();
          } else {
            onWrong();
            reset();
          }
        });
      },
    }),
  ).current;

  return (
    <View style={styles.dragStage}>
      <View style={styles.dragRow}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.draggable,
            { transform: pan.getTranslateTransform() },
          ]}>
          <VisualTokenView token={activity.item} size={80} />
        </Animated.View>
        <View />
      </View>
      <View ref={zoneRef} style={styles.dropZone} collapsable={false}>
        <Text style={styles.dropEmoji}>📦</Text>
        <Text style={styles.dropHint}>{activity.zoneLabel}</Text>
      </View>
      <CelebrationBurst visible={celebrate} />
    </View>
  );
}

function RoutineSteps({
  activity,
  locked,
  onDone,
}: {
  activity: Extract<ActivitySpec, { kind: 'routine' }>;
  locked: boolean;
  onDone: () => void;
}) {
  const routine = ROUTINES.find((r) => r.id === activity.routineId)!;
  const [step, setStep] = useState(0);

  useEffect(() => {
    void speak(routine.steps[0].spoken);
  }, [routine]);

  const cur = routine.steps[step];

  const advance = () => {
    playTapSound();
    if (step >= routine.steps.length - 1) {
      onDone();
      return;
    }
    const next = step + 1;
    setStep(next);
    void speak(routine.steps[next].spoken);
  };

  return (
    <View style={styles.routineWrap}>
      <View style={styles.routineSteps}>
        {routine.steps.map((s, i) => (
          <View
            key={s.id}
            style={[
              styles.routineChip,
              i === step && styles.routineChipHot,
              i < step && styles.routineChipDone,
            ]}>
            <Text style={styles.routineEmoji}>{s.emoji}</Text>
            <Text style={styles.routineLbl}>{s.shortPrompt}</Text>
          </View>
        ))}
      </View>
      <Pressable
        disabled={locked}
        onPress={advance}
        style={styles.routineBig}>
        <Text style={styles.routineBigTxt}>Touch: {cur.shortPrompt}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  choiceBubble: {
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.choice,
    borderWidth: 3,
    borderColor: 'rgba(45,52,54,0.08)',
    minWidth: 108,
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choicePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  replay: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.lavender,
    borderRadius: radii.pill,
    marginBottom: spacing.sm,
  },
  replayText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  pileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginVertical: spacing.md,
    minHeight: 72,
  },
  pileEmoji: {
    fontSize: 52,
  },
  numRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  numBtn: {
    minWidth: 64,
    minHeight: 64,
    borderRadius: 18,
    backgroundColor: colors.playOrange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.playOrangeDark,
  },
  numBtnText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
  },
  dragStage: {
    flex: 1,
    minHeight: 268,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  dragRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 120,
  },
  draggable: {
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 2,
    borderColor: 'rgba(45,52,54,0.12)',
  },
  dropZone: {
    width: 220,
    height: 140,
    borderRadius: radii.card,
    borderWidth: 4,
    borderStyle: 'dashed',
    borderColor: colors.lavender,
    backgroundColor: 'rgba(155,126,222,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropEmoji: {
    fontSize: 44,
  },
  dropHint: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  routineWrap: {
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  routineSteps: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  routineChip: {
    padding: spacing.sm,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 88,
  },
  routineChipHot: {
    borderColor: colors.playOrange,
    transform: [{ scale: 1.06 }],
  },
  routineChipDone: {
    opacity: 0.55,
  },
  routineEmoji: {
    fontSize: 36,
  },
  routineLbl: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  routineBig: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.playOrange,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.playOrangeDark,
    minHeight: 72,
    justifyContent: 'center',
  },
  routineBigTxt: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
  },
});

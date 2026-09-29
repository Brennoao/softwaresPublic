import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@/components/ui/Icon';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BACKGROUND_GRADIENTS } from '@/constants/theme';
import { useGenderTheme } from '@/context/gender-theme';

type Sparkle = { top: number; left: number; size: number; duration: number; delay: number };

const SPARKLES: Sparkle[] = [
  { top: 0.12, left: 0.15, size: 18, duration: 2600, delay: 0 },
  { top: 0.22, left: 0.78, size: 14, duration: 3200, delay: 400 },
  { top: 0.68, left: 0.2, size: 16, duration: 2800, delay: 800 },
  { top: 0.78, left: 0.7, size: 20, duration: 3000, delay: 200 },
  { top: 0.45, left: 0.5, size: 12, duration: 2400, delay: 600 },
  { top: 0.35, left: 0.1, size: 10, duration: 3400, delay: 1000 },
];

function TwinklingSparkle({ sparkle, color }: { sparkle: Sparkle; color: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      sparkle.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: sparkle.duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: sparkle.duration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 0.25 + progress.value * 0.75,
    transform: [{ scale: 0.8 + progress.value * 0.4 }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: `${sparkle.top * 100}%`,
          left: `${sparkle.left * 100}%`,
        },
        style,
      ]}>
      <Icon name="sparkles" size={sparkle.size} tintColor={color} />
    </Animated.View>
  );
}

export function MagicBackground() {
  const { gender, colors } = useGenderTheme();

  return (
    <LinearGradient
      colors={BACKGROUND_GRADIENTS[gender]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
      pointerEvents="none">
      {SPARKLES.map((sparkle, index) => (
        <TwinklingSparkle key={index} sparkle={sparkle} color={colors.primary} />
      ))}
    </LinearGradient>
  );
}

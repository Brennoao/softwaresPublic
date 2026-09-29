import { useRouter } from 'expo-router';
import { type SFSymbol } from "expo-symbols";
import { Icon } from "@/components/ui/Icon";
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ProfileButtonProps = {
  icon?: SFSymbol;
};

export function ProfileButton({ icon = 'person.crop.circle' }: ProfileButtonProps) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={() => router.push('/settings')}
      onPressIn={() => {
        scale.value = withSpring(0.82, { damping: 12, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      hitSlop={8}
      className="mr-4 p-1"
      style={style}
      accessibilityRole="button">
      <Icon name={icon} size={26} tintColor="#ffffff" />
    </AnimatedPressable>
  );
}

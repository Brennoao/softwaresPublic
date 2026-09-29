import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { MagicBackground } from '@/components/magic-background';
import { PulsingIcon } from '@/components/pulsing-icon';
import { getBiometricAuthEnabled } from '@/lib/biometric-auth-storage';

type Status = 'checking' | 'prompting' | 'locked' | 'unlocked';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('checking');
  const shakeX = useSharedValue(0);

  const authenticate = useCallback(async () => {
    setStatus('prompting');
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para entrar no app',
    });

    if (result.success) {
      setStatus('unlocked');
      return;
    }

    setStatus('locked');
    shakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  }, [shakeX]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setStatus('unlocked');
      return;
    }

    (async () => {
      const enabled = await getBiometricAuthEnabled();
      if (!enabled) {
        setStatus('unlocked');
        return;
      }
      await authenticate();
    })();
  }, [authenticate]);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  if (status === 'unlocked') {
    return <>{children}</>;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <MagicBackground />

      <Animated.View style={shakeStyle} className="items-center gap-4">
        <PulsingIcon name="lock.shield.fill" size={56} color="#E91E8C" />
        <Text className="text-base font-medium text-[#2B0A22] dark:text-white">
          {status === 'prompting' ? 'Autenticando...' : 'Autenticação necessária'}
        </Text>
        {status === 'locked' && (
          <Pressable onPress={authenticate} className="rounded-lg bg-primary px-6 py-2">
            <Text className="font-semibold text-white">Tentar novamente</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

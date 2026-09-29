import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';

import { getBiometricAuthEnabled, setBiometricAuthEnabled } from '@/lib/biometric-auth-storage';

export type BiometricKind = 'facial' | 'fingerprint' | 'none';

export function useBiometricAuthSetting() {
  const [loading, setLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(false);
  const [kind, setKind] = useState<BiometricKind>('none');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [hasHardware, isEnrolled, types, storedEnabled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
        getBiometricAuthEnabled(),
      ]);

      if (cancelled) return;

      const hasFacial = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      const hasFingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

      setIsSupported(hasHardware && isEnrolled);
      setKind(hasFacial ? 'facial' : hasFingerprint ? 'fingerprint' : 'none');
      setEnabled(storedEnabled);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(async (next: boolean) => {
    if (next) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme para ativar',
      });
      if (!result.success) return false;
    }

    await setBiometricAuthEnabled(next);
    setEnabled(next);
    return true;
  }, []);

  return { loading, isSupported, kind, enabled, toggle };
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@mobileapp_boilerplate/onboarding_completed';

export function useOnboardingStatus() {
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!alive) return;
      setCompleted(raw === 'true');
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setCompleted(true);
  }, []);

  const resetOnboarding = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setCompleted(false);
  }, []);

  return { completed, hydrated, completeOnboarding, resetOnboarding };
}

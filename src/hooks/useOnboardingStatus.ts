import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

const STORAGE_KEY = '@mobileapp_boilerplate/onboarding_completed';

export function useOnboardingStatus() {
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Re-read when this screen is focused so the gate at `/` picks up `completeOnboarding()` after
  // AsyncStorage updates (the root index route can stay mounted under the stack with stale state).
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
        if (cancelled) return;
        setCompleted(raw === 'true');
        setHydrated(true);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

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

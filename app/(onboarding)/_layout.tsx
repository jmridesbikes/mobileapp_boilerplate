import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: 'Welcome' }}>
      <Stack.Screen name="index" options={{ title: 'Step 1' }} />
      <Stack.Screen name="step-two" options={{ title: 'Step 2' }} />
    </Stack>
  );
}

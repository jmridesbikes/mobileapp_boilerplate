import { Stack } from 'expo-router';

export default function PaywallLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: 'Subscribe' }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

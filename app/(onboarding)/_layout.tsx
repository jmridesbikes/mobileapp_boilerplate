import { Stack } from 'expo-router';

/**
 * Routes from files (index, step-two, sso, revenuecat). Do not duplicate Stack.Screen names — conflicts with file routes.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: true,
        title:
          route.name === 'index'
            ? 'Step 1'
            : route.name === 'step-two'
              ? 'Step 2'
              : route.name === 'sso'
                ? 'Sign in'
                : route.name === 'revenuecat'
                  ? 'Step 4'
                  : 'Welcome',
      })}
    />
  );
}

import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import Colors from '@/src/constants/colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';

export default function AppLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const activeTint = Colors[colorScheme].tint;
  const inactiveTint = Colors[colorScheme].tabIconDefault;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <SymbolView
              name="house.fill"
              tintColor={focused ? activeTint : inactiveTint}
              type="hierarchical"
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <SymbolView
              name="gearshape.fill"
              tintColor={focused ? activeTint : inactiveTint}
              type="hierarchical"
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

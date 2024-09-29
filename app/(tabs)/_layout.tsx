import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'transparent',
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          position: 'absolute',
          bottom: 0,
          height: 80, // Increase the overall height of the tab bar
          paddingBottom: 10, // Add some padding at the bottom for devices with home indicators
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          ...theme.fonts.regular,
          fontSize: 14, // Increase font size
          marginBottom: 8, // Increase bottom margin
        },
        headerShown: false,
        tabBarItemStyle: {
          paddingVertical: 8, // Adjust vertical padding
        },
        tabBarIconStyle: {
          marginBottom: 4, // Adjust bottom margin for icon
        },
      }}>
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={28} name="calendar" color={color} /> // Increase icon size
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={28} name="cog" color={color} /> // Increase icon size
          ),
        }}
      />
    </Tabs>
  );
}

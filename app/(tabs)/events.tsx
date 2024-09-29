import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Surface } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';

export default function EventsScreen() {
  const theme = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Your events content will go here */}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Add padding to the bottom to prevent content from being hidden behind the tab bar
  },
});

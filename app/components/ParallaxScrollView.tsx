import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

interface ParallaxScrollViewProps {
  headerBackgroundColor: { light: string; dark: string };
  headerImage: React.ReactNode;
  children: React.ReactNode;
}

export function ParallaxScrollView({ headerBackgroundColor, headerImage, children }: ParallaxScrollViewProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: headerBackgroundColor.light }]}>
        {headerImage}
      </View>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

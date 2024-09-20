import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EventCardProps {
  event: {
    summary: string;
    start: { dateTime: string };
    end: { dateTime: string };
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.summary}</Text>
      <Text style={styles.time}>
        {new Date(event.start.dateTime).toLocaleTimeString()} - {new Date(event.end.dateTime).toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

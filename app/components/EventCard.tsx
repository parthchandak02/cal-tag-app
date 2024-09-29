import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';

interface EventCardProps {
  event: {
    summary: string;
    description?: string;
    start: { dateTime: string };
    end: { dateTime: string };
  };
}

export function EventCard({ event }: EventCardProps) {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const { width } = useWindowDimensions();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const renderDescription = () => {
    if (!event.description) return null;

    const source = {
      html: isExpanded ? event.description : `${event.description.slice(0, 100)}...`
    };

    return (
      <>
        <RenderHtml
          contentWidth={width - 32} // Adjust based on your padding
          source={source}
          tagsStyles={{
            body: { color: theme.colors.textSecondary, fontSize: 14 },
            a: { color: theme.colors.primary },
          }}
        />
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.expandButton}>
          <Ionicons
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{event.summary}</Text>
      <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
        {formatDate(event.start.dateTime)} - {formatDate(event.end.dateTime)}
      </Text>
      {renderDescription()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    marginBottom: 8,
  },
  expandButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
});

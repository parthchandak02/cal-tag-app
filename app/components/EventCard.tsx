import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import { CountdownTimer } from './CountdownTimer';

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
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const extractAlarmTags = (description: string) => {
    const alarmRegex = /alarm(\d+)/g;
    const matches = description.match(alarmRegex);
    return matches ? matches.map(match => ({
      label: match,
      minutes: parseInt(match.replace('alarm', ''), 10)
    })) : [];
  };

  const alarmTags = event.description ? extractAlarmTags(event.description) : [];

  const renderDescription = () => {
    if (!event.description) return null;

    const source = {
      html: isExpanded ? event.description : `${event.description.slice(0, 100)}...`
    };

    return (
      <>
        <RenderHtml
          contentWidth={width - 32}
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{event.summary}</Text>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
            {formatDate(event.start.dateTime)}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
            {formatDate(event.end.dateTime)}
          </Text>
        </View>
      </View>
      {alarmTags.map((tag, index) => (
        <CountdownTimer
          key={index}
          targetDate={new Date(new Date(event.start.dateTime).getTime() - tag.minutes * 60000)}
          label={tag.label}
        />
      ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 14,
  },
  expandButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
});

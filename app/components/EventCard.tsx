import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { CountdownTimer } from './CountdownTimer';
import HTML from 'react-native-render-html';

interface EventCardProps {
  event: CalendarEvent;
  alarmTags: AlarmTag[];
}

export function EventCard({ event, alarmTags }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const timeRange = `${formatTime(event.start.dateTime)} - ${formatTime(event.end.dateTime)}`;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2} ellipsizeMode="tail">
              {event.summary}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.time, { color: theme.colors.textSecondary }]}>{timeRange}</Text>
            <IconButton
              icon={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              onPress={() => setExpanded(!expanded)}
              color={theme.colors.primary}
            />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.countdownContainer}>
        {alarmTags.map((tag, index) => (
          <CountdownTimer
            key={index}
            targetDate={tag.targetDate}
            label={`Alarm ${tag.minutes} min before`}
            onFinish={() => {}}  // Pass an empty function as onFinish
          />
        ))}
      </View>

      {expanded && event.description && (
        <View style={styles.description}>
          <HTML
            source={{ html: event.description }}
            contentWidth={300}
            baseStyle={{
              color: theme.colors.text,
              fontSize: 14,
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    marginRight: 8,
  },
  countdownContainer: {
    padding: 16,
    paddingTop: 0,
  },
  description: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

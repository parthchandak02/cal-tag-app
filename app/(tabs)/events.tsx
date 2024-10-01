import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import { Surface, Text, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { EventCard } from '@/components/EventCard';
import { useGoogleAuth, fetchEventsWithPagination, CalendarEvent } from '@/utils/googleCalendar';
import { NotificationService, EventNotification } from '@/utils/NotificationService';
import CountdownTimer from '@/components/CountdownTimer';
import { scheduleNotification } from '@/utils/NotificationManager';
import { setNotificationHandler } from '@/utils/NotificationManager';

interface GroupedEvents {
  title: string;
  data: CalendarEvent[];
}

interface AlarmTag {
  minutes: number;
  targetDate: Date;
}

export default function EventsScreen() {
  const theme = useTheme();
  const { promptAsync, response } = useGoogleAuth();
  const [events, setEvents] = useState<GroupedEvents[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snoozedAlarms, setSnoozedAlarms] = useState<EventNotification[]>([]);

  const loadEvents = async (pageToken: string | null = null) => {
    if (response?.type !== 'success' || !response.authentication) return;

    setLoading(true);
    try {
      const result = await fetchEventsWithPagination(response.authentication.accessToken, pageToken);
      const newEvents = result.items;

      setEvents((prevEvents) => {
        const allEvents = pageToken
          ? [...prevEvents.flatMap(group => group.data), ...newEvents]
          : newEvents;

        // Remove duplicates based on event ID
        const uniqueEvents = allEvents.filter((event, index, self) =>
          index === self.findIndex((t) => t.id === event.id)
        );

        // Schedule notifications for new events
        newEvents.forEach(scheduleEventNotifications);

        return groupEventsByDate(uniqueEvents);
      });

      setNextPageToken(result.nextPageToken || null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const groupEventsByDate = (events: CalendarEvent[]): GroupedEvents[] => {
    const grouped = events.reduce((acc: { [key: string]: CalendarEvent[] }, event) => {
      const date = new Date(event.start.dateTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, events]: [string, CalendarEvent[]]) => ({
        title: date,
        data: events.sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime())
      }))
      .sort((a, b) => new Date(a.data[0].start.dateTime).getTime() - new Date(b.data[0].start.dateTime).getTime());
  };

  const parseAlarmTags = (description: string, startDateTime: string): AlarmTag[] => {
    const alarmRegex = /alarm(\d+)/g;
    const matches = description.match(alarmRegex);
    const startDate = new Date(startDateTime);

    if (!matches) return [];

    return matches.map(match => {
      const minutes = parseInt(match.replace('alarm', ''), 10);
      const targetDate = new Date(startDate.getTime() - minutes * 60000);
      return { minutes, targetDate };
    }).sort((a, b) => b.minutes - a.minutes);
  };

  useEffect(() => {
    if (response?.type === 'success') {
      loadEvents();
    }
  }, [response]);

  useEffect(() => {
    NotificationService.handleNotificationOpened((notification) => {
      const data = notification.notification.additionalData;
      if (data.eventId) {
        if (notification.action.actionId === 'snooze') {
          handleSnooze(data.eventId, data.eventName);
        } else if (notification.action.actionId === 'stop') {
          handleStopAlarm(data.eventId);
        }
      }
    });

    NotificationService.handleNotificationReceived((notification) => {
      // Handle in-app notification if needed
    });

    setNotificationHandler((notification) => {
      const data = notification.notification.additionalData;
      if (data.eventId) {
        if (notification.action.actionId === 'snooze') {
          handleSnooze(data.eventId, data.eventName);
        } else if (notification.action.actionId === 'stop') {
          handleStopAlarm(data.eventId);
        }
      }
    });
  }, []);

  const scheduleEventNotifications = (event: CalendarEvent) => {
    const alarmTags = ['alarm3', 'alarm5']; // Add more tags as needed
    alarmTags.forEach(tag => {
      if (event[tag]) {
        const alarmTime = new Date(event.start.dateTime);
        alarmTime.setMinutes(alarmTime.getMinutes() - parseInt(tag.replace('alarm', '')));

        NotificationService.scheduleNotification({
          eventId: event.id,
          eventName: event.summary,
          alarmTime: alarmTime,
        });
      }
    });
  };

  const handleSnooze = (eventId: string, eventName: string) => {
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const snoozedAlarm: EventNotification = {
      eventId,
      eventName,
      alarmTime: snoozeTime,
    };
    setSnoozedAlarms(prev => [...prev, snoozedAlarm]);
    NotificationService.scheduleNotification(snoozedAlarm);
  };

  const handleStopAlarm = (eventId: string) => {
    setSnoozedAlarms(prev => prev.filter(alarm => alarm.eventId !== eventId));
  };

  const handleLoadMore = () => {
    if (nextPageToken) {
      loadEvents(nextPageToken);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadEvents().finally(() => setRefreshing(false));
  };

  const renderEventCard = (event: CalendarEvent) => {
    const alarmTags = parseAlarmTags(event.description || '', event.start.dateTime);
    return <EventCard key={event.id} event={event} alarmTags={alarmTags} />;
  };

  // Render snoozed alarms
  const renderSnoozedAlarms = () => (
    <View style={styles.snoozedAlarmsContainer}>
      {snoozedAlarms.map(alarm => (
        <View key={alarm.eventId} style={styles.snoozedAlarmItem}>
          <Text>{alarm.eventName}</Text>
          <CountdownTimer
            targetDate={alarm.alarmTime}
            onComplete={() => handleSnooze(alarm.eventId, alarm.eventName)}
          />
        </View>
      ))}
    </View>
  );

  const handleAlarmTrigger = useCallback((event: CalendarEvent, alarmTag: AlarmTag) => {
    scheduleNotification(
      'Event Alarm',
      `${event.summary} is starting in ${alarmTag.minutes} minutes!`,
      new Date(event.start.dateTime)
    );
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.content}>
        {renderSnoozedAlarms()}
        {response?.type !== 'success' ? (
          <View style={styles.centerContainer}>
            <Button
              mode="contained"
              onPress={() => promptAsync()}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              color={theme.colors.primary}
            >
              Connect Google Calendar
            </Button>
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={({ item }) => (
              <>
                <Text style={[styles.sectionHeaderText, { color: theme.colors.text }]}>{item.title}</Text>
                {item.data.map((event) => renderEventCard(event))}
              </>
            )}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            contentContainerStyle={styles.listContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListFooterComponent={
              loading ? (
                <ActivityIndicator animating={true} color={theme.colors.primary} />
              ) : null
            }
          />
        )}
      </Surface>
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{
          label: 'Retry',
          onPress: () => loadEvents(),
        }}>
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  snoozedAlarmsContainer: {
    // Add styles for snoozed alarms container
  },
  snoozedAlarmItem: {
    // Add styles for snoozed alarm item
  },
});

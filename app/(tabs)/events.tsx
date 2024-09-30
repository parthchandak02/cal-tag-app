import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import { Surface, Text, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';
import { EventCard } from '@/components/EventCard';
import { useGoogleAuth, fetchEventsWithPagination } from '@/utils/googleCalendar';

interface Event {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

interface GroupedEvents {
  title: string;
  data: Event[];
}

export default function EventsScreen() {
  const theme = useTheme();
  const { promptAsync, response } = useGoogleAuth();
  const [events, setEvents] = useState<GroupedEvents[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

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

        return groupEventsByDate(uniqueEvents);
      });

      setNextPageToken(result.nextPageToken || null);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupEventsByDate = (events: Event[]): GroupedEvents[] => {
    const grouped = events.reduce((acc: { [key: string]: Event[] }, event) => {
      const date = new Date(event.start.dateTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, events]) => ({
        title: date,
        data: events.sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime())
      }))
      .sort((a, b) => new Date(a.data[0].start.dateTime).getTime() - new Date(b.data[0].start.dateTime).getTime());
  };

  useEffect(() => {
    if (response?.type === 'success') {
      loadEvents();
    }
  }, [response]);

  const renderItem = ({ item }: { item: Event }) => <EventCard event={item} />;

  const renderSectionHeader = ({ section: { title } }: { section: GroupedEvents }) => (
    <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.sectionHeaderText, { color: theme.colors.text }]}>{title}</Text>
    </View>
  );

  const handleLoadMore = () => {
    if (nextPageToken) {
      loadEvents(nextPageToken);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.content}>
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
                {renderSectionHeader({ section: item })}
                {item.data.map((event) => (
                  <EventCard key={`${event.id}-${event.start.dateTime}`} event={event} />
                ))}
              </>
            )}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            contentContainerStyle={styles.content}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : null
            }
          />
        )}
      </Surface>
      {/* ... existing Snackbar code ... */}
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
  sectionHeader: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

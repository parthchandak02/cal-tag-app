import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { Surface, Text } from 'react-native-paper';
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

export default function EventsScreen() {
  const theme = useTheme();
  const { promptAsync, response } = useGoogleAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const loadEvents = async (pageToken?: string) => {
    if (response?.type !== 'success' || !response.authentication) return;

    setLoading(true);
    try {
      const result = await fetchEventsWithPagination(response.authentication.accessToken, pageToken);
      if (pageToken) {
        setEvents((prevEvents) => [...prevEvents, ...result.items]);
      } else {
        setEvents(result.items);
      }
      setNextPageToken(result.nextPageToken || null);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      loadEvents();
    }
  }, [response]);

  const handleLoadMore = () => {
    if (nextPageToken) {
      loadEvents(nextPageToken);
    }
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {response?.type !== 'success' ? (
        <Button title="Connect Google Calendar" onPress={() => promptAsync()} />
      ) : (
        <FlatList
          data={events}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Use both id and index
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
});

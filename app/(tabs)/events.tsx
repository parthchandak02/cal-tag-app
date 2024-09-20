import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';

import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { EventCard } from '../../components/EventCard';
import { signIn, fetchEvents } from '../../utils/googleCalendar';

interface Event {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function loadEvents() {
      await signIn();
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    }
    loadEvents();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('../../assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Events</ThemedText>
      </ThemedView>
      <FlatList
        data={events}
        renderItem={({ item }) => <EventCard event={item} />}
        keyExtractor={(item) => item.id || item.summary}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

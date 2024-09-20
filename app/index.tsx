import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_CLIENT_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

interface CalendarEvent {
  summary: string;
  // Add other properties as needed
}

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly']
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchCalendarEvents(authentication?.accessToken);
    }
  }, [response]);

  const fetchCalendarEvents = async (accessToken: string | undefined) => {
    if (!accessToken) return;
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    const data = await response.json();
    setEvents(data.items);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Sign in with Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
      {events.map((event, index) => (
        <Text key={index}>{event.summary}</Text>
      ))}
    </View>
  );
}

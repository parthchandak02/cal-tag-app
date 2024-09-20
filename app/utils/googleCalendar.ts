import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Initialize Google Sign-In
GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  iosClientId: Platform.OS === 'ios' ? process.env.IOS_CLIENT_ID : undefined,
  webClientId: process.env.WEB_CLIENT_ID,
});

export async function signIn() {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    await AsyncStorage.setItem('user', JSON.stringify(userInfo));
    return userInfo;
  } catch (error) {
    console.error('Error during sign in:', error);
  }
}

export async function fetchEvents() {
  try {
    const token = await GoogleSignin.getTokens();
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );
    const result = await response.json();
    return result.items;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

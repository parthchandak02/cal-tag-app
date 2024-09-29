import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

const isExpoGo = Constants.appOwnership === 'expo';

const scopes = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar.readonly'
];

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: WEB_CLIENT_ID, // Use WEB_CLIENT_ID for Android as well
    scopes: scopes,
    // The useProxy option is not needed, so we've removed it
  });

  return { request, response, promptAsync };
};

export async function signIn() {
  // Remove the configureGoogleSignIn call as it's not defined
  if (isExpoGo) {
    // Mock sign-in for Expo Go
    const mockUser = { id: 'mock-user-id', name: 'Mock User', email: 'mock@example.com' };
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  } else {
    // Implement actual sign-in logic here
    // This is where you'd use the Google Sign-In SDK
    throw new Error("Actual sign-in not implemented");
  }
}

export async function fetchEventsWithPagination(accessToken: string, pageToken?: string) {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&timeMax=${sevenDaysFromNow.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=10${pageToken ? `&pageToken=${pageToken}` : ''}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
}

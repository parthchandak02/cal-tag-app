import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

let isGoogleSignInConfigured = false;

// Mock data for development
const mockEvents = [
  {
    id: '1',
    summary: 'Mock Event 1',
    start: { dateTime: new Date().toISOString() },
    end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
  },
  {
    id: '2',
    summary: 'Mock Event 2',
    start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
    end: { dateTime: new Date(Date.now() + 90000000).toISOString() },
  },
];

export function configureGoogleSignIn() {
  if (!isGoogleSignInConfigured) {
    if (!isExpoGo) {
      // Actual configuration code here
      // This won't run in Expo Go, so it's safe to keep
      // GoogleSignin.configure({
      //   scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      //   iosClientId: Platform.OS === 'ios' ? IOS_CLIENT_ID : undefined,
      //   webClientId: WEB_CLIENT_ID,
      // });
    }
    isGoogleSignInConfigured = true;
  }
}

export async function signIn() {
  if (!isGoogleSignInConfigured) {
    configureGoogleSignIn();
  }

  if (isExpoGo) {
    // Mock sign-in for Expo Go
    const mockUser = { id: 'mock-user-id', name: 'Mock User', email: 'mock@example.com' };
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  } else {
    // Actual sign-in code here
    // This won't run in Expo Go, so it's safe to keep
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   await AsyncStorage.setItem('user', JSON.stringify(userInfo));
    //   return userInfo;
    // } catch (error) {
    //   console.error("Error during sign in:", error);
    //   return null;
    // }
  }
}

export async function fetchEvents() {
  if (!isGoogleSignInConfigured) {
    configureGoogleSignIn();
  }

  if (isExpoGo) {
    // Return mock events for Expo Go
    return mockEvents;
  } else {
    // Actual event fetching code here
    // This won't run in Expo Go, so it's safe to keep
    // try {
    //   const token = await GoogleSignin.getTokens();
    //   const response = await fetch(
    //     `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token.accessToken}`,
    //       },
    //     }
    //   );
    //   const result = await response.json();
    //   return result.items;
    // } catch (error) {
    //   console.error("Error fetching events:", error);
    //   return [];
    // }
  }
}

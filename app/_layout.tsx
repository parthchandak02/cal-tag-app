import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationLightTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import * as Notifications from 'expo-notifications';
import OneSignal from 'react-native-onesignal';
import { ONESIGNAL_APP_ID } from '@env';
import Constants from 'expo-constants';
import { initializeNotifications } from '@/utils/NotificationManager';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const { DarkTheme, LightTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  reactNavigationLight: NavigationLightTheme,
});

export default function RootLayout() {
  const theme = useTheme();
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../assets/fonts/Montserrat-VariableFont_wght.ttf'),
    'Montserrat-Italic': require('../assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
  });

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (ONESIGNAL_APP_ID) {
      OneSignal.setAppId(ONESIGNAL_APP_ID);
      OneSignal.promptForPushNotificationsWithUserResponse();

      OneSignal.setNotificationOpenedHandler((notification) => {
        console.log("OneSignal: notification opened:", notification);
        // Handle the notification here (e.g., navigate to a specific screen)
      });

      OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
        console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
        const notification = notificationReceivedEvent.getNotification();
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      });
    } else {
      console.warn('OneSignal App ID is not set. Push notifications will not work.');
    }

    initializeNotifications();

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const paperTheme = {
    ...MD3DarkTheme,
    colors: theme.colors,
    fonts: {
      ...MD3DarkTheme.fonts,
      regular: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '500',
      },
      light: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '300',
      },
      thin: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '100',
      },
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}

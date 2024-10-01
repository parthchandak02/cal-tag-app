import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const NotificationManager = {
  initialize: async () => {
    if (Platform.OS !== 'web') {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
  },

  showNotification: async ({ title, body, data }: { title: string; body: string; data?: any }) => {
    if (Platform.OS === 'web') {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      }
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null,
      });
    }
  },

  addNotificationResponseReceivedListener: (callback: (response: Notifications.NotificationResponse) => void) => {
    if (Platform.OS !== 'web') {
      return Notifications.addNotificationResponseReceivedListener(callback);
    }
    return { remove: () => {} };
  },
};

import OneSignal from 'react-native-onesignal';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { ONESIGNAL_APP_ID } from '@env';

export async function initializeNotifications() {
  OneSignal.setAppId(ONESIGNAL_APP_ID);

  if (Platform.OS === 'ios') {
    OneSignal.promptForPushNotificationsWithUserResponse();
  }

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
}

export async function scheduleNotification(title: string, body: string, triggerTime: Date) {
  const currentTime = new Date();
  if (triggerTime > currentTime) {
    const secondsUntilTrigger = Math.floor((triggerTime.getTime() - currentTime.getTime()) / 1000);

    await OneSignal.postNotification({
      contents: {
        en: body,
      },
      heading: {
        en: title,
      },
      send_after: triggerTime.toISOString(),
      data: {
        customKey: 'customValue',
      },
      buttons: [
        { id: 'snooze', text: 'Snooze 5 min' },
        { id: 'stop', text: 'Stop Alarm' },
      ],
    });
  }
}

export function setNotificationHandler(handler: (notification: any) => void) {
  OneSignal.setNotificationOpenedHandler(handler);
}

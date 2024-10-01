import OneSignal from 'react-native-onesignal';
import { ONESIGNAL_APP_ID } from '@env';

export interface EventNotification {
  eventId: string;
  eventName: string;
  alarmTime: Date;
}

export const NotificationService = {
  initialize: () => {
    OneSignal.setAppId(ONESIGNAL_APP_ID);
    OneSignal.promptForPushNotificationsWithUserResponse();
  },

  scheduleNotification: async (notification: EventNotification) => {
    const currentTime = new Date();
    if (notification.alarmTime > currentTime) {
      const secondsUntilAlarm = Math.floor((notification.alarmTime.getTime() - currentTime.getTime()) / 1000);

      await OneSignal.postNotification({
        contents: {
          en: `Alarm for ${notification.eventName}`,
        },
        heading: {
          en: 'Event Reminder',
        },
        send_after: notification.alarmTime.toISOString(),
        data: {
          eventId: notification.eventId,
          eventName: notification.eventName,
        },
        buttons: [
          { id: 'snooze', text: 'Snooze 5 min' },
          { id: 'stop', text: 'Stop Alarm' },
        ],
      });
    }
  },

  handleNotificationOpened: (handler: (notification: any) => void) => {
    OneSignal.setNotificationOpenedHandler(handler);
  },

  handleNotificationReceived: (handler: (notification: any) => void) => {
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      const notification = notificationReceivedEvent.getNotification();
      handler(notification);
      notificationReceivedEvent.complete(notification);
    });
  },
};

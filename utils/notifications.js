// Notification utility for daily spiritual reminders
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage keys
const REMINDER_TIME_KEY = '@daily_reminder_time';
const REMINDER_ENABLED_KEY = '@daily_reminder_enabled';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule the daily spiritual reminder notification
export const scheduleDailyNotification = async (hour, minute) => {
  try {
    // Cancel any existing daily reminders first
    await cancelDailyNotification();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Cannot schedule notification - no permission');
      return false;
    }

    // Schedule the notification to repeat daily at the specified time
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Dhikr Reminder",
        body: "Your daily Quran verse, dua, and dhikr are ready",
        data: { type: 'daily_spiritual_reminder' },
        sound: true,
      },
      trigger: {
        type: 'daily',
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });

    // Save the time preference
    await AsyncStorage.setItem(REMINDER_TIME_KEY, JSON.stringify({ hour, minute }));
    await AsyncStorage.setItem(REMINDER_ENABLED_KEY, 'true');

    console.log(`Daily notification scheduled for ${hour}:${minute}, ID: ${notificationId}`);
    return true;
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
    return false;
  }
};

// Cancel the daily notification
export const cancelDailyNotification = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Get the saved reminder time
export const getSavedReminderTime = async () => {
  try {
    const timeJson = await AsyncStorage.getItem(REMINDER_TIME_KEY);
    if (timeJson) {
      return JSON.parse(timeJson);
    }
    // Default to 8:00 AM
    return { hour: 8, minute: 0 };
  } catch (error) {
    console.error('Error getting saved reminder time:', error);
    return { hour: 8, minute: 0 };
  }
};

// Check if reminders are enabled
export const isReminderEnabled = async () => {
  try {
    const enabled = await AsyncStorage.getItem(REMINDER_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking reminder status:', error);
    return false;
  }
};

// Disable reminders
export const disableReminder = async () => {
  try {
    await cancelDailyNotification();
    await AsyncStorage.setItem(REMINDER_ENABLED_KEY, 'false');
    console.log('Daily reminder disabled');
  } catch (error) {
    console.error('Error disabling reminder:', error);
  }
};

// Set up notification response handler
// Returns a function to remove the subscription
export const setupNotificationResponseHandler = (onNotificationTapped) => {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;

    if (data?.type === 'daily_spiritual_reminder') {
      console.log('Daily spiritual reminder notification tapped');
      onNotificationTapped(data);
    }
  });

  return () => {
    subscription.remove();
  };
};

// Storage key for dhikr session notification IDs
const DHIKR_NOTIFICATION_IDS_KEY = '@dhikr_notification_ids';

// Schedule per-session dhikr notifications (one per session time)
export const scheduleDhikrNotifications = async (sessions) => {
  try {
    await cancelDhikrNotifications();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    const notificationIds = [];
    for (let i = 0; i < sessions.length; i++) {
      const { hour, minute } = sessions[i];
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Dhikr Session ${i + 1}`,
          body: 'Time for your Quran verse, dua, and dhikr',
          data: { type: 'dhikr_session', sessionIndex: i },
          sound: true,
        },
        trigger: {
          type: 'daily',
          hour,
          minute,
          repeats: true,
        },
      });
      notificationIds.push(id);
    }

    await AsyncStorage.setItem(DHIKR_NOTIFICATION_IDS_KEY, JSON.stringify(notificationIds));
    console.log(`Dhikr notifications scheduled: ${notificationIds.length} sessions`);
    return true;
  } catch (error) {
    console.error('Error scheduling dhikr notifications:', error);
    return false;
  }
};

// Cancel dhikr notifications by their stored IDs
export const cancelDhikrNotifications = async () => {
  try {
    const idsJson = await AsyncStorage.getItem(DHIKR_NOTIFICATION_IDS_KEY);
    if (idsJson) {
      const ids = JSON.parse(idsJson);
      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
      }
      await AsyncStorage.removeItem(DHIKR_NOTIFICATION_IDS_KEY);
    }
  } catch (error) {
    console.error('Error cancelling dhikr notifications:', error);
  }
};

// Storage key for multi-session reminder notification IDs
const REMINDER_SESSION_IDS_KEY = '@reminder_session_ids';

// Schedule per-session reminder notifications (replaces single daily notification for multi-session)
export const scheduleMultipleReminderNotifications = async (sessions) => {
  try {
    await cancelMultipleReminderNotifications();
    await cancelDailyNotification();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    const notificationIds = [];
    for (let i = 0; i < sessions.length; i++) {
      const { hour, minute } = sessions[i];
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Dhikr Reminder',
          body: 'Your Quran verse, dua, and dhikr are ready',
          data: { type: 'daily_spiritual_reminder', sessionIndex: i },
          sound: true,
        },
        trigger: {
          type: 'daily',
          hour,
          minute,
          repeats: true,
        },
      });
      notificationIds.push(id);
    }

    await AsyncStorage.setItem(REMINDER_SESSION_IDS_KEY, JSON.stringify(notificationIds));
    console.log(`Multi-session reminder notifications scheduled: ${notificationIds.length}`);
    return true;
  } catch (error) {
    console.error('Error scheduling multi-session reminder notifications:', error);
    return false;
  }
};

// Cancel multi-session reminder notifications by stored IDs
export const cancelMultipleReminderNotifications = async () => {
  try {
    const idsJson = await AsyncStorage.getItem(REMINDER_SESSION_IDS_KEY);
    if (idsJson) {
      const ids = JSON.parse(idsJson);
      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
      }
      await AsyncStorage.removeItem(REMINDER_SESSION_IDS_KEY);
    }
  } catch (error) {
    console.error('Error cancelling multi-session reminder notifications:', error);
  }
};

// Format time for display (e.g., "8:00 AM")
export const formatTime = (hour, minute) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};

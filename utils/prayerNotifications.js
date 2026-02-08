// Prayer time notification service
// Schedules notifications for each of the 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const PRAYER_NOTIF_ENABLED_KEY = '@prayer_notifications_enabled';
const PRAYER_NOTIF_IDS_KEY = '@prayer_notification_ids';
const PRAYER_NOTIF_SCHEDULED_DATE_KEY = '@prayer_notifications_scheduled_date';

// Notification content for each prayer
const PRAYER_NOTIFICATION_CONTENT = {
  Fajr: {
    title: "🕌 Time for Fajr",
    body: "The dawn prayer awaits. Start your day with Allah."
  },
  Dhuhr: {
    title: "🕌 Time for Dhuhr",
    body: "It's time for the midday prayer. Take a break and connect with Allah."
  },
  Asr: {
    title: "🕌 Time for Asr",
    body: "The afternoon prayer is calling. Pause and remember Allah."
  },
  Maghrib: {
    title: "🕌 Time for Maghrib",
    body: "The sun has set. Time to pray Maghrib."
  },
  Isha: {
    title: "🕌 Time for Isha",
    body: "Complete your day with the night prayer."
  }
};

// Prayer names in order
const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/**
 * Parse time string (e.g., "5:28 AM") to hour and minute
 * @param {string} timeStr - Time string in format "H:MM AM/PM"
 * @returns {{ hour: number, minute: number }}
 */
const parseTimeString = (timeStr) => {
  if (!timeStr) return null;

  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  // Convert to 24-hour format
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  return { hour, minute };
};

/**
 * Get today's date as a string (YYYY-MM-DD)
 */
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Request notification permissions
 * @returns {Promise<boolean>}
 */
export const requestPrayerNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Prayer notification permission not granted');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting prayer notification permissions:', error);
    return false;
  }
};

/**
 * Cancel all prayer notifications
 */
export const cancelPrayerNotifications = async () => {
  try {
    // Get stored notification IDs
    const storedIds = await AsyncStorage.getItem(PRAYER_NOTIF_IDS_KEY);
    if (storedIds) {
      const ids = JSON.parse(storedIds);
      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    }

    // Clear stored IDs
    await AsyncStorage.removeItem(PRAYER_NOTIF_IDS_KEY);
    await AsyncStorage.removeItem(PRAYER_NOTIF_SCHEDULED_DATE_KEY);

    console.log('All prayer notifications cancelled');
  } catch (error) {
    console.error('Error cancelling prayer notifications:', error);
  }
};

/**
 * Schedule notifications for all 5 prayers
 * @param {Object} prayerTimes - Object containing prayer times { Fajr: { time: "5:28 AM" }, ... }
 * @returns {Promise<boolean>}
 */
export const schedulePrayerNotifications = async (prayerTimes) => {
  try {
    // First cancel any existing notifications
    await cancelPrayerNotifications();

    const now = new Date();
    const today = getTodayString();
    const notificationIds = [];

    for (const prayerName of PRAYER_NAMES) {
      const prayer = prayerTimes[prayerName];
      if (!prayer || !prayer.time) {
        console.log(`No time found for ${prayerName}, skipping`);
        continue;
      }

      const parsedTime = parseTimeString(prayer.time);
      if (!parsedTime) {
        console.log(`Could not parse time for ${prayerName}: ${prayer.time}`);
        continue;
      }

      // Create date object for this prayer time today
      const prayerDate = new Date();
      prayerDate.setHours(parsedTime.hour, parsedTime.minute, 0, 0);

      // Check if this prayer time has already passed today
      const hasPassed = prayerDate <= now;

      // If passed, schedule for tomorrow
      if (hasPassed) {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }

      // Schedule the notification
      const content = PRAYER_NOTIFICATION_CONTENT[prayerName];
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: content.title,
          body: content.body,
          data: { type: 'prayer_time', prayer: prayerName },
          sound: true,
        },
        trigger: {
          type: 'calendar',
          hour: (parsedTime.hour + Math.floor((parsedTime.minute + 1) / 60)) % 24,
          minute: (parsedTime.minute + 1) % 60,
          repeats: true,
        },
      });

      notificationIds.push(notificationId);
      console.log(`Scheduled ${prayerName} notification at ${prayer.time} (ID: ${notificationId})`);
    }

    // Store notification IDs for later cancellation
    await AsyncStorage.setItem(PRAYER_NOTIF_IDS_KEY, JSON.stringify(notificationIds));
    await AsyncStorage.setItem(PRAYER_NOTIF_SCHEDULED_DATE_KEY, today);

    console.log(`Scheduled ${notificationIds.length} prayer notifications`);
    return true;
  } catch (error) {
    console.error('Error scheduling prayer notifications:', error);
    return false;
  }
};

/**
 * Check if prayer notifications are enabled
 * @returns {Promise<boolean>}
 */
export const isPrayerNotificationsEnabled = async () => {
  try {
    const enabled = await AsyncStorage.getItem(PRAYER_NOTIF_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking prayer notification status:', error);
    return false;
  }
};

/**
 * Set prayer notifications enabled/disabled
 * @param {boolean} enabled
 */
export const setPrayerNotificationsEnabled = async (enabled) => {
  try {
    await AsyncStorage.setItem(PRAYER_NOTIF_ENABLED_KEY, enabled ? 'true' : 'false');
    console.log(`Prayer notifications ${enabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('Error setting prayer notification status:', error);
  }
};

/**
 * Check if notifications need rescheduling (e.g., new day)
 * @returns {Promise<boolean>}
 */
export const needsRescheduling = async () => {
  try {
    const scheduledDate = await AsyncStorage.getItem(PRAYER_NOTIF_SCHEDULED_DATE_KEY);
    const today = getTodayString();
    return scheduledDate !== today;
  } catch (error) {
    console.error('Error checking if rescheduling needed:', error);
    return true;
  }
};

/**
 * Get all scheduled prayer notifications
 * @returns {Promise<Array>}
 */
export const getScheduledPrayerNotifications = async () => {
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    return all.filter(n => n.content.data?.type === 'prayer_time');
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

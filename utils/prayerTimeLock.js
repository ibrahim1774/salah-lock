// Prayer time auto-lock preference utility
// Stores and retrieves the auto-lock toggle state

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for auto-lock preference
const AUTO_LOCK_ENABLED_KEY = '@auto_lock_enabled';

/**
 * Check if auto-lock feature is enabled
 * @returns {Promise<boolean>}
 */
export const isAutoLockEnabled = async () => {
  try {
    const enabled = await AsyncStorage.getItem(AUTO_LOCK_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking auto-lock status:', error);
    return false;
  }
};

/**
 * Set auto-lock feature enabled/disabled
 * @param {boolean} enabled
 */
export const setAutoLockEnabled = async (enabled) => {
  try {
    await AsyncStorage.setItem(AUTO_LOCK_ENABLED_KEY, enabled ? 'true' : 'false');
    console.log(`Auto-lock at prayer times ${enabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('Error setting auto-lock status:', error);
  }
};

// Subscription functionality disabled - will enable later
// Original code commented out to prevent Superwall/IAP initialization errors

/*
import Superwall from 'expo-superwall';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as IAP from 'react-native-iap';

const SUPERWALL_API_KEY_IOS = 'YOUR_SUPERWALL_IOS_KEY';
const SUPERWALL_API_KEY_ANDROID = 'YOUR_SUPERWALL_ANDROID_KEY';

const PRODUCT_IDS = Platform.select({
    ios: ['com.salahlock.monthly', 'com.salahlock.yearly'],
    android: ['com.salahlock.monthly', 'com.salahlock.yearly'],
});

... original initialization code removed to prevent errors ...
*/

// Stub export - returns inactive subscription state
export function useSuperwallSubscription() {
    return {
        isPro: false,
        isInitialized: true,
        showPaywall: () => Promise.resolve(),
    };
}

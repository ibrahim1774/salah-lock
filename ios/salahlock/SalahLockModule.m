#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SalahLockModule, NSObject)

// Screen Time Permission
RCT_EXTERN_METHOD(requestScreenTimePermissions:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(checkScreenTimePermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// App Selection
RCT_EXTERN_METHOD(selectApps:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(hasSelectedApps:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// App Blocking
RCT_EXTERN_METHOD(lockApps:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(unlockApps:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(isLocked:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// Test Methods
RCT_EXTERN_METHOD(testBlockApps:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(testUnblockApps:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(checkIsShieldActive:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// Prayer Scheduling
RCT_EXTERN_METHOD(schedulePrayerLocks:(NSDictionary *)prayerTimes duration:(int)duration resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(stopAllSchedules:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// Daily Reminder Scheduling
RCT_EXTERN_METHOD(scheduleDailyReminderLock:(int)hour minute:(int)minute duration:(int)duration resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(cancelDailyReminderLock:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(scheduleMultipleReminderLocks:(NSArray *)sessions duration:(int)duration resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getDailyReminderSessionIndex:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getLockType:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearLockType:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setLockType:(NSString *)type resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// Dhikr Session Scheduling
RCT_EXTERN_METHOD(scheduleDhikrLocks:(NSArray *)sessions duration:(int)duration resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(cancelDhikrLocks:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getDhikrSessionIndex:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

// Debug Methods
RCT_EXTERN_METHOD(getExtensionLogs:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearExtensionLogs:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getScheduleLogs:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getActiveSchedules:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(scheduleTestPrayer:(int)hour minute:(int)minute duration:(int)duration resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end

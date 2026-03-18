//
//  ShieldActionExtension.swift
//  ShieldAction
//
//  Created by Mohammed Ibrahim on 2/4/26.
//

import Foundation
import ManagedSettings
import UserNotifications

class ShieldActionExtension: ShieldActionDelegate {
    private let store = ManagedSettingsStore()
    private let userDefaults = UserDefaults(suiteName: "group.com.ibrahim1774.prayerlock")

    private func unlockIfPrayerLock(completionHandler: @escaping (ShieldActionResponse) -> Void) {
        let lockType = userDefaults?.string(forKey: "lockType") ?? "prayer"
        if lockType == "dailyReminder" || lockType == "dhikrSession" {
            // Daily reminder: DON'T unlock — user must complete spiritual flow in app
            completionHandler(.close)
        } else {
            let verificationMethod = userDefaults?.string(forKey: "prayerVerificationMethod") ?? "simple"
            if verificationMethod == "detection" {
                // Detection mode: don't unlock — set flag so app shows camera verification
                userDefaults?.set(true, forKey: "pendingPrayerDetection")

                // Schedule instant notification so user can tap to open Deen Taqwa
                let content = UNMutableNotificationContent()
                content.title = "Open Deen Taqwa"
                content.body = "Tap here to verify your prayer and unlock your apps."
                content.sound = .default
                let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.5, repeats: false)
                let request = UNNotificationRequest(
                    identifier: "prayer-detection-\(Date().timeIntervalSince1970)",
                    content: content,
                    trigger: trigger
                )
                UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)

                completionHandler(.close)
            } else {
                // Simple mode: unlock immediately (existing behavior)
                store.shield.applications = nil
                store.shield.applicationCategories = nil
                store.shield.webDomainCategories = nil
                completionHandler(.close)
            }
        }
    }

    override func handle(action: ShieldAction, for application: ApplicationToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        switch action {
        case .primaryButtonPressed:
            unlockIfPrayerLock(completionHandler: completionHandler)
        case .secondaryButtonPressed:
            completionHandler(.close)
        @unknown default:
            completionHandler(.close)
        }
    }

    override func handle(action: ShieldAction, for webDomain: WebDomainToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        unlockIfPrayerLock(completionHandler: completionHandler)
    }

    override func handle(action: ShieldAction, for category: ActivityCategoryToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        unlockIfPrayerLock(completionHandler: completionHandler)
    }
}

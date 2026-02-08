//
//  ShieldActionExtension.swift
//  ShieldAction
//
//  Created by Mohammed Ibrahim on 2/4/26.
//

import Foundation
import ManagedSettings

class ShieldActionExtension: ShieldActionDelegate {
    private let store = ManagedSettingsStore()
    private let userDefaults = UserDefaults(suiteName: "group.com.ibrahim1774.prayerlock")

    private func unlockIfPrayerLock(completionHandler: @escaping (ShieldActionResponse) -> Void) {
        let lockType = userDefaults?.string(forKey: "lockType") ?? "prayer"
        if lockType == "dailyReminder" {
            // Daily reminder: DON'T unlock — user must complete spiritual flow in app
            completionHandler(.close)
        } else {
            // Prayer lock: unlock immediately (existing behavior)
            store.shield.applications = nil
            store.shield.applicationCategories = nil
            store.shield.webDomainCategories = nil
            completionHandler(.close)
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

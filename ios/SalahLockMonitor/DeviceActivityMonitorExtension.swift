//
//  DeviceActivityMonitorExtension.swift
//  SalahLockMonitor
//
//  Created by Mohammed Ibrahim on 2/4/26.
//

import DeviceActivity
import ManagedSettings
import FamilyControls
import Foundation

class DeviceActivityMonitorExtension: DeviceActivityMonitor {
    private let userDefaults = UserDefaults(suiteName: "group.com.ibrahim1774.prayerlock")
    private let store = ManagedSettingsStore()

    private func log(_ message: String) {
        let timestamp = ISO8601DateFormatter().string(from: Date())
        let logEntry = "[\(timestamp)] \(message)"
        var logs = userDefaults?.stringArray(forKey: "extensionLogs") ?? []
        logs.append(logEntry)
        if logs.count > 50 { logs = Array(logs.suffix(50)) }
        userDefaults?.set(logs, forKey: "extensionLogs")
        print("SalahLock: \(message)")
    }

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        log("Interval STARTED for \(activity.rawValue)")

        // Tag lock type for shield configuration
        if activity.rawValue.hasPrefix("dhikr_") {
            let parts = activity.rawValue.split(separator: "_")
            let sessionIndex = Int(parts.last ?? "0") ?? 0
            userDefaults?.set(sessionIndex, forKey: "dhikrSessionIndex")
            userDefaults?.set("dhikrSession", forKey: "lockType")
            log("Set lockType to dhikrSession, index: \(sessionIndex)")
        } else if activity.rawValue.hasPrefix("dailyReminder") {
            let parts = activity.rawValue.split(separator: "_")
            let sessionIndex = (parts.count > 1) ? (Int(parts.last ?? "") ?? 0) : 0
            userDefaults?.set(sessionIndex, forKey: "dailyReminderSessionIndex")
            userDefaults?.set("dailyReminder", forKey: "lockType")
            log("Set lockType to dailyReminder, sessionIndex: \(sessionIndex)")
        } else {
            userDefaults?.set("prayer", forKey: "lockType")
            log("Set lockType to prayer")
        }

        // Load saved app selection and apply shields
        if let data = userDefaults?.data(forKey: "selectedApps") {
            let decoder = PropertyListDecoder()
            if let selection = try? decoder.decode(FamilyActivitySelection.self, from: data) {
                store.shield.applications = selection.applicationTokens
                store.shield.applicationCategories = .specific(selection.categoryTokens)
                store.shield.webDomainCategories = .specific(selection.categoryTokens)
                log("Applied shields to \(selection.applicationTokens.count) apps")
            } else {
                log("Failed to decode app selection")
            }
        } else {
            log("No app selection found in UserDefaults")
        }
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        log("Prayer interval ENDED for \(activity.rawValue)")

        // DO NOT clear shields here - let user manually unlock via app
        // The JS layer's handleIHavePrayed() will call testUnblockApps() to unlock
        // This keeps apps locked until user confirms they have prayed
        log("Interval ended - shields remain active until user confirms prayer")
    }

    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, activity: activity)
        log("Event threshold reached: \(event.rawValue)")
    }

    override func intervalWillStartWarning(for activity: DeviceActivityName) {
        super.intervalWillStartWarning(for: activity)
        log("Interval will start warning for \(activity.rawValue)")
    }

    override func intervalWillEndWarning(for activity: DeviceActivityName) {
        super.intervalWillEndWarning(for: activity)
        log("Interval will end warning for \(activity.rawValue)")
    }

    override func eventWillReachThresholdWarning(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        super.eventWillReachThresholdWarning(event, activity: activity)
        log("Event will reach threshold warning: \(event.rawValue)")
    }
}

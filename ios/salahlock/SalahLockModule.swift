import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity
import SwiftUI
import UIKit

@objc(SalahLockModule)
class SalahLockModule: NSObject {

    private let center = AuthorizationCenter.shared
    private let store = ManagedSettingsStore()
    private let activityCenter = DeviceActivityCenter()
    private let userDefaults = UserDefaults(suiteName: "group.com.ibrahim1774.prayerlock")

    private func logSchedule(_ message: String) {
        let timestamp = ISO8601DateFormatter().string(from: Date())
        var logs = userDefaults?.stringArray(forKey: "scheduleLogs") ?? []
        logs.append("[\(timestamp)] \(message)")
        if logs.count > 100 { logs = Array(logs.suffix(100)) }
        userDefaults?.set(logs, forKey: "scheduleLogs")
        print("SalahLock[Main]: \(message)")
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

    // MARK: - Screen Time Permission

    @objc func requestScreenTimePermissions(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                try await center.requestAuthorization(for: .individual)
                resolve(true)
            } catch {
                reject("PERMISSION_ERROR", "Failed to get Screen Time permission: \(error.localizedDescription)", error)
            }
        }
    }

    @objc func checkScreenTimePermission(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let status = center.authorizationStatus
        switch status {
        case .approved:
            resolve("approved")
        case .denied:
            resolve("denied")
        case .notDetermined:
            resolve("notDetermined")
        @unknown default:
            resolve("unknown")
        }
    }

    // MARK: - App Selection

    @objc func selectApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async { [weak self] in
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let rootVC = windowScene.windows.first?.rootViewController else {
                reject("UI_ERROR", "Could not find root view controller", nil)
                return
            }

            var topVC = rootVC
            while let presented = topVC.presentedViewController {
                topVC = presented
            }

            let pickerView = AppPickerView(
                onDone: { selection in
                    self?.saveSelection(selection)
                    resolve(true)
                },
                onCancel: {
                    resolve(false)
                }
            )

            let hostingController = UIHostingController(rootView: pickerView)
            hostingController.modalPresentationStyle = .pageSheet

            if let sheet = hostingController.sheetPresentationController {
                sheet.detents = [.large()]
                sheet.prefersGrabberVisible = true
            }

            topVC.present(hostingController, animated: true)
        }
    }

    private func saveSelection(_ selection: FamilyActivitySelection) {
        let encoder = PropertyListEncoder()
        if let data = try? encoder.encode(selection) {
            userDefaults?.set(data, forKey: "selectedApps")
            print("Saved \(selection.applicationTokens.count) apps and \(selection.categoryTokens.count) categories")
        }
    }

    private func loadSelection() -> FamilyActivitySelection? {
        guard let data = userDefaults?.data(forKey: "selectedApps") else { return nil }
        let decoder = PropertyListDecoder()
        return try? decoder.decode(FamilyActivitySelection.self, from: data)
    }

    // MARK: - App Selection Helpers

    @objc func hasSelectedApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if let selection = loadSelection() {
            let hasApps = !selection.applicationTokens.isEmpty || !selection.categoryTokens.isEmpty
            resolve(hasApps)
        } else {
            resolve(false)
        }
    }

    // MARK: - App Blocking

    @objc func lockApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let selection = loadSelection() else {
            reject("NO_SELECTION", "No apps selected", nil)
            return
        }

        store.shield.applications = selection.applicationTokens
        store.shield.applicationCategories = .specific(selection.categoryTokens)
        store.shield.webDomainCategories = .specific(selection.categoryTokens)

        resolve(true)
    }

    @objc func unlockApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
        store.shield.webDomainCategories = nil

        resolve(true)
    }

    @objc func isLocked(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let isLocked = store.shield.applications != nil
        resolve(isLocked)
    }

    // MARK: - Test Methods (for UI testing)

    @objc func testBlockApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let selection = loadSelection() else {
            reject("NO_SELECTION", "No apps selected. Please select apps first.", nil)
            return
        }

        store.shield.applications = selection.applicationTokens
        store.shield.applicationCategories = .specific(selection.categoryTokens)
        store.shield.webDomainCategories = .specific(selection.categoryTokens)

        print("Test blocking: Applied shields to \(selection.applicationTokens.count) apps")
        resolve(true)
    }

    @objc func testUnblockApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
        store.shield.webDomainCategories = nil

        print("Test unblocking: Cleared all shields")
        resolve(true)
    }

    @objc func checkIsShieldActive(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let isActive = store.shield.applications != nil
        resolve(isActive)
    }

    // MARK: - Prayer Scheduling

    @objc func schedulePrayerLocks(_ prayerTimes: NSDictionary, duration: Int, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

        print("🕐 Starting prayer schedule sync with duration: \(duration) minutes")

        // Clear only prayer schedules (preserve daily reminder)
        let prayerActivities = activityCenter.activities.filter { $0.rawValue.hasPrefix("prayer_") }
        if !prayerActivities.isEmpty {
            activityCenter.stopMonitoring(Array(prayerActivities))
        }
        print("🗑️ Cleared prayer schedules")

        for (prayerName, timeString) in prayerTimes {
            guard let name = prayerName as? String,
                  let time = timeString as? String else { continue }

            let components = time.split(separator: ":")
            guard components.count == 2,
                  let hour = Int(components[0]),
                  let minute = Int(components[1]) else { continue }

            // Create schedule for this prayer (+1 min offset to compensate for iOS early triggering)
            let adjustedMinute = minute + 1
            var startComponents = DateComponents()
            startComponents.hour = (hour + adjustedMinute / 60) % 24
            startComponents.minute = adjustedMinute % 60

            // Handle midnight rollover correctly
            var endComponents = DateComponents()
            let totalMinutes = minute + 1 + duration
            let endHour = (hour + totalMinutes / 60) % 24  // Wrap around at midnight
            let endMin = totalMinutes % 60
            endComponents.hour = endHour
            endComponents.minute = endMin

            let schedule = DeviceActivitySchedule(
                intervalStart: startComponents,
                intervalEnd: endComponents,
                repeats: true
            )

            let activityName = DeviceActivityName(rawValue: "prayer_\(name)")

            do {
                try activityCenter.startMonitoring(activityName, during: schedule)
                print("✅ Scheduled \(name): \(hour):\(String(format: "%02d", minute)) -> \(endHour):\(String(format: "%02d", endMin))")
            } catch {
                print("❌ Failed to schedule \(name): \(error.localizedDescription)")
            }
        }

        // Log all active schedules after sync
        let activeNames = activityCenter.activities.map { $0.rawValue }
        print("📋 Active schedules after sync: \(activeNames)")

        resolve(true)
    }

    @objc func stopAllSchedules(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        activityCenter.stopMonitoring()
        resolve(true)
    }

    // MARK: - Daily Reminder Scheduling

    @objc func scheduleDailyReminderLock(_ hour: Int, minute: Int, duration: Int, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("🔔 Scheduling daily reminder lock at \(hour):\(String(format: "%02d", minute)) for \(duration) minutes")

        // Cancel existing daily reminder schedule
        let reminderActivities = activityCenter.activities.filter { $0.rawValue.hasPrefix("dailyReminder") }
        if !reminderActivities.isEmpty {
            activityCenter.stopMonitoring(Array(reminderActivities))
        }

        var startComponents = DateComponents()
        startComponents.hour = hour
        startComponents.minute = minute

        var endComponents = DateComponents()
        let totalMinutes = minute + duration
        let endHour = (hour + totalMinutes / 60) % 24
        let endMin = totalMinutes % 60
        endComponents.hour = endHour
        endComponents.minute = endMin

        let schedule = DeviceActivitySchedule(
            intervalStart: startComponents,
            intervalEnd: endComponents,
            repeats: true
        )

        let activityName = DeviceActivityName(rawValue: "dailyReminder")

        do {
            try activityCenter.startMonitoring(activityName, during: schedule)
            print("✅ Daily reminder scheduled: \(hour):\(String(format: "%02d", minute)) -> \(endHour):\(String(format: "%02d", endMin))")
            resolve(true)
        } catch {
            print("❌ Failed to schedule daily reminder: \(error.localizedDescription)")
            reject("SCHEDULE_ERROR", error.localizedDescription, error)
        }
    }

    @objc func cancelDailyReminderLock(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let reminderActivities = activityCenter.activities.filter { $0.rawValue.hasPrefix("dailyReminder") }
        if !reminderActivities.isEmpty {
            activityCenter.stopMonitoring(Array(reminderActivities))
        }
        // Clear stale lockType if it was daily reminder
        if userDefaults?.string(forKey: "lockType") == "dailyReminder" {
            userDefaults?.removeObject(forKey: "lockType")
        }
        print("🔕 Daily reminder lock cancelled")
        resolve(true)
    }

    @objc func scheduleMultipleReminderLocks(_ sessions: NSArray, duration: Int, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("🔔 Scheduling \(sessions.count) multi-session reminder locks")

        // Cancel all existing dailyReminder* activities
        let reminderActivities = activityCenter.activities.filter { $0.rawValue.hasPrefix("dailyReminder") }
        if !reminderActivities.isEmpty {
            activityCenter.stopMonitoring(Array(reminderActivities))
        }

        for (index, sessionObj) in sessions.enumerated() {
            guard let session = sessionObj as? NSDictionary,
                  let hour = (session["hour"] as? NSNumber)?.intValue,
                  let minute = (session["minute"] as? NSNumber)?.intValue else { continue }

            var startComponents = DateComponents()
            startComponents.hour = hour
            startComponents.minute = minute

            var endComponents = DateComponents()
            let totalMinutes = minute + duration
            let endHour = (hour + totalMinutes / 60) % 24
            let endMin = totalMinutes % 60
            endComponents.hour = endHour
            endComponents.minute = endMin

            let schedule = DeviceActivitySchedule(
                intervalStart: startComponents,
                intervalEnd: endComponents,
                repeats: true
            )

            let activityName = DeviceActivityName(rawValue: "dailyReminder_\(index)")

            do {
                try activityCenter.startMonitoring(activityName, during: schedule)
                logSchedule("✅ Scheduled dailyReminder_\(index) at \(hour):\(String(format: "%02d", minute)) -> \(endHour):\(String(format: "%02d", endMin))")
            } catch {
                logSchedule("❌ FAILED dailyReminder_\(index): \(error.localizedDescription)")
            }
        }
        let activeNames = activityCenter.activities.map { $0.rawValue }
        logSchedule("Active schedules after registration: \(activeNames)")
        resolve(true)
    }

    @objc func getDailyReminderSessionIndex(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let index = userDefaults?.integer(forKey: "dailyReminderSessionIndex") ?? 0
        resolve(index)
    }

    @objc func getLockType(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let lockType = userDefaults?.string(forKey: "lockType")
        resolve(lockType as Any)
    }

    @objc func clearLockType(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        userDefaults?.removeObject(forKey: "lockType")
        resolve(true)
    }

    @objc func setLockType(_ type: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        userDefaults?.set(type, forKey: "lockType")
        resolve(true)
    }

    // MARK: - Prayer Verification Method

    @objc func setPrayerVerificationMethod(_ method: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        userDefaults?.set(method, forKey: "prayerVerificationMethod")
        resolve(true)
    }

    @objc func checkPendingPrayerDetection(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let pending = userDefaults?.bool(forKey: "pendingPrayerDetection") ?? false
        resolve(pending)
    }

    @objc func clearPendingPrayerDetection(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        userDefaults?.removeObject(forKey: "pendingPrayerDetection")
        resolve(true)
    }

    // MARK: - Dhikr Session Scheduling

    @objc func scheduleDhikrLocks(_ sessions: NSArray, duration: Int, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("🔔 Scheduling \(sessions.count) dhikr session locks")

        // Cancel only dhikr_ prefixed activities (never touch prayer_ or dailyReminder)
        let dhikrActivities = activityCenter.activities.filter { $0.rawValue.hasPrefix("dhikr_") }
        if !dhikrActivities.isEmpty {
            activityCenter.stopMonitoring(Array(dhikrActivities))
        }

        for (index, sessionObj) in sessions.enumerated() {
            guard let session = sessionObj as? NSDictionary,
                  let hour = (session["hour"] as? NSNumber)?.intValue,
                  let minute = (session["minute"] as? NSNumber)?.intValue else { continue }

            var startComponents = DateComponents()
            startComponents.hour = hour
            startComponents.minute = minute

            var endComponents = DateComponents()
            let totalMinutes = minute + duration
            let endHour = (hour + totalMinutes / 60) % 24
            let endMin = totalMinutes % 60
            endComponents.hour = endHour
            endComponents.minute = endMin

            let schedule = DeviceActivitySchedule(
                intervalStart: startComponents,
                intervalEnd: endComponents,
                repeats: true
            )

            let activityName = DeviceActivityName(rawValue: "dhikr_\(index)")

            do {
                try activityCenter.startMonitoring(activityName, during: schedule)
                print("✅ Dhikr session \(index) scheduled: \(hour):\(String(format: "%02d", minute)) -> \(endHour):\(String(format: "%02d", endMin))")
            } catch {
                print("❌ Failed to schedule dhikr session \(index): \(error.localizedDescription)")
            }
        }
        resolve(true)
    }

    @objc func cancelDhikrLocks(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let dhikrActivities = activityCenter.activities.filter { $0.rawValue.hasPrefix("dhikr_") }
        if !dhikrActivities.isEmpty {
            activityCenter.stopMonitoring(Array(dhikrActivities))
        }
        if userDefaults?.string(forKey: "lockType") == "dhikrSession" {
            userDefaults?.removeObject(forKey: "lockType")
            userDefaults?.removeObject(forKey: "dhikrSessionIndex")
        }
        print("🔕 Dhikr session locks cancelled")
        resolve(true)
    }

    @objc func getDhikrSessionIndex(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let index = userDefaults?.integer(forKey: "dhikrSessionIndex") ?? 0
        resolve(index)
    }

    // MARK: - Debug Methods

    @objc func getExtensionLogs(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let logs = userDefaults?.stringArray(forKey: "extensionLogs") ?? []
        resolve(logs)
    }

    @objc func getScheduleLogs(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let logs = userDefaults?.stringArray(forKey: "scheduleLogs") ?? []
        resolve(logs)
    }

    @objc func clearExtensionLogs(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        userDefaults?.removeObject(forKey: "extensionLogs")
        resolve(true)
    }

    @objc func getActiveSchedules(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let activities = activityCenter.activities
        let names = activities.map { $0.rawValue }
        print("📋 Active schedules: \(names)")
        resolve(names)
    }

    // Test method: Schedule a single test prayer at a specific time
    @objc func scheduleTestPrayer(_ hour: Int, minute: Int, duration: Int, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("🧪 Scheduling TEST prayer at \(hour):\(String(format: "%02d", minute)) for \(duration) minutes")

        var startComponents = DateComponents()
        startComponents.hour = hour
        startComponents.minute = minute

        var endComponents = DateComponents()
        let totalMinutes = minute + duration
        let endHour = (hour + totalMinutes / 60) % 24
        let endMin = totalMinutes % 60
        endComponents.hour = endHour
        endComponents.minute = endMin

        let schedule = DeviceActivitySchedule(
            intervalStart: startComponents,
            intervalEnd: endComponents,
            repeats: false
        )

        let activityName = DeviceActivityName(rawValue: "prayer_Test")

        do {
            try activityCenter.startMonitoring(activityName, during: schedule)
            print("✅ TEST scheduled: \(hour):\(String(format: "%02d", minute)) -> \(endHour):\(String(format: "%02d", endMin))")
            print("📋 Active schedules: \(activityCenter.activities.map { $0.rawValue })")
            resolve(true)
        } catch {
            print("❌ TEST failed: \(error.localizedDescription)")
            reject("SCHEDULE_ERROR", error.localizedDescription, error)
        }
    }
}

// MARK: - SwiftUI App Picker View

struct AppPickerView: View {
    @State private var selection = FamilyActivitySelection()
    @Environment(\.dismiss) private var dismiss
    let onDone: (FamilyActivitySelection) -> Void
    let onCancel: () -> Void

    var body: some View {
        NavigationView {
            FamilyActivityPicker(selection: $selection)
                .navigationTitle("Select Apps to Block")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") {
                            onCancel()
                            dismissPicker()
                        }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Done") {
                            onDone(selection)
                            dismissPicker()
                        }
                    }
                }
        }
    }

    private func dismissPicker() {
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let rootVC = windowScene.windows.first?.rootViewController {
            rootVC.dismiss(animated: true)
        }
    }
}

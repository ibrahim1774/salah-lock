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

        // Clear existing schedules
        activityCenter.stopMonitoring()
        print("🗑️ Cleared existing schedules")

        for (prayerName, timeString) in prayerTimes {
            guard let name = prayerName as? String,
                  let time = timeString as? String else { continue }

            let components = time.split(separator: ":")
            guard components.count == 2,
                  let hour = Int(components[0]),
                  let minute = Int(components[1]) else { continue }

            // Create schedule for this prayer
            var startComponents = DateComponents()
            startComponents.hour = hour
            startComponents.minute = minute

            // Fix: Handle midnight rollover correctly
            var endComponents = DateComponents()
            let totalMinutes = minute + duration
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

    // MARK: - Debug Methods

    @objc func getExtensionLogs(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let logs = userDefaults?.stringArray(forKey: "extensionLogs") ?? []
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

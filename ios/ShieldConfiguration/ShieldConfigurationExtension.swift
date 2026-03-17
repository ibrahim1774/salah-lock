//
//  ShieldConfigurationExtension.swift
//  ShieldConfiguration
//
//  Created by Mohammed Ibrahim on 2/4/26.
//

import ManagedSettings
import ManagedSettingsUI
import UIKit

class ShieldConfigurationExtension: ShieldConfigurationDataSource {
    private let userDefaults = UserDefaults(suiteName: "group.com.ibrahim1774.prayerlock")

    override func configuration(shielding application: Application) -> ShieldConfiguration {
        return createShieldConfiguration()
    }

    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration {
        return createShieldConfiguration()
    }

    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        return createShieldConfiguration()
    }

    override func configuration(shielding webDomain: WebDomain, in category: ActivityCategory) -> ShieldConfiguration {
        return createShieldConfiguration()
    }

    private func createShieldConfiguration() -> ShieldConfiguration {
        let lockType = userDefaults?.string(forKey: "lockType") ?? "prayer"

        if lockType == "dailyReminder" || lockType == "dhikrSession" {
            let icon = UIImage(systemName: "book.fill")
            return ShieldConfiguration(
                backgroundBlurStyle: .systemUltraThinMaterial,
                backgroundColor: .white,
                icon: icon,
                title: ShieldConfiguration.Label(
                    text: "Time for Quran, Dua & Dhikr",
                    color: .black
                ),
                subtitle: ShieldConfiguration.Label(
                    text: "Open Deen Taqwa to begin your spiritual journey",
                    color: .gray
                ),
                primaryButtonLabel: ShieldConfiguration.Label(
                    text: "Open Deen Taqwa",
                    color: .white
                ),
                primaryButtonBackgroundColor: UIColor(red: 0.2, green: 0.7, blue: 0.4, alpha: 1.0),
                secondaryButtonLabel: nil
            )
        }

        // Default: Prayer lock
        let icon = UIImage(systemName: "moon.stars.fill")
        return ShieldConfiguration(
            backgroundBlurStyle: .systemUltraThinMaterial,
            backgroundColor: .white,
            icon: icon,
            title: ShieldConfiguration.Label(
                text: "Salah Focus Lock",
                color: .black
            ),
            subtitle: ShieldConfiguration.Label(
                text: "\"Verily, in the remembrance of Allah do hearts find rest.\" - Quran 13:28",
                color: .gray
            ),
            primaryButtonLabel: ShieldConfiguration.Label(
                text: "I will pray now",
                color: .white
            ),
            primaryButtonBackgroundColor: UIColor(red: 0.2, green: 0.7, blue: 0.4, alpha: 1.0),
            secondaryButtonLabel: nil
        )
    }
}

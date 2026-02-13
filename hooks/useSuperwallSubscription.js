import { usePlacement, useUser } from 'expo-superwall';
import { Alert } from 'react-native';

export function useSubscription() {
    const { subscriptionStatus, getEntitlements, setSubscriptionStatus } = useUser();
    const { registerPlacement } = usePlacement();

    const isSubscribed = subscriptionStatus?.status === 'ACTIVE';

    const showPaywall = async (placement, onFeature) => {
        await registerPlacement({
            placement,
            ...(onFeature ? { feature: onFeature } : {}),
        });
    };

    const restorePurchases = async () => {
        try {
            const entitlements = await getEntitlements();
            if (entitlements.active && entitlements.active.length > 0) {
                await setSubscriptionStatus({ status: 'ACTIVE', entitlements: entitlements.active });
                Alert.alert('Restored!', 'Your subscription has been restored.');
            } else {
                Alert.alert('No Subscription Found', 'No active subscription was found for this account.');
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to restore purchases. Please try again.');
        }
    };

    return { isSubscribed, showPaywall, restorePurchases };
}

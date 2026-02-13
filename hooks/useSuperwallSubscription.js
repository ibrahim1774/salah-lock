import { usePlacement, useUser, useSuperwallEvents } from 'expo-superwall';
import { Alert } from 'react-native';
import { usePostHog } from 'posthog-react-native';
import { useRef, useEffect } from 'react';

export function useSubscription() {
    const posthog = usePostHog();
    const { subscriptionStatus, getEntitlements, setSubscriptionStatus, setIntegrationAttributes } = useUser();
    const currentPlacementRef = useRef(null);

    // Link Superwall <-> PostHog user IDs
    useEffect(() => {
        const distinctId = posthog?.getDistinctId();
        if (distinctId) {
            setIntegrationAttributes({ posthogUserId: distinctId });
        }
    }, [posthog]);

    const { registerPlacement } = usePlacement({
        onPresent: (paywallInfo) => {
            posthog?.capture('paywall_presented', {
                placement: currentPlacementRef.current,
                paywall_name: paywallInfo.name,
                paywall_id: paywallInfo.identifier,
                has_free_trial: paywallInfo.isFreeTrialAvailable,
            });
        },
        onDismiss: (paywallInfo, result) => {
            posthog?.capture('paywall_closed', {
                placement: currentPlacementRef.current,
                paywall_name: paywallInfo.name,
                result_type: result.type,
                product_id: result.type === 'purchased' ? result.productId : undefined,
            });
        },
        onSkip: (reason) => {
            posthog?.capture('paywall_skipped', {
                placement: currentPlacementRef.current,
                reason_type: reason.type,
            });
        },
        onError: (error) => {
            posthog?.capture('paywall_error', {
                placement: currentPlacementRef.current,
                error,
            });
        },
    });

    // Global Superwall event listener for subscription lifecycle
    useSuperwallEvents({
        onSubscriptionStatusChange: (status) => {
            posthog?.capture('subscription_status_changed', {
                new_status: status.status,
            });
        },
        onSuperwallEvent: (eventInfo) => {
            const { event } = eventInfo;
            if (event.event === 'freeTrialStart') {
                posthog?.capture('free_trial_started', {
                    product_id: event.product?.productIdentifier,
                });
            }
            if (event.event === 'subscriptionStart') {
                posthog?.capture('subscription_started', {
                    product_id: event.product?.productIdentifier,
                });
            }
            if (event.event === 'transactionComplete') {
                posthog?.capture('transaction_completed', {
                    product_id: event.product?.productIdentifier,
                });
            }
        },
    });

    const isSubscribed = subscriptionStatus?.status === 'ACTIVE';

    const showPaywall = async (placement, onFeature) => {
        currentPlacementRef.current = placement;

        if (isSubscribed && onFeature) {
            posthog?.capture('feature_accessed', { feature: placement });
        } else if (!isSubscribed) {
            posthog?.capture('feature_gated', { feature: placement });
        }

        await registerPlacement({
            placement,
            ...(onFeature ? { feature: onFeature } : {}),
        });
    };

    const restorePurchases = async () => {
        posthog?.capture('purchase_restore_attempted');
        try {
            const entitlements = await getEntitlements();
            if (entitlements.active && entitlements.active.length > 0) {
                await setSubscriptionStatus({ status: 'ACTIVE', entitlements: entitlements.active });
                posthog?.capture('purchase_restored', { success: true });
                Alert.alert('Restored!', 'Your subscription has been restored.');
            } else {
                posthog?.capture('purchase_restored', { success: false, reason: 'no_active_subscription' });
                Alert.alert('No Subscription Found', 'No active subscription was found for this account.');
            }
        } catch (e) {
            posthog?.capture('purchase_restored', { success: false, reason: 'error' });
            Alert.alert('Error', 'Failed to restore purchases. Please try again.');
        }
    };

    return { isSubscribed, showPaywall, restorePurchases };
}

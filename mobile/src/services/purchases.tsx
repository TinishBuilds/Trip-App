import type { CustomerInfo, CustomerInfoUpdateListener } from 'react-native-purchases';
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

export const PRO_ENTITLEMENT = 'ingara_pro';

type PurchaseState = {
  configured: boolean;
  loading: boolean;
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  error: string | null;
  refresh: () => Promise<void>;
  presentPaywall: () => Promise<void>;
  restore: () => Promise<void>;
  presentCustomerCenter: () => Promise<void>;
};

const PurchaseContext = createContext<PurchaseState | null>(null);
let configured = false;

function getApiKey() {
  if (Platform.OS === 'ios') return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
  if (Platform.OS === 'android') return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
  return undefined;
}

async function loadPurchases() {
  return import('react-native-purchases');
}

async function ensureConfigured() {
  const apiKey = getApiKey();
  if (!apiKey) return false;
  if (configured) return true;
  const { default: Purchases, LOG_LEVEL } = await loadPurchases();
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey });
  configured = true;
  return true;
}

export function PurchaseProvider({ children }: PropsWithChildren) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const update = useCallback((info: CustomerInfo) => {
    setCustomerInfo(info);
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const ready = await ensureConfigured();
      setIsConfigured(ready);
      if (!ready) return;
      const { default: Purchases } = await loadPurchases();
      update(await Purchases.getCustomerInfo());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load purchases.');
    } finally {
      setLoading(false);
    }
  }, [update]);

  useEffect(() => {
    let listener: CustomerInfoUpdateListener | undefined;
    let cancelled = false;

    const initialize = async () => {
      try {
        const ready = await ensureConfigured();
        if (cancelled) return;
        setIsConfigured(ready);
        if (!ready) return;

        const { default: Purchases } = await loadPurchases();
        const info = await Purchases.getCustomerInfo();
        if (cancelled) return;
        update(info);
        listener = (info) => update(info);
        Purchases.addCustomerInfoUpdateListener(listener);
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Could not load purchases.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void initialize();

    return () => {
      cancelled = true;
      if (listener) loadPurchases().then(({ default: Purchases }) => Purchases.removeCustomerInfoUpdateListener(listener!)).catch(() => undefined);
    };
  }, [update]);

  const presentPaywall = useCallback(async () => {
    setError(null);
    try {
      if (!(await ensureConfigured())) throw new Error('Add your RevenueCat public SDK key to .env.local first.');
      const [{ default: RevenueCatUI }] = await Promise.all([import('react-native-purchases-ui')]);
      await RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: PRO_ENTITLEMENT, displayCloseButton: true });
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not open the paywall.');
    }
  }, [refresh]);

  const restore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!(await ensureConfigured())) throw new Error('RevenueCat is not configured.');
      const { default: Purchases } = await loadPurchases();
      update(await Purchases.restorePurchases());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not restore purchases.');
    } finally {
      setLoading(false);
    }
  }, [update]);

  const presentCustomerCenter = useCallback(async () => {
    setError(null);
    try {
      if (!(await ensureConfigured())) throw new Error('RevenueCat is not configured.');
      const { default: RevenueCatUI } = await import('react-native-purchases-ui');
      await RevenueCatUI.presentCustomerCenter();
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not open Customer Center.');
    }
  }, [refresh]);

  const value = useMemo(() => ({
    configured: isConfigured,
    loading,
    customerInfo,
    error,
    isPro: Boolean(customerInfo?.entitlements.active[PRO_ENTITLEMENT]),
    refresh,
    presentPaywall,
    restore,
    presentCustomerCenter,
  }), [customerInfo, error, isConfigured, loading, presentCustomerCenter, presentPaywall, refresh, restore]);

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchases() {
  const value = useContext(PurchaseContext);
  if (!value) throw new Error('usePurchases must be used within PurchaseProvider');
  return value;
}

import { useEffect, useRef } from 'react';

import { purchasesLogIn, purchasesLogOut } from '@/src/integrations/revenuecat/purchases';
import { useRevenueCatSubscriptionContext } from '@/src/integrations/revenuecat/RevenueCatSubscriptionProvider';
import { useAuth } from '@/src/providers/AuthProvider';

/**
 * Keeps RevenueCat `appUserId` aligned with Supabase `auth.users.id` after configure + auth.
 */
export function RevenueCatIdentityBridge() {
  const { user } = useAuth();
  const { isReady } = useRevenueCatSubscriptionContext();
  const lastLoggedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    if (!user?.id) {
      if (lastLoggedRef.current !== null) {
        lastLoggedRef.current = null;
        void purchasesLogOut();
      }
      return;
    }

    if (user.id === lastLoggedRef.current) return;

    let cancelled = false;
    void (async () => {
      await purchasesLogIn(user.id);
      if (!cancelled) lastLoggedRef.current = user.id;
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, isReady]);

  return null;
}

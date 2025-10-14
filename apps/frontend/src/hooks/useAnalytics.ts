import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics';

/**
 * Hook to automatically track page views
 */
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      analytics.pageView(url);
    }
  }, [pathname, searchParams]);
}

/**
 * Hook to track custom events
 */
export function useAnalytics() {
  return {
    trackEvent: analytics.event.bind(analytics),
    trackProductView: analytics.viewItem.bind(analytics),
    trackAddToCart: analytics.addToCart.bind(analytics),
    trackRemoveFromCart: analytics.removeFromCart.bind(analytics),
    trackBeginCheckout: analytics.beginCheckout.bind(analytics),
    trackPurchase: analytics.purchase.bind(analytics),
    trackSearch: analytics.search.bind(analytics),
    trackSignUp: analytics.signUp.bind(analytics),
    trackLogin: analytics.login.bind(analytics),
  };
}

export default useAnalytics;


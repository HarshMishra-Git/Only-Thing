'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * Web Vitals monitoring component
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vital] ${metric.name}:`, metric.value);
    }

    // Send to custom analytics endpoint
    sendToAnalytics(metric);
  });

  return null;
}

/**
 * Send metrics to backend
 */
async function sendToAnalytics(metric: any) {
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });

    // Use sendBeacon for better reliability
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/vitals', blob);
    } else {
      // Fallback to fetch
      fetch('/api/analytics/vitals', {
        body,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // Fail silently
      });
    }
  } catch (error) {
    // Fail silently
  }
}

/**
 * Performance observer for custom metrics
 */
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor long tasks (blocking main thread)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Log tasks longer than 50ms
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${entry.duration}ms`);
              
              // Send to analytics
              if (window.gtag) {
                window.gtag('event', 'long_task', {
                  value: Math.round(entry.duration),
                  event_category: 'Performance',
                });
              }
            }
          }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });

        return () => longTaskObserver.disconnect();
      } catch (e) {
        // Some browsers don't support longtask
      }
    }
  }, []);
}

/**
 * Resource timing monitoring
 */
export function useResourceTiming() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkResourceTiming = () => {
      const resources = performance.getEntriesByType('resource');
      
      // Find slow resources
      const slowResources = resources.filter(
        (resource: any) => resource.duration > 1000
      );

      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources);
        
        // Report to analytics
        slowResources.forEach((resource: any) => {
          if (window.gtag) {
            window.gtag('event', 'slow_resource', {
              value: Math.round(resource.duration),
              resource_name: resource.name,
              event_category: 'Performance',
            });
          }
        });
      }
    };

    // Check after page load
    if (document.readyState === 'complete') {
      checkResourceTiming();
    } else {
      window.addEventListener('load', checkResourceTiming);
      return () => window.removeEventListener('load', checkResourceTiming);
    }
  }, []);
}

/**
 * Memory monitoring (Chrome only)
 */
export function useMemoryMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMemory = () => {
      // @ts-ignore - Chrome specific API
      if (performance.memory) {
        // @ts-ignore
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
        
        const usedMB = Math.round(usedJSHeapSize / 1048576);
        const totalMB = Math.round(totalJSHeapSize / 1048576);
        const limitMB = Math.round(jsHeapSizeLimit / 1048576);
        
        // Warn if using more than 80% of limit
        if (usedMB / limitMB > 0.8) {
          console.warn(`High memory usage: ${usedMB}MB / ${limitMB}MB`);
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`Memory: ${usedMB}MB used / ${totalMB}MB total / ${limitMB}MB limit`);
        }
      }
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);
}

/**
 * Complete performance monitoring setup
 */
export function PerformanceMonitoring() {
  usePerformanceMonitoring();
  useResourceTiming();
  useMemoryMonitoring();

  return <WebVitals />;
}

export default WebVitals;


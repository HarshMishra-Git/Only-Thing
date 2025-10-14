import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Loading fallback component
 */
export function LoadingFallback({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

/**
 * Error fallback component
 */
export function ErrorFallback({ 
  message = 'Failed to load component',
  onRetry 
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-sm text-red-600 mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Create lazy loaded component with custom loading state
 */
export function createLazyComponent<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    loading?: ComponentType;
    error?: ComponentType;
  }
) {
  return dynamic(importFunc, {
    loading: () => options?.loading ? <options.loading /> : <LoadingFallback />,
    ssr: false,
  });
}

// Lazy components can be added here as needed

/**
 * Intersection Observer based lazy loading
 */
export function LazyLoadOnView({
  children,
  threshold = 0.1,
  rootMargin = '50px',
}: {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-32" />}
    </div>
  );
}

/**
 * Prefetch on hover for better UX
 */
export function usePrefetch<T>(
  prefetchFunc: () => Promise<T>,
  enabled: boolean = true
) {
  const [isPrefetched, setIsPrefetched] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    if (!isPrefetched && enabled) {
      prefetchFunc().then(() => setIsPrefetched(true));
    }
  }, [isPrefetched, enabled, prefetchFunc]);

  return { handleMouseEnter, isPrefetched };
}

// Route components can be added as needed

import React from 'react';

export default {
  createLazyComponent,
  LazyLoadOnView,
  usePrefetch,
};


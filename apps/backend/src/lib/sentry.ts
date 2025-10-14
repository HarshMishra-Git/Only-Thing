import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Initialize Sentry
 */
export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    console.warn('Sentry DSN not configured, skipping Sentry initialization');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Set sampling rate for profiling - relative to tracesSampleRate
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    integrations: [
      nodeProfilingIntegration(),
    ],

    // Filter sensitive data
    beforeSend(event) {
      // Remove sensitive data from request
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }

      // Remove sensitive data from context
      if (event.contexts?.user) {
        delete event.contexts.user.email;
        delete event.contexts.user.ip_address;
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      'ECONNREFUSED',
      'ECONNRESET',
      'ETIMEDOUT',
      'Network request failed',
    ],
  });

  console.log('Sentry initialized successfully');
}

/**
 * Capture exception in Sentry
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture message in Sentry
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Set Sentry user context
 */
export function setUser(user: { id: string; email?: string; role?: string }) {
  Sentry.setUser({
    id: user.id,
    // Don't include email in production for privacy
    ...(process.env.NODE_ENV !== 'production' && user.email && { email: user.email }),
    role: user.role,
  });
}

/**
 * Clear Sentry user context
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb to Sentry
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Fastify plugin to add Sentry context to requests
 */
export function addSentryContext(request: FastifyRequest, reply: FastifyReply) {
  // Use newer span API instead of deprecated startTransaction
  Sentry.startSpan(
    {
      op: 'http.server',
      name: `${request.method} ${request.url}`,
    },
    (span) => {
      // Set context
      Sentry.setContext('request', {
        method: request.method,
        url: request.url,
        query: request.query,
        params: request.params,
      });

      // Set user context if authenticated
      if (request.user) {
        setUser({
          id: request.user.id,
          email: request.user.email,
          role: request.user.role,
        });
      }

      // Note: span is automatically finished when callback completes
    }
  );
}

/**
 * Flush Sentry events (useful for serverless)
 */
export async function flushSentry(timeout = 2000) {
  try {
    await Sentry.flush(timeout);
  } catch (error) {
    console.error('Error flushing Sentry:', error);
  }
}

export default Sentry;

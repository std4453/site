import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://dc42ea424b6c4c2bb628d982e8793f2f@o639057.ingest.sentry.io/4504467707789312',
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
});

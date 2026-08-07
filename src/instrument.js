import * as Sentry from '@sentry/react';
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  function isInjectedScriptError(event) {
    const frames = event.exception?.values?.flatMap((value) => value.stacktrace?.frames || []) || [];
    if (!frames.length) return false;
    return frames.every((frame) => {
      const file = frame.filename || frame.abs_path || '';
      if (!file) return true;
      return !file.includes('/assets/') && !file.endsWith('.js') && !file.endsWith('.jsx');
    });
  }

  if (dsn && import.meta.env.PROD) {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      sendDefaultPii: false,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: 0.1,
      beforeSend(event) {
        if (isInjectedScriptError(event)) return null;
        return event;
      },
    });
  }

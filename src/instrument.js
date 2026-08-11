import * as Sentry from '@sentry/react';
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const EXTENSION_SCHEME_RE = /^(chrome|moz|safari-web|ms-browser|edge)-extension:\/\//i;

  function isInjectedScriptError(event) {
    const frames = event.exception?.values?.flatMap((value) => value.stacktrace?.frames || []) || [];
    if (!frames.length) return false;
    return frames.every((frame) => {
      const file = frame.filename || frame.abs_path || '';
      if (!file) return true;      
      if (EXTENSION_SCHEME_RE.test(file)) return true;
      if (file.includes('/assets/') && (file.endsWith('.js') || file.endsWith('.jsx'))) return false;
      return true;
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

      denyUrls: [
        /^chrome-extension:\/\//i,
        /^moz-extension:\/\//i,
        /^safari-web-extension:\/\//i,
        /^ms-browser-extension:\/\//i,
        /^edge-extension:\/\//i,
      ],
      beforeSend(event) {
        if (isInjectedScriptError(event)) return null;
        return event;
      },
    });
  }

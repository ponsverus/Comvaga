  import './instrument';
  import ReactDOM from 'react-dom/client';
  import * as Sentry from '@sentry/react';
  import App from './App.jsx';
  import './index.css';

  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(rootElement, {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  }).render(
    <App />
  );
  
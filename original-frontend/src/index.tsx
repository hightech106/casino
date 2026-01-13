/**
 * Application entry point that initializes React, routing, and global providers.
 * Sets up Sentry error tracking, Redux store, and authentication context.
 * Note: Sentry is configured to send default PII data for error tracking.
 */
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
//
import * as Sentry from "@sentry/react";

import App from './App';
import { store } from './store';

// ----------------------------------------------------------------------

Sentry.init({
  dsn: "https://f50b06966d30c0c687d9752eb4111980@o4510401957789706.ingest.de.sentry.io/4510403012722768",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <Provider store={store}>
          <App />
        </Provider>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);

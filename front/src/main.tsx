/**
 * Application entry point that initializes React, Sentry error tracking, and root providers.
 * Sets up the React DOM root with Redux store, routing, and theme providers.
 * Note: Sentry is configured with default PII collection enabled for error tracking.
 */
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//
import * as Sentry from "@sentry/react";
import App from './App';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import themeVars from 'src/assets/scss/_themes-vars.module.scss';


Sentry.init({
  dsn: "https://df65abe8e698f5bb3a7a5a90a2afc21e@o4510401957789706.ingest.de.sentry.io/4510402416279632",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});
// ----------------------------------------------------------------------


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <style>
      {`
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          background-color: ${themeVars.bgSite};
        }
        #root {
          min-height: 100vh;
        }
      `}
    </style>
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <Provider store={store}>
    <App />
          </Provider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)

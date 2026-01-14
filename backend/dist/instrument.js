/**
 * Sentry error tracking initialization module.
 * Configures Sentry SDK for error monitoring and performance tracking across the application.
 * Must be loaded before any other application code to capture all errors.
 */
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: "https://5b869a501dfe9408e0e5a115dbbfae36@o4510401957789706.ingest.de.sentry.io/4510401961001040",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});
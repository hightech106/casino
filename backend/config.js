/**
 * Configuration module that exports the project root directory path.
 * Used throughout the application to resolve file paths relative to the backend root.
 * Note: This provides __dirname at the module level for consistent path resolution.
 */
module.exports = {
    DIR: __dirname
};

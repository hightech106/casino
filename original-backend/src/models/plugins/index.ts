/**
 * Plugin exports for Mongoose schema extensions.
 * Centralizes exports for toJSON and paginate plugins used across all models.
 * Provides reusable functionality for data serialization and query pagination.
 */
//ES6 conversion
import toJSON from './toJSON.plugin';
import paginate from './paginate.plugin';

export { toJSON, paginate };

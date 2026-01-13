/**
 * Module alias configuration for path resolution.
 * Sets up @root, @config, @controllers, @middlewares, @models, @services, and @utils aliases.
 * Uses different paths for development (src) vs production (dist) environments.
 */
import moduleAlias from 'module-alias';
import path from 'path';

const initAliases = () => {
    const aliasData =
        process.env.NODE_ENV === 'production'
            ? {
                  '@root': path.join(__dirname, '..', 'dist'),
                  '@config': path.join(__dirname, '..', 'dist', 'config'),
                  '@controllers': path.join(__dirname, '..', 'dist', 'controllers'),
                  '@middlewares': path.join(__dirname, '..', 'dist', 'middlewares'),
                  '@models': path.join(__dirname, '..', 'dist', 'models'),
                  '@services': path.join(__dirname, '..', 'dist', 'services'),
                  '@utils': path.join(__dirname, '..', 'dist', 'utils')
              }
            : {
                  '@root': path.join(__dirname, '..'),
                  '@config': `${__dirname}/config`,
                  '@controllers': `${__dirname}/controllers`,
                  '@middlewares': `${__dirname}/middlewares`,
                  '@models': `${__dirname}/models`,
                  '@services': `${__dirname}/services`,
                  '@utils': `${__dirname}/utils`
              };
    moduleAlias.addAliases(aliasData);
}

export default initAliases;
/**
 * Main entry point for the casino backend application.
 * Initializes database connection, starts the Express server, and sets up error handlers.
 * Handles graceful shutdown on SIGTERM and uncaught exceptions.
 */
// @ts-ignore
import * as mongoose from 'mongoose';
import config from './config';
import logger from './config/logger';
import initAliases from './module.aliases';
initAliases();
import appServer from './app';

// @ts-ignore
const main = async () => {
    mongoose.set('strictQuery', true);
    await mongoose
        .connect(config.mongodbURL)
        .then(() => {
            console.log('--database connection successful--');
        })
        .catch((err: any) => {
            console.log('--error connecting to database---');
            console.log(err);
        });

    const server = appServer.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
    });

    const exitHandler = () => {
        if (server) {
            server.close(() => {
                logger.info('Server closed');
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedErrorHandler = (error: any) => {
        logger.error(error);
        exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
        logger.info('SIGTERM received');
        if (server) {
            server.close();
        }
    });
};

main();

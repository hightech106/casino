/**
 * Express application setup and configuration.
 * Configures middleware, routes, static files, Socket.IO, and game-specific socket handlers.
 * Integrates Sentry for error tracking and Swagger for API documentation.
 */
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: "https://0de35f9c1e3a7c9ec54c46aec53c6876@o4510401957789706.ingest.de.sentry.io/4510402967568464",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});

import http from 'http';
import path from 'path';
import cors from 'cors';
import express from 'express';
import socket from 'socket.io';

import routes from './routes';
import socketServer from './socket';
import { swaggerUi, swaggerSpec } from './swagger';

import { errorConverter, errorHandler } from './middlewares/error';
import { initCron } from './services/base/cron.service';

const frontend = process.env.FRONTEND as string;
const admin = process.env.ADMIN as string;

const app = express();
app.use(
    cors({
        origin: '*'
    })
);

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public/avatar')));
app.use(express.static(path.join(__dirname, '../public/default')));
app.use(express.static(path.join(__dirname, '../../', frontend)));
app.use(express.static(path.join(__dirname, '../../', admin)));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

Sentry.setupExpressErrorHandler(app);

app.use(errorConverter);

app.use(errorHandler);

app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../../', frontend, '/index.html'));
});

const server = http.createServer(app);
const io = new socket.Server(server, { cors: { origin: '*' } });

global.io = io;
socketServer(io);

initCron();

export default server;

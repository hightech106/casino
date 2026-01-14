/**
 * Standalone microservice for processing sports match results.
 * Runs on PORT+10, continuously processes and updates match results from sports API.
 * Separate process to isolate result processing from main API server.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("regenerator-runtime");
const mongoose_1 = require("mongoose");
const http_1 = require("http");
const sportsresult_1 = require("./controllers/sports/sportsresult");
try {
    const port = Number(process.env.PORT) + 10;
    mongoose_1.default.connect(process.env.DATABASE).then(() => {
        const server = (0, http_1.createServer)((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Result');
        });
        server.listen(port, '127.0.0.1', () => {
            console.log('server listening on:', port);
            (0, sportsresult_1.Result)();
        });
    });
}
catch (error) {
    console.log(`Result`, error);
}

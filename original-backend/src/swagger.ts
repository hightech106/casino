/**
 * Swagger/OpenAPI documentation configuration.
 * Sets up API documentation endpoint using swagger-jsdoc and swagger-ui-express.
 * Scans swagger.ts files in the docs directory for API route documentation.
 */
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js TypeScript API',
            version: '1.0.0',
            description: 'API documentation for the Node.js TypeScript project'
        },
        servers: [
            {
                url: 'http://localhost:1202'
            }
        ]
    },
    apis: ['./src/docs/*.swagger.ts'] // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };

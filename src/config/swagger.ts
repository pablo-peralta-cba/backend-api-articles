import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Artículos',
      version: '1.0.0',
      description:
        'API RESTful para la gestión de artículos, con autenticación, validación y filtrado.',
      contact: {
        name: 'Pablo Peralta',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desarrollo Local',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API Key para autenticación en rutas protegidas',
        },
      },
    },
    security: [], 
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

export default swaggerOptions;

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { container } from 'tsyringe';

//Importaciones para documentar la api y sus endpoints
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger';

// Importamos los middlewares
import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/requestLogger.middleware';

// Importamos las clases y interfaces que necesitamos
import { DbClient, MySQLClient } from './config/database';




dotenv.config();

const app = express();


// Configuración de tsyringe
// Registramos MySQLClient como singleton para la implementación de DbClient
container.registerSingleton<DbClient>("DbClient", MySQLClient);



app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Configuración de Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

//Importamos el router
import articlesRouter from './routes/article.routes';


// Montamos las rutas
app.use('/api/articles', articlesRouter);


// Ruta de prueba base
app.get('/', (_req, res) => {
  res.send('API de Gestión de Artículos funcionando!');
});

//Middleware de Manejo de Errores Global
app.use(errorHandler);

export default app;
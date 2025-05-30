import 'reflect-metadata';
import app from './app';
import logger from './utils/logger';

const port = process.env.PORT || 3000;


app.listen(port, () => {
  logger.info(`Servidor activo en puerto ${port}`);
});


process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
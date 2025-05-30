import 'reflect-metadata';
import { MySQLClient } from '../config/database';
import logger from '../utils/logger';
import * as dotenv from 'dotenv';
import { PoolConnection } from 'mysql2/promise';

dotenv.config();

async function runMigrations() {
  const dbClient = new MySQLClient();
  let connection: PoolConnection | undefined;
  try {
     logger.info('Iniciando migraciones de base de datos...');
     connection = await dbClient.getPoolConnection();

    const createArticlesTableSql = `
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `;
    logger.info('Aplicando migración: Crear tabla articles...');
    await connection.execute(createArticlesTableSql);
    logger.info('Migración "Crear tabla articles" aplicada exitosamente.');


    logger.info('Todas las migraciones completadas exitosamente.');

  } catch (error) {
    logger.error('Error durante la ejecución de las migraciones:', { error });
    process.exit(1);
  } finally {
    if (connection) {
      connection.release(); // Acá liberamos la conexión de vuelta al pool
      logger.info('Conexión de base de datos liberada.');
    }
    // Cierra el pool de conexiones al terminar las migraciones
    await dbClient.end();
  }
}


runMigrations();
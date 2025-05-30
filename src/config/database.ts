import mysql, { Pool as MySQLPool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { injectable } from 'tsyringe';

dotenv.config();

// Definimos una interfaz para el cliente de la base de datos para mantener la abstracción,
// aunque ahora solo tengamos una implementación. Esto brinda escalabilidad porque facilita futuras extensiones.
export interface DbClient {
  query<T extends RowDataPacket[]>(sql: string, params?: any[]): Promise<T>;
  execute<T extends ResultSetHeader>(sql: string, params?: any[]): Promise<T>;
  
  /**Acá obtenemos una conexión individual del pool.*/
  getPoolConnection(): Promise<PoolConnection>;

  end(): Promise<void>;


  // Cuando sea necesario, se pueden agregar más métodos para transacciones que garanticen mayor seguridad en la gestión de la DB:
  // beginTransaction(): Promise<void>;
  // commit(): Promise<void>;
  // rollback(): Promise<void>;
}

@injectable() // para que TSyringe inyecte esta clase en el repository
export class MySQLClient implements DbClient {
  private static pool: MySQLPool;

  constructor() {
    const {
      DB_HOST,
      DB_USER,
      DB_PASSWORD,
      DB_DATABASE,
      DB_PORT
    } = process.env;

    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_DATABASE) {
      throw new Error('Faltan variables de entorno para la configuración de MySQL.');
    }

    if (!MySQLClient.pool) {
      MySQLClient.pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        port: parseInt(DB_PORT || '3306', 10),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      logger.info('MySQL pool inicializado correctamente.');

      MySQLClient.pool.getConnection()
        .then(connection => {
          logger.info('Pool de conexiones MySQL: Conexión inicial exitosa.');
          connection.release();
        })
        .catch(err => {
          logger.error('Pool de conexiones MySQL: Error en la conexión inicial:', err);
        });
    }
  }

  async query<T extends RowDataPacket[]>(sql: string, params?: any[]): Promise<T> {
    try {
      const [rows] = await MySQLClient.pool.execute<T>(sql, params);
      return rows;
    } catch (error: any) {
      logger.error(`Error en query SQL: ${sql} | Error: ${error.message}`);
      throw error;
    }
  }

  async execute<T extends ResultSetHeader>(sql: string, params?: any[]): Promise<T> {
    try {
      const [result] = await MySQLClient.pool.execute<T>(sql, params);
      return result;
    } catch (error: any) {
      logger.error(`Error en ejecución SQL: ${sql} | Error: ${error.message}`);
      throw error;
    }
  }

  async getPoolConnection(): Promise<PoolConnection> {
    try {
      const connection = await MySQLClient.pool.getConnection();
      logger.debug('Conexión individual obtenida del pool.');
      return connection;
    } catch (error: any) {
      logger.error('Error al obtener conexión del pool:', { error });
      throw error;
    }
  }

  async end(): Promise<void> {
    try {
      await MySQLClient.pool.end();
      logger.info('Pool de conexiones a la base de datos cerrado.');
    } catch (error: any) {
      logger.error('Error al cerrar el pool de conexiones:', { error });
      throw error;
    }
  }
}

// Para usar con tsyringe
export const getDatabaseClient = (): DbClient => {
  return new MySQLClient();
};
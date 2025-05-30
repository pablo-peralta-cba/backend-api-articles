import { injectable, inject } from 'tsyringe';
import { DbClient} from '../config/database';
import { Article, CreateArticleDTO, UpdateArticleDTO } from '../models/Article';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import logger from '../utils/logger';


@injectable()
export class ArticleRepository {
  private db: DbClient;

  // tsyinge va a inyectar una instancia de la interface DbClient(en este caso, MySQLClient)
  constructor(@inject("DbClient") dbClient: DbClient) { 
    this.db = dbClient;
  }

  async create(articleData: CreateArticleDTO): Promise<Article> {
    try {    const sql = `
      INSERT INTO articles (name, brand, is_active)
      VALUES (?, ?, ?)
    `;
    const result = await this.db.execute<ResultSetHeader>(sql, [
      articleData.name,
      articleData.brand,
      true // Cada artículo nuevo está activo por defecto
    ]);

    const insertedId = result.insertId;
    if (!insertedId) {
      throw new Error('Error al obtener el ID del artículo insertado.');
    }

    // Después de insertar, recuperamos el artículo completo (debe tener fecha de modificación y el ID)
    const [newArticleRaw] = await this.db.query<Article & RowDataPacket[]>(`SELECT * FROM articles WHERE id = ?`, [insertedId]);

    if (!newArticleRaw) {
      throw new Error(`Artículo con ID ${insertedId} no encontrado después de la creación.`);
    }
    const newArticle: Article = newArticleRaw as Article;
    return newArticle;
} catch (error) {
    logger.error('Error en ArticleRepository.create', { error });
    throw error;
  }

  }


  async findById(id: number): Promise<Article | null> {
    try{
         const sql = `SELECT id, name, brand, modified_at, is_active FROM articles WHERE id = ?`;
    const [articleRaw] = await this.db.query<Article & RowDataPacket[]>(sql, [id]);
    if (!articleRaw) {
        return null;
    }
    const article: Article = articleRaw as Article;
    return article;  
    } catch (error) {
        logger.error('Error en ArticleRepository.findById', { error });
        throw error;
      }
  }


  async find(name?: string, isActive?: boolean, exactMatch?: boolean): Promise<Article[]> {
    try{
            let sql = `SELECT id, name, brand, modified_at, is_active FROM articles WHERE 1=1`;
    const params: any[] = [];

    if (name) {
      if (exactMatch) {
        sql += ` AND name = ?`;
        params.push(name);
      } else {
        sql += ` AND name LIKE ?`; // Búsqueda parcial
        params.push(`%${name}%`);
      }
    }

    if (typeof isActive === 'boolean') {
      sql += ` AND is_active = ?`;
      params.push(isActive ? 1 : 0);
    }

    const articlesRaw = await this.db.query<RowDataPacket[]>(sql, params);
    const articles: Article[] = articlesRaw as Article[];
    return articles;
    } catch (error) {
        logger.error('Error en ArticleRepository.find', { error });
        throw error;
      }
  }

  async update(id: number, updateData: UpdateArticleDTO): Promise<Article | null> {
    try {
      const fieldsToUpdate: string[] = [];
      const params: any[] = [];

      if (updateData.name !== undefined) {
        fieldsToUpdate.push('name = ?');
        params.push(updateData.name);
      }
      if (updateData.brand !== undefined) {
        fieldsToUpdate.push('brand = ?');
        params.push(updateData.brand);
      }
      // 'is_active' se puede actualizar aquí también si se incluye en el PATCH general
      if (updateData.is_active !== undefined) {
        fieldsToUpdate.push('is_active = ?');
        params.push(updateData.is_active);
      }

      if (fieldsToUpdate.length === 0) {
        logger.info(`No hay campos para actualizar en el artículo con ID: ${id}`);
        return this.findById(id);
      }

      fieldsToUpdate.push('modified_at = CURRENT_TIMESTAMP');

      const sql = `UPDATE articles SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
      params.push(id);

      const result = await this.db.execute<ResultSetHeader>(sql, params);

      if (result.affectedRows === 0) {
        return null;
      }

 
      return this.findById(id);

    } catch (error) {
      logger.error('Error en ArticleRepository.update', { id, updateData, error });
      throw error; 
    }
  }



  async deactivate(id: number): Promise<boolean> {
    try {
      const sql = `UPDATE articles SET is_active = FALSE, modified_at = CURRENT_TIMESTAMP WHERE id = ?`;
      const result = await this.db.execute<ResultSetHeader>(sql, [id]);
      return result.affectedRows > 0; // Retorna true si al menos una fila fue afectada (desactivada).
    } catch (error) {
      logger.error('Error en ArticleRepository.deactivate', { id, error });
      throw error; 
    }
  }
}

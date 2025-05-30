import { injectable, inject } from 'tsyringe';
import { Article, CreateArticleDTO, UpdateArticleDTO } from '../models/Article';
import { ArticleRepository } from '../repositories/article.repository';
import  logger from '../utils/logger';

@injectable()
export class ArticleService {
  constructor(
    @inject(ArticleRepository) private articleRepository: ArticleRepository
  ) {}

  // Convertimos el 0/1 a boolean
  private mapArticleFromDb(article: Article): Article {

    return {
      ...article,
      is_active: Boolean(article.is_active)
    };
  }


  async createArticle(articleData: CreateArticleDTO): Promise<Article> {
    try{
        const newArticle = await this.articleRepository.create(articleData);
        return this.mapArticleFromDb(newArticle);
    } catch (error) {
        logger.error('Error en ArticleService.createArticle', { error });
        throw error;
      }
  }


  async getArticleById(id: number): Promise<Article | null> {
    try{
        const article = await this.articleRepository.findById(id);
        return article ? this.mapArticleFromDb(article) : null;
    }  catch (error) {
        logger.error('Error en ArticleService.getArticleById', { error, id });
        throw error;
      }
  }


  async getArticles(name?: string, isActive?: boolean, exactMatch?: boolean): Promise<Article[]> {
    try {
      logger.info(`Obteniendo todos los artículos con filtros de búsqueda (pre-separación): nombre=${name}, activo=${isActive}, exacto=${exactMatch}`);
      const articles = await this.articleRepository.find(name, undefined, exactMatch);
      logger.info(`Se encontraron ${articles.length} artículos antes de la separación.`);
      return articles;
    } catch (error: any) {
      logger.error(`Error en ArticleService.getArticles: ${error.message || error}`, { name, isActive, exactMatch });
      throw error;
    }
  }


  async updateArticle(id: number, updateData: UpdateArticleDTO): Promise<Article | null> {
    try{
    const updatedArticle = await this.articleRepository.update(id, updateData);
    return updatedArticle;
    }  catch (error) {
        logger.error('Error en ArticleService.updateArticle', { error, id, updateData });
        throw error;
      }
  }

// Desactivación de un artículo (PATCH /:id/deactivate)
  async deactivateArticle(id: number): Promise<boolean> {
    try{
        return this.articleRepository.deactivate(id); // Desactivar no devuelve el artículo completo, solo un booleano de éxito.
    }  catch (error) {
        logger.error('Error en ArticleService.deactivateArticle', { error, id });
        throw error;
      }
  }
}
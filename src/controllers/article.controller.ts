import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ArticleService } from '../services/article.service';
import { CreateArticleDTO, UpdateArticleDTO } from '../models/Article';
import logger from '../utils/logger';
import { ZodError } from 'zod';

@injectable()
export class ArticleController {

constructor(@inject(ArticleService) private articleService: ArticleService) {
  
  }

  // Creación de un artículo (POST /api/articles)
  async createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const articleData: CreateArticleDTO = req.body;
      const newArticle = await this.articleService.createArticle(articleData);
      res.status(201).json(newArticle);
    } catch (error) {
      // En este punto, el logger del service ya capturó el error interno, entonces solo chequeamos errores de Zod
      if (error instanceof ZodError) {
        logger.warn('Error de validación al crear artículo:', { errors: error.errors, body: req.body });
        res.status(400).json({ message: 'Validación fallida', errors: error.errors });
      } else {
        logger.error('Error inesperado en ArticleController.createArticle:', { error });
        next(error); 
      }
    }
  }

  // Obtenemos un artículo por ID (GET /api/articles/:id)
  async getArticleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.params.id ya será un número gracias al middleware de validación con articleIdSchema
      const id = parseInt(req.params.id, 10);
      const article = await this.articleService.getArticleById(id);

      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ message: 'Artículo no encontrado.' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Error de validación al obtener artículo por ID:', { errors: error.errors, params: req.params });
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
      } else {
        logger.error('Error inesperado en ArticleController.getArticleById:', { error });
        next(error);
      }
    }
  }

  // --- Manejo de la obtención de todos los artículos con filtros (GET /api/articles) ---
  async getArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, exactMatch } = req.query;

      // Cast a los tipos correctos
      const nameParam = typeof name === 'string' ? name : undefined;
      const exactMatchParam = exactMatch === 'true'; 

      logger.info(`Recibida solicitud para obtener todos los artículos con filtros: name=${nameParam}, exactMatch=${exactMatchParam}`);

     
      const allArticles = await this.articleService.getArticles(nameParam, undefined, exactMatchParam);

      const activeArticles = allArticles.filter(article => article.is_active);
      const inactiveArticles = allArticles.filter(article => !article.is_active);

      res.status(200).json({
        "Artículos activos": activeArticles,
        "Artículos inactivos": inactiveArticles
      });
    } catch (error) {
      logger.error(`Error en getArticles: ${error}`);
      next(error);
    }
  }

  // async getArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { name, isActive, exactMatch } = req.query;

  //     // Conversión de query params a los tipos esperados por el servicio
  //     const isActiveBoolean = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
  //     const exactMatchBoolean = exactMatch === 'true' ? true : undefined;

  //     const articles = await this.articleService.getArticles(
  //       name as string,
  //       isActiveBoolean,
  //       exactMatchBoolean
  //     );
  //     res.status(200).json(articles);
  //   } catch (error) {
  //     logger.error('Error inesperado en ArticleController.getArticles:', { error, query: req.query });
  //     next(error);
  //   }
  // }

  // --- Manejo de la actualización de un artículo (PUT /api/articles/:id) ---
  async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const updateData: UpdateArticleDTO = req.body;

      if (isNaN(id)) {
        res.status(400).json({ message: 'ID de artículo inválido.' });
        return;
      }

      const updatedArticle = await this.articleService.updateArticle(id, updateData);

      if (updatedArticle) {
        res.status(200).json(updatedArticle);
      } else {
        res.status(404).json({ message: 'Artículo no encontrado para actualizar.' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Error de validación al actualizar artículo:', { errors: error.errors, id: req.params.id, body: req.body });
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
        return;
      } else {
        logger.error('Error inesperado en ArticleController.updateArticle:', { error });
        next(error);
      }
    }
  }

  // --- Manejo de la desactivación de un artículo (PATCH /api/articles/:id/deactivate) ---
  async deactivateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'ID de artículo inválido.' });
        return;
      }
      const success = await this.articleService.deactivateArticle(id);

      if (success) {
        res.status(200).json({ message: 'Artículo desactivado exitosamente.' });
      } else {
        res.status(404).json({ message: 'Artículo no encontrado para desactivar.' });
      }
    } catch (error) {
      logger.error('Error inesperado en ArticleController.deactivateArticle:', { error });
      next(error);
    }
  }
}
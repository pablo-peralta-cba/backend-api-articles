import { Router } from 'express';
import { container } from 'tsyringe';
import { ArticleController } from '../controllers/article.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticateApiKey } from '../middlewares/auth.middleware';
import {
  createArticleSchema,
  updateArticleSchema,
  articleIdSchema,
} from '../models/Article';

const articlesRouter = Router();

// Inyección automática de dependencias con tsyringe
const articleController = container.resolve(ArticleController);

/**
 * @swagger
 * tags:
 *   - name: Artículos
 *     description: Operaciones de gestión de artículos
 */

// --- Rutas para Artículos ---

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Crea un nuevo artículo
 *     tags: [Artículos]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateArticleDTO'
 *     responses:
 *       201:
 *         description: Artículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Datos de entrada inválidos (errores de validación)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado (API Key faltante o inválida)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
articlesRouter.post(
  '/',
  authenticateApiKey,
  validate(createArticleSchema, 'body'),
  (req, res, next) => articleController.createArticle(req, res, next)
);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Obtiene un artículo por su ID
 *     tags: [Artículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: ID único del artículo
 *     responses:
 *       200:
 *         description: Datos del artículo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: ID de artículo inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Artículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Error interno del servidor
 */
articlesRouter.get(
  '/:id',
  validate(articleIdSchema, 'params'),
  (req, res, next) => articleController.getArticleById(req, res, next)
);

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Obtiene una lista de artículos separados por estado activo/inactivo con filtros opcionales.
 *     tags: [Artículos]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtra artículos por nombre (coincidencia parcial por defecto).
 *       - in: query
 *         name: exactMatch
 *         schema:
 *           type: boolean
 *         description: Si es 'true', busca una coincidencia exacta del nombre.
 *     responses:
 *       200:
 *         description: Lista de artículos separados en activos e inactivos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Artículos activos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 Artículos inactivos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *             example:
 *               Artículos activos:
 *                 - id: 1
 *                   name: "Laptop X"
 *                   brand: "BrandA"
 *                   modified_at: "2023-01-15T10:00:00Z"
 *                   is_active: true
 *                 - id: 3
 *                   name: "Mouse Y"
 *                   brand: "BrandC"
 *                   modified_at: "2023-02-20T11:30:00Z"
 *                   is_active: true
 *               Artículos inactivos:
 *                 - id: 2
 *                   name: "Teclado Z"
 *                   brand: "BrandB"
 *                   modified_at: "2023-01-10T09:00:00Z"
 *                   is_active: false
 *       500:
 *         description: Error interno del servidor.
 */
articlesRouter.get(
  '/',
  (req, res, next) => articleController.getArticles(req, res, next)
);

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Actualiza uno o más campos de un artículo existente
 *     tags: [Artículos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: ID del artículo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateArticleDTO'
 *     responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Datos de entrada inválidos o ID de artículo inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado (API Key faltante o inválida)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Artículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Error interno del servidor
 */
articlesRouter.patch(
  '/:id',
  authenticateApiKey,
  validate(articleIdSchema, 'params'),
  validate(updateArticleSchema, 'body'),
  (req, res, next) => articleController.updateArticle(req, res, next)
);

/**
 * @swagger
 * /articles/{id}/deactivate:
 *   patch:
 *     summary: Desactiva un artículo por su ID (DELETE lógico)
 *     tags: [Artículos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: ID del artículo a desactivar
 *     responses:
 *       200:
 *         description: Artículo desactivado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: ID de artículo inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado (API Key faltante o inválida)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Artículo no encontrado para desactivar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Error interno del servidor
 */
articlesRouter.patch(
  '/:id/deactivate',
  authenticateApiKey,
  validate(articleIdSchema, 'params'),
  (req, res, next) => articleController.deactivateArticle(req, res, next)
);

export default articlesRouter;

import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateArticleDTO:
 *       type: object
 *       required:
 *         - name
 *         - brand
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del artículo.
 *           example: Teclado Mecánico RGB
 *         brand:
 *           type: string
 *           description: Marca del artículo.
 *           example: LogiTech
 *
 *     UpdateArticleDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nuevo nombre del artículo.
 *           example: Teclado Mecánico RGB Pro
 *         brand:
 *           type: string
 *           description: Nueva marca del artículo.
 *           example: Razer
 *         is_active:
 *           type: boolean
 *           description: Estado de actividad del artículo.
 *           example: true
 *
 *     Article:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - brand
 *         - modified_at
 *         - is_active
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Identificador único del artículo.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre del artículo.
 *           example: Teclado Mecánico RGB
 *         brand:
 *           type: string
 *           description: Marca del artículo.
 *           example: LogiTech
 *         modified_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última modificación.
 *           example: 2023-10-26T10:00:00Z
 *         is_active:
 *           type: boolean
 *           description: Estado de actividad del artículo.
 *           example: true
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del error.
 *           example: Validación fallida
 *         errors:
 *           type: array
 *           description: Detalles de los errores de validación (opcional).
 *           items:
 *             type: object
 *             properties:
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 *               message:
 *                 type: string
 *               code:
 *                 type: string
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de confirmación.
 *           example: Operación exitosa.
 */


// Interfaz para el modelo de datos del Artículo
export interface Article {
  id: number;
  name: string;
  brand: string;
  modified_at: Date;
  is_active: boolean;
}


// Esquema Zod para crear un nuevo artículo
export const createArticleSchema = z.object({
  name: z.string()
    .trim()
    .min(3, { message: 'El nombre del artículo debe tener al menos 3 caracteres.' })
    .max(200, { message: 'El nombre del artículo no puede superar los 200 caracteres.' }),
  brand: z.string()
    .trim()
    .min(2, { message: 'La marca del artículo debe tener al menos 2 caracteres.' })
    .max(200, { message: 'La marca del artículo no puede superar los 200 caracteres.' }),
});

// Tipo de datos inferido del esquema para usarlo en otras partes
export type CreateArticleDTO = z.infer<typeof createArticleSchema>;


// Esquema Zod para la actualización de un artículo, donde todos los campos son opcionales.
// El id se pasa en la ruta.
export const updateArticleSchema = z.object({
  name: z.string()
    .min(3, { message: 'El nombre del artículo debe tener al menos 3 caracteres.' })
    .max(255, { message: 'El nombre del artículo no puede exceder los 255 caracteres.' })
    .optional(),
  brand: z.string()
    .min(2, { message: 'La marca del artículo debe tener al menos 2 caracteres.' })
    .max(255, { message: 'La marca del artículo no puede exceder los 255 caracteres.' })
    .optional(),
  is_active: z.boolean().optional(),
}).partial();

// Extraemos el tipo de datos de este esquema
export type UpdateArticleDTO = z.infer<typeof updateArticleSchema>;


// Esquema para el ID de un artículo (validación de parámetros de ruta)
export const articleIdSchema = z.object({
  id: z.string().refine(value => !isNaN(parseInt(value, 10)), {
    message: 'El ID del artículo debe ser un número válido.'
  }).transform(value => parseInt(value, 10)),
});

// Extraemos el tipo de datos de este esquema
export type ArticleIdParam = z.infer<typeof articleIdSchema>;
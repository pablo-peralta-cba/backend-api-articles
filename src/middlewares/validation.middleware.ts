import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod'; 
import logger from '../utils/logger'; 


type ValidationTarget = 'body' | 'params' | 'query';


export const validate = (schema: AnyZodObject, target: ValidationTarget = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida la parte específica de la request
      // Usamos .parse() para que Zod lance un ZodError si la validación falla
      req[target] = await schema.parseAsync(req[target]);
      next(); 
    } catch (error: any) {
      if (error instanceof ZodError) {
       
        logger.warn(`Validación fallida para ${target} en ${req.path}`, {
          errors: error.errors,
          input: req[target],
          method: req.method,
          ip: req.ip
        });
        
       res.status(400).json({
          message: 'Validación fallida',
          errors: error.errors.map(err => ({
            path: err.path,
            message: err.message,
            code: err.code
          })),
        });
        return;
      }
      // Si es otro tipo de error, lo pasa al siguiente middleware de error global
      logger.error(`Un error inesperado ocurrió en la validación de ${target} en ${req.path}`, { error });
      next(error);
    }
  };
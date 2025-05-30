import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();


export const authenticateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.header('x-api-key');
  const expectedApiKey = process.env.API_KEY_SECRET;


  if (!expectedApiKey) {
    throw new Error('La variable de entorno API_KEY_SECRET no está definida.');
  }
  
  if (!apiKey) {
    logger.warn('Intento de acceso no autorizado: API Key faltante', { path: req.path, ip: req.ip });
    res.status(401).json({ message: 'Acceso no autorizado: API Key faltante.' });
    return;
  }

  if (apiKey !== expectedApiKey) {
    logger.warn('Intento de acceso no autorizado: API Key inválida', { path: req.path, ip: req.ip });
    res.status(401).json({ message: 'Acceso no autorizado: API Key inválida.' });
    return;
  }

  next();
};
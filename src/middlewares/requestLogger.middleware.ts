import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Incoming request', {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query,
      body: req.body,
    });
  }
  next();
};

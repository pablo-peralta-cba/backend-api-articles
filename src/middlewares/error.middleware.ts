import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger'; 


export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Unhandled API Error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.statusCode && typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600) {
    statusCode = err.statusCode;
  }
  if (err.message) {
    message = err.message;
  }


  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
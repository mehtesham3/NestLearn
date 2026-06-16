import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddelware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

export function loggerMiddelware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`${req.method} ${req.url}`);
  next();
}

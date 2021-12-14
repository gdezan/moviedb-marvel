import { Request, Response, NextFunction } from 'express';

import { MovieDBService } from '../services';

export default class ActorController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send('Hello, World!');
    } catch (error) {
      return next(error);
    }
  }
}

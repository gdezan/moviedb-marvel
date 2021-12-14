import { Request, Response, NextFunction } from 'express';

import { MovieDBService } from '../services';
import ApiError from '../utils/ApiError';

const movieDB = new MovieDBService();

export default class ActorController {
  static async movies(req: Request, res: Response, next: NextFunction) {
    const { query } = req.query;

    let actorId: number | null;
    try {
      actorId = await movieDB.getActorId(query?.toString() ?? '');
    } catch (error) {
      console.error("Error while fetching the actor's id");
      return next(error);
    }

    if (!actorId) {
      next(new ApiError(404, 'Actor not found'));
      return;
    }

    try {
      const result = await movieDB.getMarvelMoviesFromActor(actorId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error while fetching the actor's Marvel Movies");
      next(error);
    }
  }
}

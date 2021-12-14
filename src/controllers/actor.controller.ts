import { Request, Response, NextFunction } from 'express';

import { MovieDBService } from '../services';
import { Actor } from '../types';
import ApiError from '../utils/ApiError';
import { getActorSummary } from '../utils/functions';

const movieDB = new MovieDBService();

export default class ActorController {
  static async movies(req: Request, res: Response, next: NextFunction) {
    const { query } = req.query;

    let actor: Actor | null;
    try {
      actor = await movieDB.getActor(query?.toString() ?? '');
    } catch (error) {
      console.error("Error while fetching the actor's id");
      return next(error);
    }

    if (!actor) {
      next(new ApiError(404, 'Actor not found'));
      return;
    }

    try {
      const result = await movieDB.getMarvelMoviesFromActor(actor.externalId);
      res.status(200).json(getActorSummary(actor, result));
    } catch (error) {
      console.error("Error while fetching the actor's Marvel Movies");
      next(error);
    }
  }
}

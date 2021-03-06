import { Request, Response, NextFunction } from 'express';
import { compareTwoStrings } from 'string-similarity';

import { MovieDBService } from '../services';
import { Actor, ActorSummary, CharacterActors, MovieAsCast } from '../types';
import ApiError from '../utils/ApiError';
export default class ActorController {
  movieDB: MovieDBService;

  constructor() {
    this.movieDB = new MovieDBService(
      process.env.MOVIEDB_API_URL as string,
      process.env.MOVIEDB_API_KEY as string,
    );
  }

  public async getSummary(req: Request, res: Response, next: NextFunction) {
    const { query } = req.query;

    try {
      const result = await this.getActorSummaryFromQuery(query as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getCommonCharacters(req: Request, res: Response, next: NextFunction) {
    const { actors } = req.query;

    const actorSummaries = await Promise.all(
      (actors as string[]).map(async (actorQuery) => {
        try {
          const summary = await this.getActorSummaryFromQuery(actorQuery);
          return summary;
        } catch (error) {
          console.log(`Error while fetching actor ${actorQuery}. Skipping.`);
          return null;
        }
      }),
    );

    res
      .status(200)
      .json(this.buildCommonActorsPerCharacter(actorSummaries.filter(Boolean) as ActorSummary[]));
  }

  private async getActorSummaryFromQuery(query: string): Promise<ActorSummary> {
    let actor: Actor | null;
    try {
      actor = await this.movieDB.getActor(query);
    } catch (error) {
      console.error("Error while fetching the actor's id");
      throw error;
    }

    if (!actor) {
      throw new ApiError(404, 'Actor not found');
    }

    try {
      const result = await this.movieDB.getMarvelMoviesFromActor(actor.externalId);
      return this.getActorSummary(actor, result);
    } catch (error) {
      console.error("Error while fetching the actor's Marvel Movies");
      throw error;
    }
  }

  private getActorSummary(actor: Actor, movies: MovieAsCast[]): ActorSummary {
    const charactersSet = new Set(
      movies.map((m) => m.character).filter((c) => !c.includes('uncredited')),
    );
    return {
      name: actor.name,
      externalId: actor.externalId,
      movies,
      moviesPlayed: movies.length,
      differentCharacters: charactersSet.size,
      characters: Array.from(charactersSet),
    };
  }

  private buildCommonActorsPerCharacter(actorSummaries: ActorSummary[]): CharacterActors[] {
    const actorsPerCharacter: Record<string, Set<string>> = {};
    actorSummaries.forEach((actorSummary) => {
      actorSummary.characters.forEach((char) => {
        const closeMatch = Object.keys(actorsPerCharacter).find(
          (currChar) => compareTwoStrings(currChar, char) > 0.75,
        );
        if (closeMatch) {
          actorsPerCharacter[closeMatch].add(actorSummary.name);
        } else {
          actorsPerCharacter[char] = new Set([actorSummary.name]);
        }
      });
    });

    const characterActors: CharacterActors[] = [];
    Object.entries(actorsPerCharacter).forEach(([character, actors]) => {
      if (actors.size >= 2) {
        characterActors.push({
          character,
          actors: Array.from(actors),
        });
      }
    });
    return characterActors;
  }
}

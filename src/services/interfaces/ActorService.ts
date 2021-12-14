import { Actor, MovieAsCast } from '../../types';

interface IActorService {
  baseURL: string;
  marvelMovieIds: Set<number>;

  getActor: (query: string) => Promise<Actor | null>;
  getMoviesFromActor: (actorId: number) => Promise<MovieAsCast[]>;
  getMarvelMoviesFromActor: (actorId: number) => Promise<MovieAsCast[]>;
}

export default IActorService;

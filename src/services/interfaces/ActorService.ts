import { MovieAsCast } from '../../types';

interface IActorService {
  baseURL: string;
  marvelMovieIds: Set<number>;

  getMoviesFromActor: (actorId: number) => Promise<MovieAsCast[]>;
  getMarvelMoviesFromActor: (actorId: number) => Promise<MovieAsCast[]>;
}

export default IActorService;

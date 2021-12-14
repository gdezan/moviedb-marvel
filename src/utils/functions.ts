import { Actor, ActorSummary, MovieAsCast } from '../types';

export const getActorSummary = (actor: Actor, movies: MovieAsCast[]): ActorSummary => {
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
};

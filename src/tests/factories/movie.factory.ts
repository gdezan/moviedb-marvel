import { Actor, Movie, MovieAsCast } from '../../types';

export const buildMockMovie = (data?: Partial<Movie>): Movie => ({
  externalId: 1,
  language: 'en_US',
  releaseDate: '2020-06-19',
  summary: 'Movie Summary',
  title: 'Movie Title',
  ...data,
});

export const buildMockMovieAsCast = (data?: Partial<MovieAsCast>): MovieAsCast => ({
  ...buildMockMovie(data),
  character: 'Character',
  ...data,
});

export const buildMockActor = (data?: Partial<Actor>): Actor => ({
  externalId: 1,
  name: 'Actor Name',
  ...data,
});

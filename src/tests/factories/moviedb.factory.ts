import {
  Actor,
  Movie,
  MovieAsCast,
  MovieDBMovie,
  MovieDBMovieAsCast,
  MovieDBMovieCreditsResults,
  MovieDBSearchResults,
} from '../../types';

export const buildMockSearchResults = (
  data?: Partial<MovieDBSearchResults>,
): MovieDBSearchResults => ({
  page: 1,
  results: [
    {
      adult: false,
      gender: 2,
      id: 1896,
      known_for: [buildMockMovie()],
      known_for_department: 'Acting',
      name: 'Actor Name',
      popularity: 7.643,
      profile_path: '/path.jpg',
    },
  ],
  total_pages: 1,
  total_results: 1,
  ...data,
});

export const buildMockMovie = (data?: Partial<MovieDBMovie>): MovieDBMovie => ({
  adult: false,
  backdrop_path: 'bd.jpg',
  genre_ids: [1, 2, 4],
  id: 1234,
  media_type: 'movie',
  original_language: 'en',
  original_title: 'Movie Title',
  overview: 'Movie Overview',
  poster_path: '/path.jpg',
  release_date: '2018-04-25',
  title: 'Movie Title',
  video: false,
  vote_average: 8.3,
  vote_count: 23289,
});

export const buildMockMovieAsCast = (data?: Partial<MovieDBMovieAsCast>): MovieDBMovieAsCast => ({
  ...buildMockMovie(data),
  character: 'Char A',
  popularity: 1,
  credit_id: '123',
  order: 120,
  ...data,
});

export const buildMockMovieCreditsResults = (
  data?: Partial<MovieDBMovieCreditsResults>,
): MovieDBMovieCreditsResults => ({
  cast: [
    buildMockMovieAsCast(),
    buildMockMovieAsCast({ original_title: 'Avengers: Endgame', id: 299534, character: 'Char B' }),
  ],
  crew: [],
  id: 1,
  ...data,
});

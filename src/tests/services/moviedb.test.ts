import axios from 'axios';

import { MovieDBService } from '../../services';
import { MovieDBFactory } from '../factories';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const movieDB = new MovieDBService(process.env.MOVIEDB_API_URL, process.env.MOVIEDB_API_KEY);

describe('MovieDBService', () => {
  describe('constructor', () => {
    test('should throw an error if instance created with no required env vars', () => {
      expect(() => new MovieDBService('', undefined)).toThrow();
    });
  });
  describe('getActor', () => {
    test('should return as an Actor object', async (done) => {
      // Given
      mockedAxios.get = jest
        .fn()
        .mockResolvedValueOnce({ data: MovieDBFactory.buildMockSearchResults() });

      // When
      const result = await movieDB.getActor('actor');

      // Then
      expect(mockedAxios.get).toBeCalledWith(
        'https://api.themoviedb.org/3/search/person?query=actor&api_key=key',
      );
      expect(result).toStrictEqual({ externalId: 1896, name: 'Actor Name' });

      done();
    });

    test('should return null if no actor is found', async (done) => {
      // Given
      mockedAxios.get = jest.fn().mockResolvedValueOnce({
        data: MovieDBFactory.buildMockSearchResults({ total_results: 0 }),
      });

      // When
      const result = await movieDB.getActor('actor');

      // Then
      expect(mockedAxios.get).toBeCalledWith(
        'https://api.themoviedb.org/3/search/person?query=actor&api_key=key',
      );
      expect(result).toBeNull();

      done();
    });
  });

  describe('getMoviesFromActor', () => {
    test('should return a list of movies', async (done) => {
      // Given
      mockedAxios.get = jest
        .fn()
        .mockResolvedValueOnce({ data: MovieDBFactory.buildMockMovieCreditsResults() });

      // When
      const result = await movieDB.getMoviesFromActor(123);

      // Then
      expect(mockedAxios.get).toBeCalledWith(
        'https://api.themoviedb.org/3/person/123/movie_credits?api_key=key',
      );
      expect(result).toStrictEqual([
        {
          character: 'Char A',
          externalId: 1234,
          language: 'en',
          releaseDate: '2018-04-25',
          summary: 'Movie Overview',
          title: 'Movie Title',
        },
        {
          character: 'Char B',
          externalId: 299534,
          language: 'en',
          releaseDate: '2018-04-25',
          summary: 'Movie Overview',
          title: 'Avengers: Endgame',
        },
      ]);

      done();
    });
  });

  describe('getMarvelMoviesFromActor', () => {
    test('should return a list of marvel movies', async (done) => {
      // Given
      mockedAxios.get = jest
        .fn()
        .mockResolvedValueOnce({ data: MovieDBFactory.buildMockMovieCreditsResults() });

      // When
      const result = await movieDB.getMarvelMoviesFromActor(123);

      // Then
      expect(mockedAxios.get).toBeCalledWith(
        'https://api.themoviedb.org/3/person/123/movie_credits?api_key=key',
      );
      expect(result).toStrictEqual([
        {
          character: 'Char B',
          externalId: 299534,
          language: 'en',
          releaseDate: '2018-04-25',
          summary: 'Movie Overview',
          title: 'Avengers: Endgame',
        },
      ]);

      done();
    });
  });
});

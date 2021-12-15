import request from 'supertest';

import app from '../app';
import { MovieDBService } from '../services';
import { MovieFactory } from './factories';

const ENDPOINT = '/actor';

describe('Actor Routes', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /actor', () => {
    test("should return an actor's info", async (done) => {
      // Given
      const mockMovie = MovieFactory.buildMockMovieAsCast();
      MovieDBService.prototype.getActor = jest
        .fn()
        .mockResolvedValueOnce(MovieFactory.buildMockActor());
      MovieDBService.prototype.getMarvelMoviesFromActor = jest
        .fn()
        .mockResolvedValueOnce([mockMovie]);

      // When
      const params = new URLSearchParams({ query: 'John Doe' });
      const response = await request(app).get(`${ENDPOINT}?${params}`);

      // Then
      expect(MovieDBService.prototype.getActor).toBeCalledWith('John Doe');
      expect(MovieDBService.prototype.getMarvelMoviesFromActor).toBeCalledWith(1);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        characters: ['Character'],
        differentCharacters: 1,
        externalId: 1,
        movies: [
          {
            character: 'Character',
            externalId: 1,
            language: 'en_US',
            releaseDate: '2020-06-19',
            summary: 'Movie Summary',
            title: 'Movie Title',
          },
        ],
        moviesPlayed: 1,
        name: 'Actor Name',
      });
      done();
    });

    test('should return 404 Not Found if the actor is not found', async (done) => {
      // Given
      MovieDBService.prototype.getActor = jest.fn().mockResolvedValueOnce(null);
      MovieDBService.prototype.getMarvelMoviesFromActor = jest.fn().mockResolvedValueOnce(null);

      // When
      const params = new URLSearchParams({ query: 'John Doe' });
      const response = await request(app).get(`${ENDPOINT}?${params}`);

      // Then
      expect(MovieDBService.prototype.getActor).toBeCalledWith('John Doe');
      expect(MovieDBService.prototype.getMarvelMoviesFromActor).not.toBeCalled();
      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        message: 'Actor not found',
      });

      done();
    });

    test('should return 422 for invalid requests', async (done) => {
      // When
      const params = new URLSearchParams({ query: '' });
      let response = await request(app).get(`${ENDPOINT}?${params}`);

      // Then
      expect(response.status).toBe(422);
      expect(response.body).toStrictEqual({
        message: `\"query.query\" is not allowed to be empty`,
      });

      // When
      const params2 = new URLSearchParams({ foo: 'bar' });
      response = await request(app).get(`${ENDPOINT}?${params2}`);

      // Then
      expect(response.status).toBe(422);
      expect(response.body).toStrictEqual({
        message: `\"query.query\" is required - \"query.foo\" is not allowed`,
      });

      done();
    });

    describe('Error Scenarios', () => {
      test('should deal with a API Error while fetching an actor', async (done) => {
        // Given
        MovieDBService.prototype.getActor = jest
          .fn()
          .mockRejectedValueOnce(new Error('Fetch Actor Error'));
        MovieDBService.prototype.getMarvelMoviesFromActor = jest.fn().mockResolvedValueOnce(null);

        // When
        const params = new URLSearchParams({ query: 'John Doe' });
        const response = await request(app).get(`${ENDPOINT}?${params}`);

        // Then
        expect(MovieDBService.prototype.getActor).toBeCalledWith('John Doe');
        expect(MovieDBService.prototype.getMarvelMoviesFromActor).not.toBeCalled();
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({
          message: 'Something went wrong',
        });

        done();
      });

      test("should deal with a API Error while fetching an actor's marvel movies", async (done) => {
        // Given
        MovieDBService.prototype.getActor = jest
          .fn()
          .mockResolvedValueOnce(MovieFactory.buildMockActor());
        MovieDBService.prototype.getMarvelMoviesFromActor = jest
          .fn()
          .mockRejectedValueOnce(new Error('Marvel Error'));

        // When
        const params = new URLSearchParams({ query: 'John Doe' });
        const response = await request(app).get(`${ENDPOINT}?${params}`);

        // Then
        expect(MovieDBService.prototype.getActor).toBeCalledWith('John Doe');
        expect(MovieDBService.prototype.getMarvelMoviesFromActor).toBeCalledWith(1);
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({
          message: 'Something went wrong',
        });

        done();
      });
    });
  });

  describe('GET /actor/common-characters', () => {
    test('should return common characters for actors', async (done) => {
      // Given
      MovieDBService.prototype.getActor = jest
        .fn()
        .mockResolvedValueOnce(MovieFactory.buildMockActor({ name: 'Actor 1' }))
        .mockResolvedValueOnce(MovieFactory.buildMockActor({ externalId: 2, name: 'Actor 2' }))
        .mockResolvedValueOnce(MovieFactory.buildMockActor({ externalId: 3, name: 'Actor 3' }));
      MovieDBService.prototype.getMarvelMoviesFromActor = jest
        .fn()
        .mockResolvedValueOnce([
          MovieFactory.buildMockMovieAsCast({ character: 'Char A' }),
          MovieFactory.buildMockMovieAsCast({ character: 'Char B' }),
        ])
        .mockResolvedValueOnce([
          MovieFactory.buildMockMovieAsCast({ character: 'Char C' }),
          MovieFactory.buildMockMovieAsCast({ character: 'Char Bb' }),
          MovieFactory.buildMockMovieAsCast({ character: 'Char D' }),
        ])
        .mockResolvedValueOnce([
          MovieFactory.buildMockMovieAsCast({ character: 'Char A' }),
          MovieFactory.buildMockMovieAsCast({ character: 'Char C' }),
        ]);

      // When
      const params = new URLSearchParams();
      ['Actor 1', 'Actor 2', 'Actor 3'].forEach((s) => params.append('actors', s));
      const response = await request(app).get(`${ENDPOINT}/common-characters?${params}`);

      // Then
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        'Char A': ['Actor 1', 'Actor 3'],
        'Char B': ['Actor 1', 'Actor 2'],
        'Char C': ['Actor 2', 'Actor 3'],
      });
      done();
    });

    test('should skip a failed actor summary request', async (done) => {
      // Given
      MovieDBService.prototype.getActor = jest
        .fn()
        .mockResolvedValueOnce(MovieFactory.buildMockActor({ name: 'Actor 1' }))
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(MovieFactory.buildMockActor({ externalId: 3, name: 'Actor 3' }))
        .mockResolvedValueOnce(MovieFactory.buildMockActor({ externalId: 4, name: 'Actor 4' }));
      MovieDBService.prototype.getMarvelMoviesFromActor = jest
        .fn()
        .mockResolvedValueOnce([
          MovieFactory.buildMockMovieAsCast({ character: 'Char A' }),
          MovieFactory.buildMockMovieAsCast({ character: 'Char B' }),
        ])
        .mockResolvedValueOnce([
          MovieFactory.buildMockMovieAsCast({ character: 'Char C' }),
          MovieFactory.buildMockMovieAsCast({ character: 'Char Bb' }),
          MovieFactory.buildMockMovieAsCast({ character: 'Char D' }),
        ])
        .mockRejectedValueOnce(new Error('Actor fetching error'));

      // When
      const params = new URLSearchParams();
      ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'].forEach((s) => params.append('actors', s));
      const response = await request(app).get(`${ENDPOINT}/common-characters?${params}`);

      // Then
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        'Char B': ['Actor 1', 'Actor 3'],
      });
      done();
    });

    test('should return 422 for invalid requests', async (done) => {
      // When
      const params = new URLSearchParams();
      params.append('actors', 'Actor 1');
      let response = await request(app).get(`${ENDPOINT}/common-characters?${params}`);

      // Then
      expect(response.status).toBe(422);

      expect(response.body).toStrictEqual({
        message: `\"query.actors\" must be an array`,
      });

      // When
      const params2 = new URLSearchParams({ foo: 'bar' });
      response = await request(app).get(`${ENDPOINT}/common-characters?${params2}`);

      // Then
      expect(response.status).toBe(422);
      expect(response.body).toStrictEqual({
        message: `\"query.actors\" is required - \"query.foo\" is not allowed`,
      });

      done();
    });
  });
});

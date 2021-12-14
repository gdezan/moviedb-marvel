import axios from 'axios';

import {
  MovieAsCast,
  MovieDBMovieAsCast,
  MovieDBMovieCreditsResults,
  MovieDBSearchResults,
} from '../types';
import { MARVEL_MOVIES } from '../utils/constants';
import IActorService from './interfaces/ActorService';

export default class MovieDBService implements IActorService {
  baseURL: string;
  apiKey: string;
  marvelMovieIds: Set<number>;

  constructor() {
    if (!process.env.MOVIEDB_API_URL || !process.env.MOVIEDB_API_KEY) {
      throw new Error('Missing MovieDB environment');
    }

    this.baseURL = process.env.MOVIEDB_API_URL;
    this.apiKey = process.env.MOVIEDB_API_KEY;
    this.marvelMovieIds = new Set(Object.values(MARVEL_MOVIES));
  }

  private injectApiKey(url: string): string {
    const [baseUrl, queryString] = url.split('?');
    return `${baseUrl}?${queryString}&api_key=${this.apiKey}`;
  }

  private async get(url: string) {
    return (await axios.get(`${this.baseURL}${this.injectApiKey(url)}`)).data;
  }

  public async getActorId(query: string): Promise<number | null> {
    const params = new URLSearchParams({
      query,
    });

    const searchResults: MovieDBSearchResults = await this.get(
      `/search/person?${params.toString()}`,
    );
    if (searchResults.total_results === 0) return null;

    return searchResults.results[0].id;
  }

  public async getMoviesFromActor(actorId: number) {
    const movieCreditsResults: MovieDBMovieCreditsResults = await this.get(
      `/person/${actorId}/movie_credits`,
    );
    return movieCreditsResults.cast.map(this.parseMovieResponse);
  }

  public async getMarvelMoviesFromActor(actorId: number) {
    return (await this.getMoviesFromActor(actorId)).filter((movie) =>
      this.marvelMovieIds.has(movie.externalId),
    );
  }

  private parseMovieResponse(movie: MovieDBMovieAsCast): MovieAsCast {
    return {
      externalId: movie.id,
      character: movie.character,
      language: movie.original_language,
      releaseDate: movie.release_date,
      summary: movie.overview,
      title: movie.original_title,
    };
  }
}

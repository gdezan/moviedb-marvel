export interface Movie {
  externalId: number;
  language: string;
  title: string;
  summary: string;
  releaseDate: string;
}

export interface MovieAsCast extends Movie {
  character: string;
}

export interface MovieDBMovie {
  adult: boolean;
  backdrop_path: 'string';
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieDBMovieAsCast extends MovieDBMovie {
  popularity: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface MovieDBMovieAsCrew extends MovieDBMovie {
  popularity: number;
  department: string;
  job: string;
  credit_id: string;
}

export interface MovieDBSearchResults {
  page: number;
  results: {
    adult: boolean;
    gender: number;
    id: number;
    known_for: MovieDBMovie[];
    known_for_department: string;
    name: string;
    popularity: number;
    profile_path: string;
  }[];
  total_pages: number;
  total_results: number;
}

export interface MovieDBMovieCreditsResults {
  cast: MovieDBMovieAsCast[];
  crew: MovieDBMovieAsCrew[];
  id: number;
}

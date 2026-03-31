export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
}
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const movieService = {

  getMovieById: async (movieId: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Could not fetch movie");
    }

    return response.json();
  },

  searchMovies: async (searchTerm: string) => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      throw new Error("Could not search movies");
    }

    return response.json();
  },

  
  getPopularMovies: async () => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Could not fetch popular movies");
    }

    return response.json();
  },
};

export default movieService;
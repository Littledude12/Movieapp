import { useState, useEffect } from "react";
import {
  getFavorites,
  removeFavorite,
} from "../services/favoriteService";
import movieService from "../services/movieService";

function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);

      const data = await getFavorites();

      const movies = await Promise.all(
        data.map(async (f: any) => {
          const movie = await movieService.getMovieById(f.externalMovieId);
          return {
            ...movie,
            externalMovieId: f.externalMovieId,
          };
        })
      );

      setFavorites(movies);
    } catch (error) {
      console.error(error);
      setMessage("Could not load favorites.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  
  const handleRemoveFavorite = async (externalMovieId: number) => {
    try {
      await removeFavorite(externalMovieId);
      setMessage("Favorite removed.");
      await loadFavorites();
    } catch (error) {
      console.error(error);
      setMessage("Could not remove favorite.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-white mb-4">Your favorites</h1>

      {message && <div className="alert alert-info mt-3 text-center">{message}</div>}

      {isLoading ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="text-white mb-4">No favorites yet.</p>
      ) : (
        <div className="row">
          {favorites.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-4">
              <div className="card h-100">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  className="card-img-top"
                  alt={movie.title}
                />

                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{movie.title}</h6>

                  <button
                    className="btn btn-danger btn-sm mt-auto"
                    onClick={() =>
                      handleRemoveFavorite(movie.externalMovieId)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
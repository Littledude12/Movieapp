import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import movieService from "../services/movieService";
import { addFavorite } from "../services/favoriteService";
import { addWantToWatch } from "../services/WantToWatchService";
import ratingService from "../services/ratingService";
import type { MovieDetails } from "../interfaces/MovieDetailInterface";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [message, setMessage] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | "">("");

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const data = await movieService.getMovieById(Number(id));
        setMovie(data);
      } catch (error) {
        console.error(error);
        setMessage("Could not fetch movie details");
      }
    };

    fetchMovie();
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!movie) return;

    try {
      await addFavorite(movie.id);
      setMessage("Added to favorites");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;

      if (errorMessage === "Movie already in favorites") {
        setMessage("Movie is already in favorites");
        return;
      }
      setMessage("Could not add to favorites");
    }
  };

  const handleAddToWatchlist = async () => {
    if (!movie) return;

    try {
      await addWantToWatch(movie.id);
      setMessage("Added to watchlist");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;

      if (errorMessage === "Movie already in watchlist") {
        setMessage("Movie is already in watchlist");
        return;
      }

      console.error(error);
      setMessage("Could not add to watchlist");
    }
  };

  const handleRateMovie = async () => {
    if (!movie) return;

    if (!selectedRating || selectedRating < 1 || selectedRating > 10) {
      setMessage("Choose a score between 1 and 10");
      return;
    }

    try {
      await ratingService.addRating(movie.id, selectedRating);
      setMessage("Rating added");
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data || "Could not add rating");
    }
  };

  if (!movie) {
    return <p className="container mt-4 text-white">Loading...</p>;
  }

  return (
    <div className="container mt-4 text-white">
      <button
        className="btn btn-outline-light mb-4"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {message && (
        <div className="alert alert-info mt-3 text-center">
          {message}
        </div>
      )}

      <div className="row">
        <div className="col-md-4">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="img-fluid rounded"
            />
          ) : (
            <div className="border rounded p-4 text-center text-white">
              No image
            </div>
          )}
        </div>

        <div className="col-md-8">
          <h2 className="text-white">{movie.title}</h2>

          <p className="text-light">
            <strong>Release date:</strong>{" "}
            {movie.release_date || "No release date"}
          </p>

          <p className="text-light">
            <strong>TMDB rating:</strong>{" "}
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </p>

          <p className="text-light">
            <strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : "N/A"}
          </p>

          <p className="text-light">
            <strong>Genres:</strong>{" "}
            {movie.genres.length > 0
              ? movie.genres.map((genre) => genre.name).join(", ")
              : "No genres"}
          </p>

          <p className="text-light">
            <strong>Overview:</strong>
          </p>
          <p className="text-light">{movie.overview || "No description available"}</p>

          {isLoggedIn ? (
            <div className="d-flex flex-column gap-2 mt-4">
              <button
                className="btn btn-outline-light"
                onClick={handleAddToFavorites}
              >
                Add to Favorites
              </button>

              <button
                className="btn btn-outline-light"
                onClick={handleAddToWatchlist}
              >
                Add to Watchlist
              </button>

              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={selectedRating}
                  onChange={(e) =>
                    setSelectedRating(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                >
                  <option value="">Rate this movie</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <option key={score} value={score}>
                      {score}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-outline-light"
                  onClick={handleRateMovie}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-light mt-4">Log in to save or rate movies</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
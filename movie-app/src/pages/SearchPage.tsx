import { useState } from "react";
import { Link } from "react-router-dom";
import movieService from "../services/movieService";
import type { Movie } from "../interfaces/MovieInterface";

function SearchPage() {
  const [searchTitle, setSearchTitle] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTitle.trim()) {
      setMessage("Please enter a movie title");
      setMovies([]);
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const data = await movieService.searchMovies(searchTitle);
      setMovies(data.results || []);

      if (!data.results || data.results.length === 0) {
        setMessage("No movies found");
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not fetch movies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mt-4">
      <div className="mx-auto text-center" style={{ maxWidth: "600px" }}>
        <h2 className="text-white mb-3">Search Movies</h2>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search for a movie..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>  
      )}

      {message && <p className="mt-3 text-center">{message}</p>}

      <div className="row mt-4">
        {movies.map((movie) => (
          <div className="col-md-4 col-lg-3 mb-4" key={movie.id}>
            <div className="card h-100">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  className="card-img-top"
                  alt={movie.title}
                />
              ) : (
                <div className="p-4 text-center border-bottom">
                  No image available
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{movie.title}</h5>

                <p className="card-text">
                  {movie.release_date || "No release date"}
                </p>

                <Link
                  to={`/movies/${movie.id}`}
                  className="btn btn-outline-primary mt-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
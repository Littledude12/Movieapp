import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import movieService from "../services/movieService";
import type { Movie } from "../interfaces/MovieInterface";

function HomePage() {
  const { isLoggedIn, username } = useAuth();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const data = await movieService.getPopularMovies();
        setPopularMovies(data.results || []);
      } catch (error) {
        console.error("Could not fetch popular movies", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div>
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "80px 20px",
        }}
      >
        <div className="container">
          <h1 className="mb-3">
            {isLoggedIn ? `Welcome back, ${username}` : "Welcome to MovieApp"}
          </h1>

          <p className="lead mb-4">
            Search for movies, save your favorites, build your watchlist, and
            rate the films you have seen.
          </p>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/search" className="btn btn-light">
              Search Movies
            </Link>

            {isLoggedIn && (
              <>
                <Link to="/favorites" className="btn btn-outline-light">
                  My Favorites
                </Link>
                <Link to="/wanttowatch" className="btn btn-outline-light">
                  My Watchlist
                </Link>
                <Link to="/ratings" className="btn btn-outline-light">
                  My Ratings
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="p-4 bg-white rounded shadow-sm">
          <h3 className="mb-4">Popular Movies</h3>

          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {popularMovies.slice(0, 8).map((movie) => (
                <div className="col-md-3 mb-4" key={movie.id}>
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

                      <p className="card-text text-muted">
                        {movie.release_date || "No release date"}
                      </p>

                      <Link
                        to={`/movies/${movie.id}`}
                        className="btn btn-outline-dark mt-auto"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
import { useEffect, useState } from "react";
import {
  getWantToWatch,
  removeWantToWatch,
} from "../services/WantToWatchService";
import movieService from "../services/movieService";

function WantToWatchPage() {
  const [list, setList] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadWatchlist = async () => {
    try {
      setIsLoading(true);

      const data = await getWantToWatch();

      const movies = await Promise.all(
        data.map(async (item: any) => {
          const movie = await movieService.getMovieById(item.externalMovieId);
          return {
            ...movie,
            externalMovieId: item.externalMovieId,
          };
        })
      );


      setList(movies);
    } catch (error) {
      console.error(error);
      setMessage("Error loading watchlist.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);


  const handleRemove = async (externalMovieId: number) => {
    try {
      await removeWantToWatch(externalMovieId);
      setMessage("Movie removed.");
      await loadWatchlist();
    } catch (error) {
      console.error(error);
      setMessage("Error removing movie.");
    }
  };
  

  return (
    <div className="container mt-4">
      <h1 className="text-white mb-4">Watchlist</h1>

      {message && <div className="alert alert-info">{message}</div>}


      {isLoading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>No movies yet.</p>
      ) : (
        <div className="row">
          {list.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-4">
              <div className="card h-100">
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    className="card-img-top"
                    alt={movie.title}
                  />
                )}

                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{movie.title}</h6>

                  <button
                    className="btn btn-danger btn-sm mt-auto"
                    onClick={() => handleRemove(movie.externalMovieId)}
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

export default WantToWatchPage;
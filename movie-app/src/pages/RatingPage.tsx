import { useEffect, useState } from "react";
import ratingService from "../services/ratingService";
import movieService from "../services/movieService";
import type { Rating } from "../interfaces/RatingInterface";

function RatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [editedRatings, setEditedRatings] = useState<Record<number, number>>({});


  useEffect(() => {
    const fetchRatingsAndMovies = async () => {
      try {
        const ratingsData = await ratingService.getRatings();
        setRatings(ratingsData);

        const moviesData = await Promise.all(
          ratingsData.map((rating) =>
            movieService.getMovieById(rating.externalMovieId)
          )
        );

        setMovies(moviesData);
      } catch (error) {
        console.error(error);
        setMessage("Could not fetch ratings");
      }
    };

    fetchRatingsAndMovies();
  }, []);


  const removeRatingBtn = async (externalMovieId: number) => {
    try {
      await ratingService.removeRating(externalMovieId);

      setRatings((prev) =>
        prev.filter((r) => r.externalMovieId !== externalMovieId)
      );

      setMovies((prev) =>
        prev.filter((movie) => movie.id !== externalMovieId)
      );

      setMessage("Rating removed");
    } catch (error) {
      console.error(error);
      setMessage("Could not remove rating");
    }
  };

  const handleRatingChange = (externalMovieId: number, score: number) => {
  setEditedRatings((prev) => ({
    ...prev,
    [externalMovieId]: score,
  }));
  
  };


  const updateRatingBtn = async (externalMovieId: number) => {
    const score = editedRatings[externalMovieId];

    if (score < 1 || score > 10) {
      setMessage("Rating must be between 1 and 10");
      return;
    }

    try {
      await ratingService.updateRating(externalMovieId, score);
      setRatings((prev) =>
        prev.map((rating) =>
          rating.externalMovieId === externalMovieId 
       ? {...rating, score }
        : rating
        )
      );

      setMessage("Rating updated");

    } catch (error) {
      console.error(error);
      setMessage("Could not update rating");
    }
  };


  return (
  <div className="container mt-4">
    <h2 className="text-white mb-4">My Ratings</h2>

    {message && <p>{message}</p>}

    {ratings.length === 0 ? (
      <p>No ratings yet.</p>
    ) : (
      <div className="row">
        {ratings.map((rating) => {
          const movie = movies.find(
            (movie) => movie.id === rating.externalMovieId
          );

          return (
            <div key={rating.id} className="col-md-3 mb-4">
              <div className="card h-100">
                {movie?.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    className="card-img-top"
                    alt={movie.title}
                    style={{
                      height: "350px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    {movie ? movie.title : "Loading..."}
                  </h5>

                  <span className="badge bg-primary mb-3 align-self-start">
                    Current: {rating.score}/10
                  </span>

                  <select
                    className="form-select form-select-sm mb-2"
                    value={editedRatings[rating.externalMovieId] || rating.score}
                    onChange={(e) =>
                      handleRatingChange(
                        rating.externalMovieId,
                        Number(e.target.value)
                      )
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <option key={score} value={score}>
                        {score}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-outline-success btn-sm mb-2"
                    onClick={() => updateRatingBtn(rating.externalMovieId)}
                  >
                    Update Rating
                  </button>

                  <button
                    className="btn btn-danger btn-sm mt-auto"
                    onClick={() => removeRatingBtn(rating.externalMovieId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
  );

}

export default RatingsPage;
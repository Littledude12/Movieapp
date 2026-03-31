import { useState } from "react";
import ratingService from "../services/ratingService";

type MovieRatingProps = {
  userId: number;
  externalMovieId: number; 
  };

function MovieRating({ userId, externalMovieId }: MovieRatingProps) {

  const [score, setScore] = useState<number>(1);
  const [message, setMessage] = useState("");

  const handleSaveRating = async () => {
    try {

      await ratingService.addRating({
        userId,
        externalMovieId,
        score,

      });

      setMessage("Rating saved");
    } catch (error: any) {

      const errorMessage = error.response?.data;

      if (errorMessage === "You have already rated this movie.") {

        try {
          await ratingService.updateRating({
            userId,
            externalMovieId,
            score,

          });

          setMessage("Rating updated");
        } catch (updateError: any) {
          setMessage(updateError.response?.data || "Could not update rating");
          console.error(updateError);
        }

      } else {
        setMessage(errorMessage || "Could not save rating");
        console.error(error);
      }
    }
  };


  return (
    <div className="mt-3">
      <label className="form-label">Your rating</label>
      <input
        type="number"
        min="1"
        max="10"
        className="form-control mb-2"
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
      />

      <button className="btn btn-primary" onClick={handleSaveRating}>
        Save rating
      </button>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

export default MovieRating;
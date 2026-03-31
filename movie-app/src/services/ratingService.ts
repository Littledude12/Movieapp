import api from "./api";
import type { Rating } from "../interfaces/RatingInterface";

const ratingService = {
  addRating: async (externalMovieId: number, score: number) => {
    const response = await api.post("/Rating", {
      externalMovieId,
      score,
    });
    return response.data;
  },

  getRatings: async () => {
    const response = await api.get<Rating[]>("/Rating");
    return response.data;
  },

  updateRating: async (externalMovieId: number, score: number) => {
    const response = await api.put("/Rating", {
      externalMovieId,
      score,
    });
    return response.data;
  },

  removeRating: async (externalMovieId: number) => {
    const response = await api.delete(`/Rating/${externalMovieId}`);
    return response.data;
  },
};

export default ratingService;
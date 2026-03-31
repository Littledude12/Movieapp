import api from "./api";

export const getFavorites = async () => {
  const response = await api.get("/FavoriteMovie");
  return response.data;
};

export const addFavorite = async (externalMovieId: number) => {
  const response = await api.post("/FavoriteMovie", {
    externalMovieId : externalMovieId,
  });
  return response.data;
};

export const removeFavorite = async (externalMovieId: number) => {
  const response = await api.delete(`/FavoriteMovie/${externalMovieId}`);
  return response.data;
};
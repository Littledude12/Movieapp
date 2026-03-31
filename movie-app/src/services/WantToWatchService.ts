import api from "./api";
import type { WantToWatch } from "../interfaces/WantToWatchInterface";

export const addWantToWatch = async (externalMovieId: number) => {
  const response = await api.post("/WantToWatch", {
    externalMovieId,
  });
  return response.data;
};

export const getWantToWatch = async () => {
  const response = await api.get<WantToWatch[]>("/WantToWatch");
  return response.data;
};

export const removeWantToWatch = async (externalMovieId: number) => {
  const response = await api.delete(`/WantToWatch/${externalMovieId}`);
  return response.data;
};
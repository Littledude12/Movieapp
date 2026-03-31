import api from "./api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/Auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (username: string, email: string, password: string) => {
  const response = await api.post("/Auth/register", {
    username,
    email,
    password,
  });

  return response.data;
};
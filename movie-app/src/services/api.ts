import axios from "axios";

// Oppretter en Axios-instans med baseURL satt til API-endepunktet
const api = axios.create({
  baseURL: "http://localhost:5154/api",
});

// Request interceptor som legger token i Authorization-headeren på alle forespørsler
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//Kjøres når vi får response (eller error) fra backend.
// Hvis status er 401, fjernes tokenet og brukerinfo fra localStorage og sender brukeren til login-siden.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
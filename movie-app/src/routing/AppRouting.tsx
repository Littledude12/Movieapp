import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import FavoritesPage from "../pages/FavoritesPage";
import WantToWatchPage from "../pages/WantToWatchPage";
import RatingPage from "../pages/RatingPage";
import SearchPage from "../pages/SearchPage";
import ProtectedRoute from "../components/ProctedRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MovieDetailsPage from "../pages/MovieDetailsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/movies/:id" element={<MovieDetailsPage />} />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wanttowatch"
        element={
          <ProtectedRoute>
            <WantToWatchPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ratings"
        element={
          <ProtectedRoute>
            <RatingPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
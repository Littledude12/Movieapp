import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { isLoggedIn, username, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3" style={{ backgroundColor: "#111827" }}>
      
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          MovieApp
        </Link>

        <div className="d-flex gap-3 align-items-center">
          <Link to="/" className="text-white text-decoration-none">
            Home
          </Link>

          <Link to="/search" className="text-white text-decoration-none">
            Search
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/favorites"
                className="text-white text-decoration-none"
              >
                Favorites
              </Link>

              <Link
                to="/wanttowatch"
                className="text-white text-decoration-none"
              >
                Want To Watch
              </Link>

              <Link
                to="/ratings"
                className="text-white text-decoration-none"
              >
                Ratings
              </Link>

              <div style={{width: "1px", height: "24px", backgroundColor: "rgba(255,255,255,0.2)",}}>

              </div>
            </>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn btn-outline-light btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-light btn-sm">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-white">{username}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
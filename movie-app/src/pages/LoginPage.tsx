import { useState, useEffect } from "react";
import { login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { loginUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      loginUser(data.token, data.userId, data.username);

      navigate("/"); 
    } catch (error: any) {
      setMessage(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-white mb-4">Login</h2>

      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>

      {message && <p className="text-white mt-2">{message}</p>}
    </div>
  );
}

export default LoginPage;
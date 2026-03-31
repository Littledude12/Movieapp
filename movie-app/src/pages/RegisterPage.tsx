import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
    
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");


  const handleRegister = async () => {
    try {
      await registerUser( username, email, password );
      alert("User created!");
      navigate("/login");
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };


  return (
    <div className="container mt-5">
      <h2>Register</h2>

      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
};

export default RegisterPage;
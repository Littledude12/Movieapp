import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  userId: number | null;
  username: string | null;
  isLoggedIn: boolean;
  loginUser: (token: string, userId: number, username: string) => void;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {

  // Henter lagret data fra localStorage så brukern ikke logges ut ved refresh
  const storedToken = localStorage.getItem("token");
  const storedUserId = localStorage.getItem("userId");
  const storedUsername = localStorage.getItem("username");

  // Sjekker om gyldig auth-data er lagret i localStorage
  const hasValidAuth = !!(storedToken && storedUserId && storedUsername);

  // State for token
  const [token, setToken] = useState<string | null>(
    hasValidAuth ? storedToken : null
  );

  const [userId, setUserId] = useState<number | null>(
    hasValidAuth ? Number(storedUserId) : null
  );

  const [username, setUsername] = useState<string | null>(
    hasValidAuth ? storedUsername : null
  );

  // Funksjon som kjøres når bruker logger inn
  const loginUser = (token: string, userId: number, username: string) => {

    // Lagrer auth-data i localStorage for å holde brukeren innlogget ved refresh
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("username", username);

    setToken(token);
    setUserId(userId);
    setUsername(username);
  };

  const logoutUser = () => {

    // Fjerner auth-data fra localStorage når bruker logger ut
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    setToken(null);
    setUserId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        username,
        isLoggedIn: !!token,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for å bruke auth-konteksten i komponenter
export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
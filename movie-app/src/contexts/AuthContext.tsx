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
  const [token, setToken] = useState<string | null>(
  localStorage.getItem("token")

  );

  const [userId, setUserId] = useState<number | null>(
  localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : null
  );

  const [username, setUsername] = useState<string | null>(
  localStorage.getItem("username")
  );


  const loginUser = (token: string, userId: number, username: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("username", username);

    setToken(token);
    setUserId(userId);
    setUsername(username);
  };

  const logoutUser = () => {
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

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
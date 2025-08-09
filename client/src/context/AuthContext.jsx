import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    await fetchUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const fetchUser = async (currentToken = token) => {
    try {
      const res = await fetch("http://localhost:3000/api/users/me", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        logout(); 
      }
    } catch (err) {
      console.error("Auth fetch failed", err);
      logout();
    }
  };

  useEffect(() => {
    if (token) fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext, useState, useEffect, useSyncExternalStore } from "react";

const AuthContext = createContext();

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("focus", callback); // tab switch or back
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", callback);
  };
}
function getSnapshot() {
  return !!localStorage.getItem("token");
}

export const AuthProvider = ({ children }) => {
  const isLoggedIn = useSyncExternalStore(subscribe, getSnapshot);

  const login = (token) => {
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("storage")); // trigger re-check
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

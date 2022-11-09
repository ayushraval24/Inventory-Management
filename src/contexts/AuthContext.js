import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("userAccessToken") ? true : false
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {props.children}
    </AuthContext.Provider>
  );
}

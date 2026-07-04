import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/subscriptionApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const response = await API.get("/accounts/me/");
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (username, password) => {
    const tokenResponse = await API.post("/token/", {
      username,
      password,
    });

    localStorage.setItem("accessToken", tokenResponse.data.access);
    localStorage.setItem("refreshToken", tokenResponse.data.refresh);

    const userResponse = await API.get("/accounts/me/");
    setUser(userResponse.data);
  };

  const register = async (formData) => {
    const response = await API.post("/accounts/register/", formData);
    return response.data;
  };
  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await API.post("/accounts/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  const updateProfile = async (formData) => {
    const response = await API.patch("/accounts/me/", formData);
    setUser(response.data);
    return response.data;
  };
  
  const changePassword = async (formData) => {
    const response = await API.post("/accounts/change-password/", formData);
    return response.data;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
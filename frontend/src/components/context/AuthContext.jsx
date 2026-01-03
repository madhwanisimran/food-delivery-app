import React, { useEffect, useState, useCallback } from "react";
import authService from "../../services/authService";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = React.createContext(null);

const isAdmin = (user) => user && user.role === "admin";
const isUser = (user) => user && user.role === "user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const token = authService.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const res = await authService.fetchCurrentUser();
    if (res.success && res.user) {
      setUser(res.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.user) {
      // Prevent admin accounts from being used to log into the customer frontend
      if (res.user.role === "admin") {
        authService.logout();
        toast.error("Admin accounts must use the admin panel to login");
        return {
          success: false,
          message: "Please use the admin panel to login",
        };
      }
      setUser(res.user);
      toast.success("Logged in");
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    if (res.success && res.user) {
      if (res.user.role === "admin") {
        authService.logout();
        toast.error("Admin accounts must use the admin panel");
        return {
          success: false,
          message: "Admin accounts are not allowed here",
        };
      }
      setUser(res.user);
      toast.success("Account created");
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info("Logged out");
  };

  const forceLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAdmin,
        isUser,
        forceLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

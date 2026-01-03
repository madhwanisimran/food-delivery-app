import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RequireAdmin = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);
  const loc = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" state={{ from: loc }} replace />;
  if (!isAdmin(user)) return <Navigate to="/" replace />;
  return children;
};

export default RequireAdmin;

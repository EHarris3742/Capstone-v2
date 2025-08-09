import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Account() {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Admin: {user.is_admin ? "Yes" : "No"}</p>
    </div>
  );
}

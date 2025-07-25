// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router";
import { ErrorAlert } from "../helpers/alert";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role"); // pastikan disimpan saat login

  if (!token) {
    ErrorAlert("You must be logged in to access this page", "Unauthorized");
    return <Navigate to="/auth/login" replace />;
  }
  if (!allowedRoles.includes(role)) {
    ErrorAlert("You do not have permission to access this page", "Forbidden");
    return <Navigate to="/public/courts" replace />;
  }

  return <Outlet />;
}

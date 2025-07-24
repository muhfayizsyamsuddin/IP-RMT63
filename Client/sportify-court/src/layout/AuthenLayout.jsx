import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function AuthenticatedLayout() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to={"/auth/login"} />;
  }
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

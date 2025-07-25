// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role"); // pastikan role disimpan di localStorage saat login
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/auth/login");
  };

  const navItem = (label, path) => (
    <span
      onClick={() => navigate(path)}
      className="cursor-pointer text-gray-700 hover:text-blue-600"
    >
      {label}
    </span>
  );

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 text-blue-600 font-bold text-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/Sportify-Courts.png" alt="Logo" className="h-11 w-16" />
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItem("Courts", "/")}
          {/* {navItem("Courts", "/courts")} */}
          {isLoggedIn && navItem("Booking History", "/bookings/mine")}
          {isLoggedIn && role === "admin" && navItem("Admin Panel", "/admin")}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <span
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </span>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4">
          {navItem("Home", "/")}
          {navItem("Courts", "/courts")}
          {isLoggedIn && navItem("Booking History", "/booking-history")}
          {isLoggedIn && role === "admin" && navItem("Admin Panel", "/admin")}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <span
              onClick={() => navigate("/auth/login")}
              className="block mt-2 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </span>
          )}
        </div>
      )}
    </nav>
  );
}

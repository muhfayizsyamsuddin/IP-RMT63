// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-blue-600">Sportify</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="/courts" className="text-gray-700 hover:text-blue-600">
            Courts
          </a>
          {isLoggedIn && (
            <a
              href="/booking-history"
              className="text-gray-700 hover:text-blue-600"
            >
              Booking History
            </a>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </a>
          )}
        </div>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4">
          <a href="/" className="block py-2 text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a
            href="/courts"
            className="block py-2 text-gray-700 hover:text-blue-600"
          >
            Courts
          </a>
          {isLoggedIn && (
            <a
              href="/booking-history"
              className="block py-2 text-gray-700 hover:text-blue-600"
            >
              Booking History
            </a>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="block mt-2 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { api } from "../helpers/http-client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role"); // pastikan role disimpan di localStorage saat login
    const name = localStorage.getItem("name"); // ambil nama user dari localStorage
    setIsLoggedIn(!!token);
    setRole(userRole);
    setName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setRole(null);
    setName("");
    navigate("/auth/login");
  };

  const handleUpgrade = async () => {
    // Trigger snap popup. @TODO: Replace TRANSACTION_TOKEN_HERE with your transaction token
    const { data } = await api.post("/payments/midtrans/initiate");
    window.snap.pay(data.transactionToken, {
      onSuccess: async function (result) {
        /* You may add your own implementation here */
        console.log(result);
        await api.patch("/payments/me/upgrade", {
          orderId: data.orderId,
        });
      },
    });
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
          <img
            src="/Sportify-Courts.png"
            alt="Logo"
            className="h-11 w-16 object-contain"
          />
          <span className="hidden sm:block text-blue-700 font-extrabold">
            Sportify
          </span>
        </div>
        <div>
          <span className="text-gray-700 font-medium">
            {isLoggedIn ? `Welcome, ${name || "User"}` : "Welcome, Guest"}
          </span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center font-medium text-gray-700">
          {navItem("Home", "/")}
          {navItem("Courts", "/")}
          {isLoggedIn && navItem("Booking History", "/bookings/mine")}
          {isLoggedIn && role === "admin" && navItem("Admin Panel", "/admin")}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Upgrade
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2 text-gray-700 font-medium">
          {navItem("Home", "/")}
          {navItem("Courts", "/courts")}
          {isLoggedIn && navItem("Booking History", "/booking-history")}
          {isLoggedIn && role === "admin" && navItem("Admin Panel", "/admin")}
          {isLoggedIn ? (
            (
              <button
                onClick={handleUpgrade}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Upgrade
              </button>
            ) && (
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            )
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

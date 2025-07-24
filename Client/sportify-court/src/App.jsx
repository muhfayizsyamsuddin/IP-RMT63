import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import "./App.css";
// import Register from "./pages/Register";
import Login from "./pages/Login";
import PublicCourts from "./pages/PublicCourts";
import AuthenticatedLayout from "./layout/AuthenLayout";
import MyBookings from "./pages/MyBooking";
import PublicCourtDetail from "./pages/CourtDetail";
import BookingForm from "./pages/CreateBooking";
import AllBookings from "./pages/AllBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/public/courts" replace />} />
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/public/courts" element={<PublicCourts />} />
        <Route path="/public/courts/:id" element={<PublicCourtDetail />} />
        {/* <Route path="/auth/register" element={<Register />} /> */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/" element={<AuthenticatedLayout />}>
          <Route path="/bookings/:id" element={<BookingForm />} />
          <Route path="/bookings/mine" element={<MyBookings />} />
          {/* Ini admin */}
          <Route path="/admin/bookings" element={<AllBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

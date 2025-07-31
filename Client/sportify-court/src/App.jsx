import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PublicCourts from "./pages/PublicCourts";
import AuthenticatedLayout from "./layout/AuthenLayout";
import MyBookings from "./pages/MyBooking";
import PublicCourtDetail from "./pages/CourtDetail";
import BookingForm from "./pages/CreateBooking";
import AllBookings from "./pages/AllBookings";
import ProtectedRoute from "./components/ProtectedRoutes";
import { store } from "./app/store";
// import { Provider, useDispatch, useSelector } from "react-redux";

function App() {
  // const count = useSelector((state) => state.counter.value);
  // const dispatch = useDispatch();
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/public/courts" replace />} />
          {/* Public */}
          <Route path="/public/courts" element={<PublicCourts />} />
          <Route path="/public/courts/:id" element={<PublicCourtDetail />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/" element={<AuthenticatedLayout />}>
            {/* Protected Layout */}
            {/* Hanya untuk user & admin */}
            <Route
              element={<ProtectedRoute allowedRoles={["user", "admin"]} />}
            >
              <Route path="/bookings/:id" element={<BookingForm />} />
              <Route path="/bookings/mine" element={<MyBookings />} />
            </Route>
            {/* Hanya untuk admin */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/bookings" element={<AllBookings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

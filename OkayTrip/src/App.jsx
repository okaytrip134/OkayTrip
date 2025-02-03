import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ChangePhone from "./components/changePhone";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ExplorePage from "./pages/ExplorePage";
import CategoryPage from "./pages/CategoryPage";
import PackageDetailsPage from "./pages/PackageDetails";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import ProfileBookings from "./pages/ProfileBooking";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="App">
      <NavWithConditionalNavbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/package/:packageId" element={<PackageDetailsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/change-phone" element={<ChangePhone />} />
          <Route path="/booking/:packageId" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile-bookings" element={<ProfileBookings />} />
        </Routes>
      </div>
      {/* Conditionally render Footer */}
      {location.pathname !== "/profile" && <Footer />}
    </div>
  );
};

const NavWithConditionalNavbar = () => {
  const location = useLocation();

  // Hiding the Navbar on the Forgot Password or Reset Password page
  if (location.pathname === "/forgot-password" || location.pathname.startsWith("/reset-password")) {
    return null;
  }

  return <Navbar />;
};

export default App;

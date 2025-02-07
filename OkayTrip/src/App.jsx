import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ChangePhone from "./components/ChangePhone";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ExplorePage from "./pages/ExplorePage";
import CategoryPage from "./pages/CategoryPage";
import PackageDetailsPage from "./pages/PackageDetails";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import ProfileBookings from "./pages/ProfileBooking";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/Term&conditions";
import CopyrightPolicy from "./pages/CopyRightPolicy";

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
      <ScrollToTop/>
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
          <Route path="/refund-policy" element={<RefundPolicy/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/term-and-conditions" element={<TermsConditions/>}/>
          <Route path="/copyright-policy" element= {<CopyrightPolicy/>}/>
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

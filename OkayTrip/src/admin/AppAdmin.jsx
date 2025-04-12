import {  Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TopSaleBarAdmin from "./pages/TopSaleBarAdmin";
import DashboardStats from "../admin/components/DashboardStats";
import AdminUserList from "./pages/AdminUserList";
import CategoryManager from "./pages/CategoryManager";
import PackageManager from "./pages/PackageManager";
import BookingReport from "./pages/BookingReport";
import AdminBookings from "./pages/AdminBookings";
import AdminBannerManager from "./pages/AdminBannerManager";
import AdminReviews from "./pages/AdminReview";
import LeadsPage from "./pages/AdminLeads";
import CreateOffer from "./components/CreateOffer";
import ViewOffers from "./components/ViewOffer";
import ViewCoupons from "./pages/ViewCoupons";
import AdminSelectWinners from "./pages/AdminSelectWinners";
import ProtectedRoute from "./components/ProtectedRoutes"; // Add this import

const AppAdmin = () => {
  return (
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        
        {/* Wrap all protected routes with ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />}>
            <Route index element={<DashboardStats />} />
            <Route path="top-sale-bar" element={<TopSaleBarAdmin />} />
            <Route path="Users" element={<AdminUserList/>} />
            <Route path="Categories" element= {<CategoryManager/>}/>
            <Route path="Packages" element={<PackageManager/>} />
            <Route path="booking-report" element= {<AdminBookings/>}/>
            <Route path="banner" element= {<AdminBannerManager/>}/>
            <Route path="Admin-reviews" element= {<AdminReviews/>}/>
            <Route path="Leads" element={<LeadsPage/>} />
            <Route path="create-offer" element={<CreateOffer/>}/>
            <Route path="view-offer" element={<ViewOffers/>}/>
            <Route path="view-coupon" element= {<ViewCoupons/>}/>
            <Route path="announce-winner" element={<AdminSelectWinners />} />
          </Route>
        </Route>
        
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
  );
};

export default AppAdmin;
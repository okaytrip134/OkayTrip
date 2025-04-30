import {  Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TopSaleBarAdmin from "./pages/TopSaleBarAdmin";
import DashboardStats from "../admin/components/DashboardStats";
import AdminUserList from "./pages/AdminUserList";
import CategoryManager from "./pages/CategoryManager";
import PackageManager from "./pages/PackageManager";
import AdminBookings from "./pages/AdminBookings";
import AdminBannerManager from "./pages/AdminBannerManager";
import AdminReviews from "./pages/AdminReview";
import LeadsPage from "./pages/AdminLeads";
import ProtectedRoute from "./components/ProtectedRoutes"; // Add this import
import OffersManagement from "./pages/OfferManager";
import CouponsManagement from "./pages/CouponManager";
import AdminBlogs from "./pages/AdminBlogs";

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
            <Route path="Offer-Manager" element={<OffersManagement />} />
            <Route path="Coupon-Manager" element={<CouponsManagement/>} />
            <Route path="blogs" element={<AdminBlogs/>} />
          </Route>
        </Route>
        
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
  );
};

export default AppAdmin;
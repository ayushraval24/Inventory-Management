import React, { Component } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Redirec,
} from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import Dashboard from "./pages/Dashboard";
import EditProduct from "./pages/EditProduct";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Sidebar from "./components/Sidebar";
import VerifyUser from "./pages/auth/VerifyUser";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/auth/Profile";
import EditProfile from "./pages/auth/EditProfile";
import ReportBug from "./pages/ReportBug";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ImageDialog from "./components/imageCrop/ImageDialog";

const PrivateRoutes = ({ children }) => {
  const hasAccessToken = localStorage.getItem("userAccessToken");

  if (!hasAccessToken) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <div className="col-12 col-md-2 px-0 bg-dark">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10  main_container">{children}</div>
    </>
  );
};

const PublicRoutes = ({ children }) => {};

export default function routes() {
  return (
    <BrowserRouter>
      <div className="dashboard row m-0">
        <Routes>
          {/* public routes */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password/:token" element={<ResetPassword />} />

          <Route path="/verify-user/:token" element={<VerifyUser />} />

          <Route
            path="/"
            element={
              <PrivateRoutes>
                <Dashboard />
              </PrivateRoutes>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoutes>
                <Dashboard />
              </PrivateRoutes>
            }
          />

          <Route
            path="/add-product"
            element={
              <PrivateRoutes>
                <AddProduct />
              </PrivateRoutes>
            }
          />

          <Route
            path="/product-details/:productId"
            element={
              <PrivateRoutes>
                <ProductDetails />
              </PrivateRoutes>
            }
          />

          <Route
            path="/edit-product/:productId"
            element={
              <PrivateRoutes>
                <EditProduct />
              </PrivateRoutes>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoutes>
                <Profile />
              </PrivateRoutes>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <PrivateRoutes>
                <EditProfile />
              </PrivateRoutes>
            }
          />

          <Route
            path="/report"
            element={
              <PrivateRoutes>
                <ReportBug />
              </PrivateRoutes>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

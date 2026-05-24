import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import DashboardLayout from "../components/layout/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

import ProtectedRoute from "./Protected.route";
import PublicRoute from "./Public.routes";
import SalesListPage from "../pages/sales/Saleslistpage ";
import POSBillingPage from "../pages/sales/POSBillingPage";
import SaleDetailPage from "../pages/sales/Saledetailpage ";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 🔥 Protected Dashboard Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          
          {/* Sales Routes */}
          <Route path="sales" element={<SalesListPage />} />
          <Route path="sales/pos" element={<POSBillingPage />} />
          <Route path="sales/:id" element={<SaleDetailPage />} />

          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
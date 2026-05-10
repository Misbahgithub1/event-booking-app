import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import AdminRoute from "../routes/AdminRoute";
import PageLoader from "../components/ui/PageLoader";

// Lazy Pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const VerifyOtp = lazy(() => import("../pages/VerifyOtp"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/verify"
          element={
            <Layout>
              <VerifyOtp />
            </Layout>
          }
        />

        {/*  PROTECTED ADMIN ROUTE */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </AdminRoute>
          }
        />

        {/*  404 */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
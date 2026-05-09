import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";
import Dashboard from "../pages/admin/Dashboard";
import AdminRoute from "../routes/AdminRoute";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
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

       <Route
        path="*"
        element={
          <Layout>
            <NotFound />
          </Layout>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";

/**
 * ✅ Centralized App Routing
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Layout Wrapper */}
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
    </Routes>
  );
};

export default AppRoutes;
"use client";

import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useCallback } from "react";
import { useAuth } from "./Context/AuthContext";
import axios from "axios";
import { setupAxiosInterceptors } from "./utils/axiosConfig";

const Login = lazy(() => import("./pages/Login"));
const Layout = lazy(() => import("./Components/Layout"));
const PageLayout = lazy(() => import("./Components/PageLayout"));
const Top = lazy(() => import("./pages/Top"));
const ApplicationManagement = lazy(() =>
  import("./pages/ApplicationManagement")
);
const FacilityAllow = lazy(() => import("./pages/FacilityAllow"));
const FacilitiesManagement = lazy(() => import("./pages/FacilitiesManagement"));
const JobPostAllow = lazy(() => import("./pages/JobPostAllow"));
const JobPostManagement = lazy(() => import("./pages/JobPostManagement"));
const CustomerManagement = lazy(() => import("./pages/CustomerManagement"));
const MembersManagement = lazy(() => import("./pages/MembersManagement"));
const Setting = lazy(() => import("./pages/Setting"));
const LoginIDChange = lazy(() => import("./pages/Setting/LoginIDChange"));
const PasswordChange = lazy(() => import("./pages/Setting/PasswordChange"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Loading = lazy(() => import("./Components/Loading"));

function App() {
  const { setIsAuthenticated, setAdmin, admin, isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Set up axios interceptors once when the component mounts
  useEffect(() => {
    setupAxiosInterceptors(navigate, setIsAuthenticated);
  }, [navigate, setIsAuthenticated]);

  // Use useCallback to memoize the getUserData function
  const getUserData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/adminuser/tokenlogin`
      );
      // If successful, set admin and authentication state
      setAdmin(res.data.user.data);
      setIsAuthenticated(true);
    } catch (error) {
      // Error handling is now managed by the axios interceptor
      console.error("Error fetching user data:", error);
    }
  }, [setIsAuthenticated, setAdmin]);

  useEffect(() => {
    // Only call getUserData if token exists
    if (token) {
      getUserData(); // Call the memoized getUserData
    } else {
      // If no token, ensure user is not authenticated
      setIsAuthenticated(false);
    }
  }, [token, getUserData, setIsAuthenticated]);

  // Add a route guard for protected routes
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated && !token) {
      // Redirect to login if not authenticated and no token
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route element={<PageLayout />}>
            <Route
              path="/admin/top"
              element={
                <ProtectedRoute>
                  <Top />
                </ProtectedRoute>
              }
            />
            {/* Apply ProtectedRoute to all admin routes */}
            <Route
              path="/admin/corporation"
              element={
                <ProtectedRoute>
                  <CustomerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/apply"
              element={
                <ProtectedRoute>
                  <ApplicationManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/facility"
              element={
                <ProtectedRoute>
                  <FacilitiesManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recruit"
              element={
                <ProtectedRoute>
                  <JobPostManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/examination_facility"
              element={
                <ProtectedRoute>
                  <FacilityAllow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/examination_recruit"
              element={
                <ProtectedRoute>
                  <JobPostAllow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/member/"
              element={
                <ProtectedRoute>
                  <MembersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings/"
              element={
                <ProtectedRoute>
                  <Setting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings/loginId"
              element={
                <ProtectedRoute>
                  <LoginIDChange />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings/pass"
              element={
                <ProtectedRoute>
                  <PasswordChange />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;

import { Route, Routes, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState, useCallback } from "react";
import { useAuth } from "./Context/AuthContext";
import axios from "axios";
import { message } from "antd";
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
  const { setIsAuthenticated, setAdmin, admin } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Use useCallback to memoize the getUserData function
  const getUserData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/adminuser/tokenlogin`
      );
      // If successful, set admin and authentication state
      setAdmin(res.data.user.data);
      setIsAuthenticated(true);
    } catch (err) {
      // Handle 401 Unauthorized Error
      if (err.response?.status === 401) {
        message.error("ログインしてください。");
        localStorage.removeItem("token"); // Remove token from localStorage
        setIsAuthenticated(false); // Set authentication state to false
        setTimeout(() => {
          navigate("/"); // Redirect to login page after a short delay
        }, 500);
      }
    }
  }, [setIsAuthenticated, setAdmin]); // Dependencies ensure getUserData is only recreated when necessary

  useEffect(() => {
    // Only call getUserData if token exists
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      getUserData(); // Call the memoized getUserData
    }
  }, [token, getUserData]); // Dependency on token ensures the effect runs only when token is available

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route element={<PageLayout />}>
            <Route path="/admin/top" element={<Top />} />
            <Route path="/admin/corporation" element={<CustomerManagement />} />
            <Route path="/admin/apply" element={<ApplicationManagement />} />
            <Route path="/admin/facility" element={<FacilitiesManagement />} />
            <Route path="/admin/recruit" element={<JobPostManagement />} />
            <Route
              path="/admin/examination_facility"
              element={<FacilityAllow />}
            />
            <Route
              path="/admin/examination_recruit"
              element={<JobPostAllow />}
            />
            <Route path="/admin/member/" element={<MembersManagement />} />
            <Route path="/admin/settings/" element={<Setting />} />
            <Route path="/admin/settings/loginId" element={<LoginIDChange />} />
            <Route path="/admin/settings/pass" element={<PasswordChange />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;

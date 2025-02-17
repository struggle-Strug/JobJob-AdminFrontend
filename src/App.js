import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import axios from "axios";
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
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const getUserData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/tokenlogin`
      );
      setAdmin(res.data.user.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false); // Ensure loading state is updated
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      getUserData();
    } else {
      setIsLoading(false); // No token, skip loading
    }
  }, [token]);

  if (isLoading) {
    return <Loading />; // Show a spinner or loading indicator
  }
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

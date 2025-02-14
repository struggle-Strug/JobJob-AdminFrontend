import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./Components/Layout";
import PageLayout from "./Components/PageLayout";
import Top from "./pages/Top";
import ApplicationManagement from "./pages/ApplicationManagement";
import FacilityAllow from "./pages/FacilityAllow";
import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import axios from "axios";
import FacilitiesManagement from "./pages/FacilitiesManagement";
import JobPostAllow from "./pages/JobPostAllow";
import JobPostManagement from "./pages/JobPostManagement";
import CustomerManagement from "./pages/CustomerManagement";
import MembersManagement from "./pages/MembersManagement";

function App() {
  const { setIsAuthenticated, setAdmin, admin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const getUserData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/adminuser/tokenlogin`
      );
      setAdmin(res.data.admin);
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
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a spinner or loading indicator
  }
  return (
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
          <Route path="/admin/examination_recruit" element={<JobPostAllow />} />
          <Route path="/admin/member/" element={<MembersManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

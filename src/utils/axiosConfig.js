import axios from "axios";
import { message } from "antd";

// Create a function to set up the axios interceptors
export const setupAxiosInterceptors = (navigate, setIsAuthenticated) => {
  // Request interceptor - adds the token to all requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handles token expiration
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check if this is a 401 Unauthorized error
      if (error.response?.status === 401) {
        // Clear authentication data
        localStorage.removeItem("token");
        setIsAuthenticated(false);

        // Show message to user
        message.error(
          "セッションの有効期限が切れました。再度ログインしてください。"
        );

        // Redirect to login page
        navigate("/");

        // Return a resolved promise to prevent the error from propagating
        // This is the key to preventing the red error screen
        return Promise.resolve({ data: { success: false, isAuthError: true } });
      }

      // For other errors, let them propagate as normal
      return Promise.reject(error);
    }
  );
};

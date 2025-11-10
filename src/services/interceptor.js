import axios from "axios";

// Create Axios instance
const apiAdmin = axios.create({
  baseURL: "http://localhost:4000/api",

  // baseURL: "https://furniture-backend-or9h.onrender.com/api",
  
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to every request
apiAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (import.meta.env.DEV) {
        console.log("✅ Token attached to request");
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// ✅ Handle global errors
apiAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Token expired or unauthorized
      if (status === 401) {
        if (import.meta.env.DEV) {
          console.warn("⚠️ Unauthorized - Redirecting to login...");
        }
        localStorage.clear();
        window.location.replace("/auth/sign-in");
      }
    } else {
      console.error("❌ Network or server error:", error);
    }

    return Promise.reject(error);
  }
);

export default apiAdmin;

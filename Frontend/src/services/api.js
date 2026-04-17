
import axios from "axios";

const api = axios.create({
  baseURL: "https://hospitalpatientmanagement-1.onrender.com",
  withCredentials: true,
});

// Attach token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Silently handle 401 — AuthContext handles redirect
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // sesuaikan backend

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor untuk menambahkan token
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

// Response interceptor untuk menangani 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired atau unauthorized
      console.warn("Unauthorized, redirecting to login...");
      localStorage.removeItem("token"); // hapus token lama
      window.location.href = "/login"; // redirect ke halaman login
    }
    return Promise.reject(error);
  }
);

export default api;

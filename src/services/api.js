import axios from "axios";

// ================= BASE API URL =================
// Vite provides environment variables with import.meta.env
// We strip any trailing slashes to prevent double slashes (e.g. https://domain.com//api)
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_URL = rawApiUrl.replace(/\/+$/, "");

// ================= CENTRALIZED AXIOS INSTANCE =================
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach JWT Token from localStorage if present
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Standardized error parsing
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 401 Unauthorized occurs on protected routes
        if (error.response && error.response.status === 401) {
            console.warn("Session expired or unauthorized request");
        }
        return Promise.reject(error);
    }
);

// ================= IMAGE URL HELPER =================
// Ensures frontend static assets (/images/...) stay local to Vercel/Vite
// and backend uploads (/uploads/...) resolve through backend API_URL
export const resolveImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== "string") return "";

    // Normalize Windows backslashes
    let path = imagePath.trim().replace(/\\/g, "/");

    // Strip hardcoded localhost / 127.0.0.1 development base URLs if stored in DB
    path = path.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "");

    // If it's an external absolute URL
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // If it's a frontend static asset inside public/images
    if (path.startsWith("/images/") || path.startsWith("images/")) {
        return path.startsWith("/") ? path : `/${path}`;
    }

    // If it's a backend upload inside uploads/
    if (path.startsWith("/uploads/") || path.startsWith("uploads/")) {
        const normalized = path.startsWith("/") ? path : `/${path}`;
        return `${API_URL}${normalized}`;
    }

    // If it has a leading slash
    if (path.startsWith("/")) {
        return `${API_URL}${path}`;
    }

    // Fallback: assume raw uploaded filename
    return `${API_URL}/uploads/${path}`;
};

export const getImageUrl = resolveImageUrl;

export default api;


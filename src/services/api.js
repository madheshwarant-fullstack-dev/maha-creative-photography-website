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
// Ensures frontend static assets (/images/...) stay local to Vercel
// and backend uploads (/uploads/...) resolve through Render backend
export const resolveImageUrl = (imagePath) => {
    if (!imagePath) return "";

    // If it's already an external absolute URL
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }

    // If it's a frontend static asset inside public/images
    if (imagePath.startsWith("/images") || imagePath.startsWith("images/")) {
        return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    }

    // If it's a backend upload inside uploads/
    const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${API_URL}${normalized}`;
};

export default api;

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

// ================= NEUTRAL IMAGE PLACEHOLDER =================
// A clean, neutral SVG placeholder for when images fail to load or are missing.
// Never uses the hero banner or any other page-specific asset.
export const NEUTRAL_PLACEHOLDER_IMAGE =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20width%3D%22600%22%20height%3D%22400%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23262626%22%2F%3E%3Cpath%20d%3D%22M210%20140h35l20-30h70l20%2030h35c16.5%200%2030%2013.5%2030%2030v110c0%2016.5-13.5%2030-30%2030H210c-16.5%200-30-13.5-30-30V170c0-16.5%2013.5-30%2030-30z%22%20fill%3D%22none%22%20stroke%3D%22%23666666%22%20stroke-width%3D%228%22%2F%3E%3Ccircle%20cx%3D%22300%22%20cy%3D%22205%22%20r%3D%2245%22%20fill%3D%22none%22%20stroke%3D%22%23666666%22%20stroke-width%3D%228%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22320%22%20text-anchor%3D%22middle%22%20fill%3D%22%23888888%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2218%22%20letter-spacing%3D%221%22%3EIMAGE%20UNAVAILABLE%3C%2Ftext%3E%3C%2Fsvg%3E";

// ================= IMAGE URL HELPER =================
// Ensures frontend static assets (/images/...) stay local to Vercel/Vite
// and backend uploads (/uploads/...) resolve through backend API_URL
const safeEncodeUri = (url) => {
    try {
        return encodeURI(decodeURI(url));
    } catch {
        return encodeURI(url);
    }
};

export const resolveImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== "string") return "";

    // If it's already a data URL or blob URL
    if (imagePath.startsWith("data:") || imagePath.startsWith("blob:")) {
        return imagePath;
    }

    // Normalize Windows backslashes
    let path = imagePath.trim().replace(/\\/g, "/");

    // Strip hardcoded localhost / 127.0.0.1 development base URLs if stored in DB
    path = path.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "");

    // If it's an external absolute URL (Cloudinary, AWS S3, etc.)
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return safeEncodeUri(path);
    }

    // If it's a frontend static asset inside public/images
    if (path.startsWith("/images/") || path.startsWith("images/")) {
        const normalized = path.startsWith("/") ? path : `/${path}`;
        return safeEncodeUri(normalized);
    }

    // If it's a backend upload inside uploads/
    if (path.startsWith("/uploads/") || path.startsWith("uploads/")) {
        const normalized = path.startsWith("/") ? path : `/${path}`;
        return safeEncodeUri(`${API_URL}${normalized}`);
    }

    // If it has a leading slash
    if (path.startsWith("/")) {
        return safeEncodeUri(`${API_URL}${path}`);
    }

    // Fallback: assume raw uploaded filename
    return safeEncodeUri(`${API_URL}/uploads/${path}`);
};

export const getImageUrl = resolveImageUrl;

export default api;


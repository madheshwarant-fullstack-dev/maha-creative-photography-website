import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [stats, setStats] = useState({
        packages: 0,
        gallery: 0,
        bookings: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH DASHBOARD DATA =================

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            // Packages and Gallery are public
            // Bookings require Admin JWT

            const [
                packagesResponse,
                galleryResponse,
                bookingsResponse,
            ] = await Promise.all([
                fetch(`${API_URL}/api/packages`),

                fetch(`${API_URL}/api/gallery`),

                fetch(`${API_URL}/api/bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            const packagesData =
                await packagesResponse.json();

            const galleryData =
                await galleryResponse.json();

            const bookingsData =
                await bookingsResponse.json();

            // ================= CHECK BOOKING AUTH =================

            if (!bookingsResponse.ok) {
                throw new Error(
                    bookingsData.message ||
                    "Failed to fetch bookings"
                );
            }

            const packages = packagesData.success
                ? packagesData.packages
                : [];

            const gallery = galleryData.success
                ? galleryData.gallery
                : [];

            const bookings = bookingsData.success
                ? bookingsData.bookings
                : [];

            // ================= SET STATISTICS =================

            setStats({
                packages: packages.length,

                gallery: gallery.length,

                bookings: bookings.length,

                pending: bookings.filter(
                    (booking) =>
                        booking.status === "Pending"
                ).length,

                confirmed: bookings.filter(
                    (booking) =>
                        booking.status === "Confirmed"
                ).length,

                completed: bookings.filter(
                    (booking) =>
                        booking.status === "Completed"
                ).length,

                cancelled: bookings.filter(
                    (booking) =>
                        booking.status === "Cancelled"
                ).length,
            });
        } catch (error) {
            console.error(
                "Dashboard data fetch error:",
                error
            );

            setError(
                error.message ===
                    "Admin access required."
                    ? "Admin access required."
                    : error.message ===
                      "Invalid or expired token."
                    ? "Session expired. Please login again."
                    : "Unable to load dashboard data"
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= LOAD DASHBOARD =================

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // ================= LOGOUT =================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/admin/login");
    };

    // ================= RENDER =================

    return (
        <div className="container py-5 admin-dashboard">

            {/* ================= HEADER ================= */}

            <div className="d-flex justify-content-between align-items-center mb-5 dashboard-header">

                <div>
                    <h1 className="fw-bold dashboard-title">
                        Admin Dashboard
                    </h1>

                    <p className="text-muted mb-0 dashboard-welcome">
                        Welcome back,{" "}
                        {user?.name || "Admin"}
                    </p>
                </div>

                <button
                    className="btn btn-outline-danger logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* ================= STATISTICS ================= */}

            <div className="row g-4 mb-5">

                {/* Total Bookings */}

                <div className="col-md-6 col-lg-3">

                    <div className="card shadow-sm border-0 h-100 stats-card">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1 stats-label">
                                        Total Bookings
                                    </p>

                                    <h2 className="fw-bold mb-0 stats-number">
                                        {loading
                                            ? "..."
                                            : stats.bookings}
                                    </h2>

                                </div>

                                <span className="stats-icon">
                                    <i className="bi bi-calendar-day-fill"></i>
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Pending */}

                <div className="col-md-6 col-lg-3">

                    <div className="card shadow-sm border-0 h-100 stats-card">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1 stats-label">
                                        Pending
                                    </p>

                                    <h2 className="fw-bold mb-0 stats-number">
                                        {loading
                                            ? "..."
                                            : stats.pending}
                                    </h2>

                                </div>

                                <span className="stats-icon">
                                    <i className="bi bi-hourglass-split"></i>
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Confirmed */}

                <div className="col-md-6 col-lg-3">

                    <div className="card shadow-sm border-0 h-100 stats-card">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1 stats-label">
                                        Confirmed
                                    </p>

                                    <h2 className="fw-bold mb-0 stats-number">
                                        {loading
                                            ? "..."
                                            : stats.confirmed}
                                    </h2>

                                </div>

                                <span className="stats-icon">
                                    <i className="bi bi-check2"></i>
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Completed */}

                <div className="col-md-6 col-lg-3">

                    <div className="card shadow-sm border-0 h-100 stats-card">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="text-muted mb-1 stats-label">
                                        Completed
                                    </p>

                                    <h2 className="fw-bold mb-0 stats-number">
                                        {loading
                                            ? "..."
                                            : stats.completed}
                                    </h2>

                                </div>

                                <span className="stats-icon">
                                    <i className="bi bi-check-circle-fill"></i>
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= MANAGEMENT CARDS ================= */}

            <div className="row g-4">

                {/* Users */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100 management-card">

                        <div className="card-body p-4">

                            <h5 className="fw-bold management-title">
                                <i className="bi bi-people-fill"></i>{" "}
                                Users
                            </h5>

                            <p className="text-muted management-description">
                                Manage registered users.
                            </p>

                            <Link
                                to="/admin/users"
                                className="btn btn-dark management-btn"
                            >
                                Manage Users
                            </Link>

                        </div>

                    </div>

                </div>

                {/* Bookings */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100 management-card">

                        <div className="card-body p-4">

                            <h5 className="fw-bold management-title">
                                <i className="bi bi-calendar-day-fill"></i>{" "}
                                Bookings
                            </h5>

                            <p className="text-muted management-description">
                                View and manage client bookings.
                            </p>

                            <div className="booking-badges">

                                <span className="badge bg-warning text-dark me-2 booking-badge">
                                    Pending:{" "}
                                    {stats.pending}
                                </span>

                                <span className="badge bg-primary booking-badge">
                                    Confirmed:{" "}
                                    {stats.confirmed}
                                </span>

                            </div>

                            <Link
                                to="/admin/bookings"
                                className="btn btn-dark management-btn"
                            >
                                Manage Bookings
                            </Link>

                        </div>

                    </div>

                </div>

                {/* Gallery */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100 management-card">

                        <div className="card-body p-4">

                            <h5 className="fw-bold management-title">
                                <i className="bi bi-image"></i>{" "}
                                Gallery
                            </h5>

                            <p className="text-muted management-description">
                                Add and manage gallery photos.
                            </p>

                            <h4 className="fw-bold item-count">
                                {loading
                                    ? "..."
                                    : stats.gallery}{" "}
                                Photos
                            </h4>

                            <Link
                                to="/admin/gallery"
                                className="btn btn-dark management-btn"
                            >
                                Manage Gallery
                            </Link>

                        </div>

                    </div>

                </div>

                {/* Packages */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100 management-card">

                        <div className="card-body p-4">

                            <h5 className="fw-bold management-title">
                                <i className="bi bi-box2-fill"></i>{" "}
                                Packages
                            </h5>

                            <p className="text-muted management-description">
                                Manage photography packages.
                            </p>

                            <h4 className="fw-bold item-count">
                                {loading
                                    ? "..."
                                    : stats.packages}{" "}
                                Packages
                            </h4>

                            <Link
                                to="/admin/packages"
                                className="btn btn-dark management-btn"
                            >
                                Manage Packages
                            </Link>

                        </div>

                    </div>

                </div>

                {/* Messages */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100 management-card">

                        <div className="card-body p-4">

                            <h5 className="fw-bold management-title">
                                <i className="bi bi-chat-dots"></i>{" "}
                                Messages
                            </h5>

                            <p className="text-muted management-description">
                                View client messages and enquiries.
                            </p>

                            <Link
                                to="/admin/messages"
                                className="btn btn-dark management-btn"
                            >
                                View Messages
                            </Link>

                        </div>

                    </div>

                </div>

                {/* Cancelled Bookings */}

                <div className="col-md-4">

                    <div className="card shadow-sm border-0 h-100 management-card">

                        <div className="card-body p-4">

                            <h5 className="fw-bold management-title">
                                <i className="bi bi-x-lg"></i>{" "}
                                Cancelled Bookings
                            </h5>

                            <p className="text-muted management-description">
                                Bookings cancelled by clients or admin.
                            </p>

                            <h4 className="fw-bold item-count">
                                {loading
                                    ? "..."
                                    : stats.cancelled}
                            </h4>

                            <Link
                                to="/admin/bookings"
                                className="btn btn-outline-danger cancelled-btn"
                            >
                                View Bookings
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH PROFILE =================

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/auth/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                    return;
                }

                throw new Error(
                    data.message ||
                        "Failed to fetch profile"
                );
            }

            if (data.success) {
                setUser(data.user);

                // Keep localStorage user data updated
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            } else {
                setError(
                    data.message ||
                        "Unable to load profile"
                );
            }
        } catch (error) {
            console.error(
                "Profile fetch error:",
                error
            );

            setError(
                error.message ||
                    "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= LOAD PROFILE =================

    useEffect(() => {
        fetchProfile();
    }, []);

    // ================= LOGOUT =================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <section className="py-5">
                <div className="container text-center">

                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="text-muted mt-3">
                        Loading your profile...
                    </p>

                </div>
            </section>
        );
    }

    // ================= ERROR =================

    if (error) {
        return (
            <section className="py-5">
                <div className="container">

                    <div className="alert alert-danger text-center">
                        {error}
                    </div>

                    <div className="text-center">

                        <button
                            className="btn btn-dark"
                            onClick={fetchProfile}
                        >
                            Try Again
                        </button>

                    </div>

                </div>
            </section>
        );
    }

    // ================= NO USER =================

    if (!user) {
        return (
            <section className="py-5">
                <div className="container text-center">

                    <h4>
                        Profile not found
                    </h4>

                    <button
                        className="btn btn-dark mt-3"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                </div>
            </section>
        );
    }

    // ================= PROFILE =================

    return (
        <section className="py-5">
            <div className="container">

                {/* ================= HEADING ================= */}

                <div className="text-center mb-5">

                    <h2 className="fw-bold">
                        My Profile
                    </h2>

                    <p className="text-muted">
                        View your Maha Creative
                        Photography account details
                    </p>

                </div>

                {/* ================= PROFILE CARD ================= */}

                <div className="row justify-content-center">

                    <div className="col-md-8 col-lg-6">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4 p-md-5">

                                {/* PROFILE ICON */}

                                <div className="text-center mb-4">

                                    <div
                                        className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto"
                                        style={{
                                            width: "90px",
                                            height: "90px",
                                            fontSize: "36px",
                                        }}
                                    >
                                        <i className="bi bi-person-fill"></i>
                                    </div>

                                    <h4 className="fw-bold mt-3 mb-1">
                                        {user.name}
                                    </h4>

                                    <span
                                        className={`badge ${
                                            user.role ===
                                            "admin"
                                                ? "bg-danger"
                                                : "bg-primary"
                                        }`}
                                    >
                                        {user.role ===
                                        "admin"
                                            ? "Admin"
                                            : "Client"}
                                    </span>

                                </div>

                                <hr />

                                {/* ================= NAME ================= */}

                                <div className="mb-3">

                                    <label className="form-label text-muted small">
                                        Full Name
                                    </label>

                                    <div className="form-control bg-light">
                                        <i className="bi bi-person me-2"></i>
                                        {user.name || "-"}
                                    </div>

                                </div>

                                {/* ================= EMAIL ================= */}

                                <div className="mb-3">

                                    <label className="form-label text-muted small">
                                        Email Address
                                    </label>

                                    <div className="form-control bg-light">
                                        <i className="bi bi-envelope me-2"></i>
                                        {user.email || "-"}
                                    </div>

                                </div>

                                {/* ================= PHONE ================= */}

                                <div className="mb-3">

                                    <label className="form-label text-muted small">
                                        Phone Number
                                    </label>

                                    <div className="form-control bg-light">
                                        <i className="bi bi-telephone me-2"></i>
                                        {user.phone || "-"}
                                    </div>

                                </div>

                                {/* ================= ROLE ================= */}

                                <div className="mb-4">

                                    <label className="form-label text-muted small">
                                        Account Type
                                    </label>

                                    <div className="form-control bg-light">
                                        <i className="bi bi-shield-check me-2"></i>
                                        {user.role ===
                                        "admin"
                                            ? "Administrator"
                                            : "Client"}
                                    </div>

                                </div>

                                {/* ================= ACTIONS ================= */}

                                <div className="d-grid gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-dark"
                                        onClick={() =>
                                            navigate(
                                                "/my-bookings"
                                            )
                                        }
                                    >
                                        <i className="bi bi-camera me-2"></i>
                                        My Bookings
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Logout
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Profile;
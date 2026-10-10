import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../services/api";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", phone: "" });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateStatus, setUpdateStatus] = useState({ success: "", error: "" });

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
                setEditForm({
                    name: data.user.name || "",
                    phone: data.user.phone || "",
                });

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

    // ================= UPDATE PROFILE HANDLER =================

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateStatus({ success: "", error: "" });

        if (!editForm.name.trim() || !editForm.phone.trim()) {
            setUpdateStatus({
                success: "",
                error: "Name and phone cannot be empty.",
            });
            return;
        }

        try {
            setUpdateLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editForm.name.trim(),
                    phone: editForm.phone.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to update profile");
            }

            setUser(data.user);
            setIsEditing(false);
            setUpdateStatus({
                success: "Profile updated successfully!",
                error: "",
            });

            // Update stored user details and notify listeners (e.g. Navbar)
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("storage"));
        } catch (err) {
            console.error("Profile update error:", err);
            setUpdateStatus({
                success: "",
                error: err.message || "Failed to update profile",
            });
        } finally {
            setUpdateLoading(false);
        }
    };

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

                    <h1 className="fw-bold fs-2">
                        My Profile
                    </h1>

                    <p className="text-muted">
                        Manage your Maha Creative Photography account details
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
                                        aria-hidden="true"
                                    >
                                        <i className="bi bi-person-fill"></i>
                                    </div>

                                    <h2 className="fw-bold mt-3 mb-1 fs-4">
                                        {user.name}
                                    </h2>

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

                                {/* Status Feedback */}
                                {updateStatus.success && (
                                    <div className="alert alert-success py-2 small" role="alert">
                                        <i className="bi bi-check-circle me-2"></i>
                                        {updateStatus.success}
                                    </div>
                                )}
                                {updateStatus.error && (
                                    <div className="alert alert-danger py-2 small" role="alert">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {updateStatus.error}
                                    </div>
                                )}

                                <hr />

                                {!isEditing ? (
                                    <>
                                        {/* ================= VIEW MODE ================= */}

                                        {/* NAME */}
                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-semibold">
                                                Full Name
                                            </label>
                                            <div className="form-control bg-light">
                                                <i className="bi bi-person me-2 text-muted"></i>
                                                {user.name || "-"}
                                            </div>
                                        </div>

                                        {/* EMAIL */}
                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-semibold">
                                                Email Address
                                            </label>
                                            <div className="form-control bg-light">
                                                <i className="bi bi-envelope me-2 text-muted"></i>
                                                {user.email || "-"}
                                            </div>
                                        </div>

                                        {/* PHONE */}
                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-semibold">
                                                Phone Number
                                            </label>
                                            <div className="form-control bg-light">
                                                <i className="bi bi-telephone me-2 text-muted"></i>
                                                {user.phone || "-"}
                                            </div>
                                        </div>

                                        {/* ROLE */}
                                        <div className="mb-4">
                                            <label className="form-label text-muted small fw-semibold">
                                                Account Type
                                            </label>
                                            <div className="form-control bg-light">
                                                <i className="bi bi-shield-check me-2 text-muted"></i>
                                                {user.role === "admin" ? "Administrator" : "Client"}
                                            </div>
                                        </div>

                                        {/* ================= ACTIONS ================= */}

                                        <div className="d-grid gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-dark"
                                                onClick={() => {
                                                    setEditForm({
                                                        name: user.name || "",
                                                        phone: user.phone || "",
                                                    });
                                                    setIsEditing(true);
                                                }}
                                            >
                                                <i className="bi bi-pencil-square me-2"></i>
                                                Edit Profile
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-dark"
                                                onClick={() => navigate("/my-bookings")}
                                            >
                                                <i className="bi bi-camera me-2"></i>
                                                My Bookings
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={handleLogout}
                                            >
                                                <i className="bi bi-box-arrow-right me-2"></i>
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* ================= EDIT MODE ================= */}
                                        <form onSubmit={handleUpdateProfile}>
                                            <div className="mb-3">
                                                <label htmlFor="profileName" className="form-label small fw-semibold">
                                                    Full Name <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="bi bi-person text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="profileName"
                                                        className="form-control"
                                                        value={editForm.name}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, name: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label text-muted small fw-semibold">
                                                    Email Address (Read-only)
                                                </label>
                                                <div className="form-control bg-light text-muted">
                                                    <i className="bi bi-envelope me-2"></i>
                                                    {user.email}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="profilePhone" className="form-label small fw-semibold">
                                                    Phone Number <span className="text-danger">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="bi bi-telephone text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        id="profilePhone"
                                                        className="form-control"
                                                        value={editForm.phone}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, phone: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-grid gap-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-dark"
                                                    disabled={updateLoading}
                                                >
                                                    {updateLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Saving Changes...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-check-lg me-2"></i>
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    disabled={updateLoading}
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Profile;
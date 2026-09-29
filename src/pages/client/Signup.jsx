import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ================= INPUT CHANGE =================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ================= FORM SUBMIT =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ================= VALIDATION =================

        if (!formData.name.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!formData.phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!formData.password) {
            setError("Please enter a password.");
            return;
        }

        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        phone: formData.phone.trim(),
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Registration failed"
                );
            }

            if (data.success) {
                setSuccess(
                    "Account created successfully! Redirecting to login..."
                );

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                });

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                setError(
                    data.message ||
                        "Unable to create account."
                );
            }
        } catch (error) {
            console.error(
                "Signup error:",
                error
            );

            setError(
                error.message ||
                    "Unable to connect to server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="py-5"
            style={{
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
            }}
        >
            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-md-8 col-lg-6 col-xl-5">

                        {/* ================= SIGNUP CARD ================= */}

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4 p-md-5">

                                {/* ================= HEADER ================= */}

                                <div className="text-center mb-4">

                                    <div
                                        className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            fontSize: "28px",
                                        }}
                                    >
                                        <i className="bi bi-person-plus-fill"></i>
                                    </div>

                                    <h2 className="fw-bold mb-2">
                                        Create Account
                                    </h2>

                                    <p className="text-muted mb-0">
                                        Join Maha Creative Photography
                                    </p>

                                </div>

                                {/* ================= SUCCESS ================= */}

                                {success && (
                                    <div
                                        className="alert alert-success"
                                        role="alert"
                                    >
                                        <i className="bi bi-check-circle me-2"></i>
                                        {success}
                                    </div>
                                )}

                                {/* ================= ERROR ================= */}

                                {error && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        <i className="bi bi-exclamation-circle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                {/* ================= FORM ================= */}

                                <form
                                    onSubmit={handleSubmit}
                                >

                                    {/* ================= NAME ================= */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="name"
                                            className="form-label fw-semibold"
                                        >
                                            Full Name
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">
                                                <i className="bi bi-person"></i>
                                            </span>

                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="form-control"
                                                placeholder="Enter your full name"
                                                value={
                                                    formData.name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    loading
                                                }
                                                autoComplete="name"
                                            />

                                        </div>

                                    </div>

                                    {/* ================= EMAIL ================= */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="email"
                                            className="form-label fw-semibold"
                                        >
                                            Email Address
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">
                                                <i className="bi bi-envelope"></i>
                                            </span>

                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Enter your email"
                                                value={
                                                    formData.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    loading
                                                }
                                                autoComplete="email"
                                            />

                                        </div>

                                    </div>

                                    {/* ================= PHONE ================= */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="phone"
                                            className="form-label fw-semibold"
                                        >
                                            Phone Number
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">
                                                <i className="bi bi-telephone"></i>
                                            </span>

                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className="form-control"
                                                placeholder="Enter your phone number"
                                                value={
                                                    formData.phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    loading
                                                }
                                                autoComplete="tel"
                                            />

                                        </div>

                                    </div>

                                    {/* ================= PASSWORD ================= */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="password"
                                            className="form-label fw-semibold"
                                        >
                                            Password
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">
                                                <i className="bi bi-lock"></i>
                                            </span>

                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                className="form-control"
                                                placeholder="Enter your password"
                                                value={
                                                    formData.password
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    loading
                                                }
                                                autoComplete="new-password"
                                            />

                                        </div>

                                        <small className="text-muted">
                                            Minimum 6 characters
                                        </small>

                                    </div>

                                    {/* ================= CONFIRM PASSWORD ================= */}

                                    <div className="mb-4">

                                        <label
                                            htmlFor="confirmPassword"
                                            className="form-label fw-semibold"
                                        >
                                            Confirm Password
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">
                                                <i className="bi bi-lock-fill"></i>
                                            </span>

                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                className="form-control"
                                                placeholder="Confirm your password"
                                                value={
                                                    formData.confirmPassword
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    loading
                                                }
                                                autoComplete="new-password"
                                            />

                                        </div>

                                    </div>

                                    {/* ================= SUBMIT ================= */}

                                    <div className="d-grid">

                                        <button
                                            type="submit"
                                            className="btn btn-dark btn-lg"
                                            disabled={
                                                loading
                                            }
                                        >
                                            {loading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>

                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-person-plus me-2"></i>
                                                    Create Account
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </form>

                                {/* ================= LOGIN LINK ================= */}

                                <div className="text-center mt-4">

                                    <p className="text-muted mb-0">
                                        Already have an account?
                                    </p>

                                    <Link
                                        to="/login"
                                        className="fw-semibold text-decoration-none"
                                    >
                                        Login here
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Signup;
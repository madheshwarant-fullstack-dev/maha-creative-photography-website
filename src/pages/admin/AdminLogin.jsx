import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function AdminLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ================= INPUT CHANGE =================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ================= LOGIN =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError(
                "Please enter email and password."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Invalid email or password."
                );
            }

            // ================= CHECK ADMIN =================

            if (
                !data.user ||
                data.user.role !== "admin"
            ) {
                setError(
                    "Access denied. Admin account required."
                );
                return;
            }

            // ================= SAVE LOGIN =================

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // ================= DASHBOARD =================

            navigate("/admin/dashboard");

        } catch (error) {
            console.error(
                "Admin login error:",
                error
            );

            setError(
                error.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                background:
                    "linear-gradient(135deg, #f8f9fa, #e9ecef)",
            }}
        >
            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-md-6 col-lg-4">

                        <div className="card border-0 shadow-lg">

                            <div className="card-body p-4 p-md-5">

                                {/* ================= LOGO ================= */}

                                <div className="text-center mb-4">

                                    <img
                                        src="/images/Logo.png"
                                        alt="Maha Creative Photography"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit:
                                                "contain",
                                        }}
                                    />

                                    <h3 className="fw-bold mt-3 mb-1">
                                        Admin Login
                                    </h3>

                                    <p className="text-muted mb-0">
                                        Maha Creative Photography
                                    </p>

                                </div>


                                {/* ================= ERROR ================= */}

                                {error && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {error}
                                    </div>
                                )}


                                {/* ================= FORM ================= */}

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                >

                                    {/* EMAIL */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Admin Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Enter admin email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* PASSWORD */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Enter password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* LOGIN BUTTON */}

                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 py-2"
                                        disabled={
                                            loading
                                        }
                                    >
                                        {loading
                                            ? "Logging in..."
                                            : "Admin Login"}
                                    </button>

                                </form>


                                {/* ================= BACK ================= */}

                                <div className="text-center mt-4">

                                    <button
                                        type="button"
                                        className="btn btn-link text-decoration-none"
                                        onClick={() =>
                                            navigate("/")
                                        }
                                    >
                                        ← Back to Website
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

export default AdminLogin;
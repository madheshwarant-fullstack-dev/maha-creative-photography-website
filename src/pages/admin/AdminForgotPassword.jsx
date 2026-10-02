import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your admin email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/admin/forgot-password", {
        email: trimmedEmail,
      });

      if (response.data && response.data.success) {
        setSuccess(
          response.data.message ||
            "If an admin account with that email exists, a password reset link has been sent to your email."
        );
        setEmail("");
      } else {
        setError(
          response.data?.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("Admin forgot password error:", err);
      const serverMessage =
        err.response?.data?.message ||
        "Unable to connect to the server. Please check your connection and try again.";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">

                {/* Logo & Header */}
                <div className="text-center mb-4">
                  <img
                    src="/images/Logo.png"
                    alt="Maha Creative Photography"
                    style={{
                      width: "95px",
                      height: "95px",
                      objectFit: "contain",
                    }}
                  />

                  <div className="mt-3 mb-1 d-flex align-items-center justify-content-center gap-2">
                    <span className="badge bg-dark px-2 py-1 small">
                      <i className="bi bi-shield-lock me-1"></i> Admin Portal
                    </span>
                  </div>

                  <h3 className="fw-bold mt-2 mb-1">
                    Password Recovery
                  </h3>

                  <p className="text-muted small mb-0">
                    Maha Creative Photography Management
                  </p>
                </div>

                {/* Success Message */}
                {success && (
                  <div
                    className="alert alert-success py-3 small rounded-3"
                    role="alert"
                  >
                    <div className="d-flex align-items-start">
                      <i className="bi bi-check-circle-fill text-success fs-5 me-2 mt-0"></i>
                      <div>
                        <strong>Reset Link Dispatched</strong>
                        <p className="mb-0 mt-1">{success}</p>
                        <small className="text-muted d-block mt-2">
                          Please verify your inbox and spam folder. Link valid for 1 hour.
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div
                    className="alert alert-danger py-2 small rounded-3"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="adminEmail"
                      className="form-label fw-semibold small"
                    >
                      Registered Admin Email
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        id="adminEmail"
                        className="form-control border-start-0 ps-0"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        autoFocus
                      />
                    </div>
                    <small className="form-text text-muted">
                      A secured tokenized reset URL will be sent to this email.
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Generating Secure Link...
                      </>
                    ) : (
                      "Send Admin Reset Link"
                    )}
                  </button>
                </form>

                {/* Back to Admin Login */}
                <div className="text-center mt-4 pt-3 border-top">
                  <Link
                    to="/admin/login"
                    className="small text-decoration-none fw-semibold text-secondary"
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Admin Login
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

export default AdminForgotPassword;

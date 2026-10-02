import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function ForgotPassword() {
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
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/forgot-password", {
        email: trimmedEmail,
      });

      if (response.data && response.data.success) {
        setSuccess(
          response.data.message ||
            "If an account with that email exists, a password reset link has been sent to your email."
        );
        setEmail("");
      } else {
        setError(
          response.data?.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      const serverMessage =
        err.response?.data?.message ||
        "Unable to connect to the server. Please check your connection and try again.";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-password-page min-vh-100 d-flex align-items-center py-5"
      style={{
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 p-md-5">

                {/* Logo & Header */}
                <div className="text-center mb-4">
                  <Link to="/">
                    <img
                      src="/images/Logo.png"
                      alt="Maha Creative Photography"
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "contain",
                      }}
                      className="mb-2"
                    />
                  </Link>

                  <h3 className="fw-bold mb-1">
                    Forgot Password?
                  </h3>

                  <p className="text-muted small mb-0">
                    Enter your email to receive a password reset link
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
                        <strong>Reset Link Sent!</strong>
                        <p className="mb-0 mt-1">{success}</p>
                        <small className="text-muted d-block mt-2">
                          Please check your inbox and spam/junk folder. The link will expire in 1 hour.
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
                      htmlFor="email"
                      className="form-label fw-semibold small"
                    >
                      Email Address
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        id="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        autoFocus
                      />
                    </div>
                    <small className="form-text text-muted">
                      We'll send secure instructions to reset your password.
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
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center mt-4 pt-3 border-top">
                  <Link
                    to="/login"
                    className="small text-decoration-none fw-semibold"
                    style={{ color: "#ff1493" }}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Login
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

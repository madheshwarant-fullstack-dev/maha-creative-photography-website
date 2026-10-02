import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(3);

  // Verify token on initial load
  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      try {
        setVerifying(true);
        const res = await api.get(`/api/auth/verify-reset-token/${token}`);
        if (isMounted) {
          if (res.data && res.data.success) {
            setTokenValid(true);
          } else {
            setTokenValid(false);
            setError(res.data?.message || "Invalid or expired reset link.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setTokenValid(false);
          const msg =
            err.response?.data?.message ||
            "Password reset link is invalid or has expired.";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setVerifying(false);
      setError("No reset token provided.");
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle countdown and auto-redirect on success
  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate("/login");
    }
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(`/api/auth/reset-password/${token}`, {
        password,
      });

      if (response.data && response.data.success) {
        setSuccess(
          response.data.message ||
            "Password reset successful! Redirecting to login..."
        );
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(
          response.data?.message ||
            "Failed to reset password. The link may have expired."
        );
      }
    } catch (err) {
      console.error("Reset password error:", err);
      const msg =
        err.response?.data?.message ||
        "Unable to reset password. Please request a new link.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="reset-password-page min-vh-100 d-flex align-items-center py-5"
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
                    Reset Password
                  </h3>

                  <p className="text-muted small mb-0">
                    Create a new secure password for your account
                  </p>
                </div>

                {/* Verifying Token State */}
                {verifying && (
                  <div className="text-center py-4">
                    <span
                      className="spinner-border spinner-border-sm me-2 text-dark"
                      role="status"
                    ></span>
                    <span className="text-muted small">
                      Verifying reset link...
                    </span>
                  </div>
                )}

                {/* Invalid or Expired Token State */}
                {!verifying && !tokenValid && !success && (
                  <div className="text-center py-3">
                    <div className="alert alert-danger py-3 small rounded-3" role="alert">
                      <i className="bi bi-exclamation-triangle-fill fs-4 d-block mb-2 text-danger"></i>
                      <strong>Link Expired or Invalid</strong>
                      <p className="mb-0 mt-1">{error || "This password reset link is invalid or has expired."}</p>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                      <Link
                        to="/forgot-password"
                        className="btn btn-dark py-2 fw-semibold"
                      >
                        Request New Reset Link
                      </Link>
                      <Link
                        to="/login"
                        className="btn btn-outline-secondary py-2 small"
                      >
                        Back to Login
                      </Link>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="py-2 text-center">
                    <div className="alert alert-success py-3 small rounded-3" role="alert">
                      <i className="bi bi-check-circle-fill text-success fs-3 d-block mb-2"></i>
                      <strong>Password Reset Successful!</strong>
                      <p className="mb-0 mt-1">{success}</p>
                      <small className="text-muted d-block mt-2">
                        Redirecting to login in <strong>{countdown}</strong> seconds...
                      </small>
                    </div>

                    <div className="d-grid mt-4">
                      <Link
                        to="/login"
                        className="btn btn-dark py-2 fw-semibold"
                      >
                        Proceed to Login Now
                      </Link>
                    </div>
                  </div>
                )}

                {/* Reset Form */}
                {!verifying && tokenValid && !success && (
                  <>
                    {error && (
                      <div
                        className="alert alert-danger py-2 small rounded-3 mb-3"
                        role="alert"
                      >
                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      {/* New Password */}
                      <div className="mb-3">
                        <label
                          htmlFor="password"
                          className="form-label fw-semibold small"
                        >
                          New Password
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-lock text-muted"></i>
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-control border-start-0 border-end-0 ps-0"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                            autoFocus
                          />
                          <button
                            type="button"
                            className="input-group-text bg-light border-start-0 text-muted"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            <i
                              className={
                                showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                              }
                            ></i>
                          </button>
                        </div>
                        <small className="form-text text-muted">
                          Must be at least 8 characters.
                        </small>
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-4">
                        <label
                          htmlFor="confirmPassword"
                          className="form-label fw-semibold small"
                        >
                          Confirm Password
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-lock-fill text-muted"></i>
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="form-control border-start-0 border-end-0 ps-0"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="input-group-text bg-light border-start-0 text-muted"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            <i
                              className={
                                showConfirmPassword
                                  ? "bi bi-eye-slash"
                                  : "bi bi-eye"
                              }
                            ></i>
                          </button>
                        </div>
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
                            Updating Password...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </form>

                    {/* Back to Login */}
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
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function AdminResetPassword() {
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

  // Verify admin token on mount
  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      try {
        setVerifying(true);
        const res = await api.get(`/api/auth/admin/verify-reset-token/${token}`);
        if (isMounted) {
          if (res.data && res.data.success) {
            setTokenValid(true);
          } else {
            setTokenValid(false);
            setError(
              res.data?.message || "Invalid or expired admin reset link."
            );
          }
        }
      } catch (err) {
        if (isMounted) {
          setTokenValid(false);
          const msg =
            err.response?.data?.message ||
            "Admin password reset link is invalid or has expired.";
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
      setError("No admin reset token provided.");
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Countdown & auto-redirect on success
  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate("/admin/login");
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

      const response = await api.post(
        `/api/auth/admin/reset-password/${token}`,
        {
          password,
        }
      );

      if (response.data && response.data.success) {
        setSuccess(
          response.data.message ||
            "Admin password reset successful! Redirecting to login..."
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
      console.error("Admin reset password error:", err);
      const msg =
        err.response?.data?.message ||
        "Unable to reset admin password. Please request a new link.";
      setError(msg);
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
                    Set Admin Password
                  </h3>

                  <p className="text-muted small mb-0">
                    Update your administrative credentials
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
                      Verifying admin token security...
                    </span>
                  </div>
                )}

                {/* Invalid or Expired Token State */}
                {!verifying && !tokenValid && !success && (
                  <div className="text-center py-3">
                    <div className="alert alert-danger py-3 small rounded-3" role="alert">
                      <i className="bi bi-shield-exclamation fs-3 d-block mb-2 text-danger"></i>
                      <strong>Token Invalid or Expired</strong>
                      <p className="mb-0 mt-1">{error || "This admin reset link is invalid or has expired."}</p>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                      <Link
                        to="/admin/forgot-password"
                        className="btn btn-dark py-2 fw-semibold"
                      >
                        Request New Admin Link
                      </Link>
                      <Link
                        to="/admin/login"
                        className="btn btn-outline-secondary py-2 small"
                      >
                        Back to Admin Login
                      </Link>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {success && (
                  <div className="py-2 text-center">
                    <div className="alert alert-success py-3 small rounded-3" role="alert">
                      <i className="bi bi-check-circle-fill text-success fs-3 d-block mb-2"></i>
                      <strong>Admin Password Updated!</strong>
                      <p className="mb-0 mt-1">{success}</p>
                      <small className="text-muted d-block mt-2">
                        Redirecting to Admin Login in <strong>{countdown}</strong> seconds...
                      </small>
                    </div>

                    <div className="d-grid mt-4">
                      <Link
                        to="/admin/login"
                        className="btn btn-dark py-2 fw-semibold"
                      >
                        Proceed to Admin Login
                      </Link>
                    </div>
                  </div>
                )}

                {/* Form State */}
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
                          htmlFor="adminPassword"
                          className="form-label fw-semibold small"
                        >
                          New Password
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="adminPassword"
                            className="form-control"
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
                            className="input-group-text bg-white text-muted"
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
                          htmlFor="confirmAdminPassword"
                          className="form-label fw-semibold small"
                        >
                          Confirm Password
                        </label>
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmAdminPassword"
                            className="form-control"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="input-group-text bg-white text-muted"
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
                            Updating Admin Password...
                          </>
                        ) : (
                          "Reset Admin Password"
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

export default AdminResetPassword;

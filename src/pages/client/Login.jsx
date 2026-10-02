import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Invalid email or password"
        );
        return;
      }

      // Prevent admin from using client login
      if (data.user && data.user.role === "admin") {
        setError(
          "Admin users must login through Admin Login"
        );
        return;
      }

      // Save authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page min-vh-100 d-flex align-items-center py-5"
      style={{
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 p-md-5">

                {/* Logo & Heading */}
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
                    Welcome Back
                  </h3>

                  <p className="text-muted small mb-0">
                    Login to Maha Creative Photography
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="alert alert-danger py-2 small"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>

                  {/* Email */}
                  <div className="mb-3">
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
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-2">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold small"
                    >
                      Password
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control border-start-0 border-end-0 ps-0"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="d-flex justify-content-end mb-3">
                    <Link
                      to="/forgot-password"
                      className="small text-decoration-none"
                      style={{ color: "#ff1493", fontWeight: "600" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login Button */}
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
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                </form>

                {/* Signup */}
                <div className="text-center mt-4 pt-2 border-top">
                  <p className="mb-0 small text-muted">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-decoration-none fw-semibold"
                      style={{ color: "#ff1493" }}
                    >
                      Create Account
                    </Link>
                  </p>
                </div>

                {/* Admin Login */}
                <div className="text-center mt-3">
                  <Link
                    to="/admin/login"
                    className="text-decoration-none small text-secondary"
                  >
                    <i className="bi bi-shield-lock me-1"></i>
                    Admin Portal
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

export default Login;
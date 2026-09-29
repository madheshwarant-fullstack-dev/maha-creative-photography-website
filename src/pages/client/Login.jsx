import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
            email,
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
    <div className="login-page">

      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">

            <div className="card shadow border-0">

              <div className="card-body p-4 p-md-5">

                {/* Heading */}
                <div className="text-center mb-4">

                  <h2 className="fw-bold">
                    Welcome Back
                  </h2>

                  <p className="text-muted">
                    Login to Maha Creative Photography
                  </p>

                </div>

                {/* Error */}
                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>

                  {/* Email */}
                  <div className="mb-3">

                    <label
                      htmlFor="email"
                      className="form-label fw-semibold"
                    >
                      Email Address
                    </label>

                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* Password */}
                  <div className="mb-3">

                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-dark w-100 mt-2"
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
                <div className="text-center mt-4">

                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-decoration-none fw-semibold"
                    >
                      Signup
                    </Link>
                  </p>

                </div>

                {/* Admin Login */}
                <div className="text-center mt-3">

                  <Link
                    to="/admin/login"
                    className="text-decoration-none"
                  >
                    Admin Login
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
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <section className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light">
            <div className="container text-center">
                <div className="mb-4">
                    <span
                        className="display-1 fw-bold text-dark"
                        style={{ letterSpacing: "2px" }}
                    >
                        404
                    </span>
                    <div className="text-secondary fs-3 fw-semibold mt-2">
                        Page Not Found
                    </div>
                </div>
                <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "500px" }}>
                    The page you are looking for does not exist or has been moved.
                    Please check the URL or return to our homepage.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/" className="btn btn-dark px-4 py-2">
                        <i className="bi bi-house-door-fill me-2"></i>
                        Back to Home
                    </Link>
                    <Link to="/gallery" className="btn btn-outline-dark px-4 py-2">
                        <i className="bi bi-images me-2"></i>
                        Explore Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default NotFound;

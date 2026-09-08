import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function MyBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/bookings/my-bookings`,
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
                    data.message || "Failed to fetch bookings"
                );
            }

            if (data.success) {
                setBookings(data.bookings || []);
            } else {
                setError(
                    data.message || "Unable to load bookings"
                );
            }
        } catch (error) {
            console.error(
                "My bookings fetch error:",
                error
            );

            setError("Unable to load your bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, []);

    // ================= STATUS DETAILS =================

    const getStatusDetails = (status) => {
        switch (status) {
            case "Confirmed":
                return {
                    icon: "✓",
                    className: "bg-success",
                    textClass: "text-success",
                };

            case "Completed":
                return {
                    icon: "✓",
                    className: "bg-primary",
                    textClass: "text-primary",
                };

            case "Cancelled":
                return {
                    icon: "✕",
                    className: "bg-danger",
                    textClass: "text-danger",
                };

            default:
                return {
                    icon: "⏳",
                    className: "bg-warning text-dark",
                    textClass: "text-warning",
                };
        }
    };

    // ================= STATUS PROGRESS =================

    const getStatusStep = (status) => {
        switch (status) {
            case "Pending":
                return 1;

            case "Confirmed":
                return 2;

            case "Completed":
                return 3;

            case "Cancelled":
                return 0;

            default:
                return 1;
        }
    };

    // ================= DATE FORMAT =================

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

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
                        Loading your bookings...
                    </p>
                </div>
            </section>
        );
    }

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
                            onClick={fetchMyBookings}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-5">
            <div className="container">

                {/* ================= HEADING ================= */}

                <div className="text-center mb-5">
                    <h2 className="fw-bold">
                        My Bookings
                    </h2>

                    <p className="text-muted">
                        View and track your photography bookings
                    </p>
                </div>

                {/* ================= NO BOOKINGS ================= */}

                {bookings.length === 0 ? (
                    <div className="text-center py-5">

                        <div className="mb-3">
                            <span
                                style={{
                                    fontSize: "60px",
                                }}
                            >
                                📸
                            </span>
                        </div>

                        <h4>No Bookings Yet</h4>

                        <p className="text-muted">
                            You haven't made any bookings yet.
                        </p>

                        <button
                            className="btn btn-dark"
                            onClick={() =>
                                navigate("/packages")
                            }
                        >
                            Explore Packages
                        </button>

                    </div>
                ) : (

                    /* ================= BOOKINGS ================= */

                    <div className="row g-4">

                        {bookings.map((booking) => {
                            const statusDetails =
                                getStatusDetails(
                                    booking.status
                                );

                            const currentStep =
                                getStatusStep(
                                    booking.status
                                );

                            return (
                                <div
                                    className="col-md-6 col-lg-4"
                                    key={booking._id}
                                >

                                    <div className="card h-100 border-0 shadow-sm">

                                        <div className="card-body p-4">

                                            {/* ================= TITLE ================= */}

                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-3">

                                                <h5 className="card-title fw-bold mb-0">
                                                    {booking.packageName ||
                                                        "Photography Booking"}
                                                </h5>

                                                <span
                                                    className={`badge ${statusDetails.className}`}
                                                >
                                                    {statusDetails.icon}{" "}
                                                    {booking.status}
                                                </span>

                                            </div>

                                            <hr />

                                            {/* ================= BOOKING DETAILS ================= */}

                                            <p className="mb-2">
                                                <strong>
                                                    Event:
                                                </strong>{" "}
                                                {booking.eventType}
                                            </p>

                                            <p className="mb-2">
                                                <strong>
                                                    Date:
                                                </strong>{" "}
                                                {formatDate(
                                                    booking.eventDate
                                                )}
                                            </p>

                                            <p className="mb-2">
                                                <strong>
                                                    Location:
                                                </strong>{" "}
                                                {booking.location}
                                            </p>

                                            {booking.packagePrice >
                                                0 && (
                                                <p className="mb-2">
                                                    <strong>
                                                        Package Price:
                                                    </strong>{" "}
                                                    ₹
                                                    {Number(
                                                        booking.packagePrice
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>
                                            )}

                                            {booking.message && (
                                                <p className="mb-3">
                                                    <strong>
                                                        Message:
                                                    </strong>{" "}
                                                    {booking.message}
                                                </p>
                                            )}

                                            {/* ================= STATUS TRACKER ================= */}

                                            {booking.status !==
                                                "Cancelled" && (
                                                <div className="mt-4">

                                                    <small className="fw-semibold">
                                                        Booking Status
                                                    </small>

                                                    <div className="mt-3">

                                                        {/* Pending */}

                                                        <div className="d-flex align-items-center">

                                                            <div
                                                                className={`rounded-circle d-flex align-items-center justify-content-center ${
                                                                    currentStep >=
                                                                    1
                                                                        ? "bg-warning text-dark"
                                                                        : "bg-light text-muted"
                                                                }`}
                                                                style={{
                                                                    width: "32px",
                                                                    height: "32px",
                                                                    minWidth: "32px",
                                                                }}
                                                            >
                                                                1
                                                            </div>

                                                            <span
                                                                className={`ms-2 small ${
                                                                    currentStep >=
                                                                    1
                                                                        ? "fw-semibold"
                                                                        : "text-muted"
                                                                }`}
                                                            >
                                                                Pending
                                                            </span>

                                                        </div>

                                                        {/* Connector */}

                                                        <div
                                                            style={{
                                                                width: "2px",
                                                                height: "20px",
                                                                marginLeft:
                                                                    "15px",
                                                                background:
                                                                    currentStep >=
                                                                    2
                                                                        ? "#198754"
                                                                        : "#dee2e6",
                                                            }}
                                                        />

                                                        {/* Confirmed */}

                                                        <div className="d-flex align-items-center">

                                                            <div
                                                                className={`rounded-circle d-flex align-items-center justify-content-center ${
                                                                    currentStep >=
                                                                    2
                                                                        ? "bg-success text-white"
                                                                        : "bg-light text-muted"
                                                                }`}
                                                                style={{
                                                                    width: "32px",
                                                                    height: "32px",
                                                                    minWidth: "32px",
                                                                }}
                                                            >
                                                                2
                                                            </div>

                                                            <span
                                                                className={`ms-2 small ${
                                                                    currentStep >=
                                                                    2
                                                                        ? "fw-semibold"
                                                                        : "text-muted"
                                                                }`}
                                                            >
                                                                Confirmed
                                                            </span>

                                                        </div>

                                                        {/* Connector */}

                                                        <div
                                                            style={{
                                                                width: "2px",
                                                                height: "20px",
                                                                marginLeft:
                                                                    "15px",
                                                                background:
                                                                    currentStep >=
                                                                    3
                                                                        ? "#0d6efd"
                                                                        : "#dee2e6",
                                                            }}
                                                        />

                                                        {/* Completed */}

                                                        <div className="d-flex align-items-center">

                                                            <div
                                                                className={`rounded-circle d-flex align-items-center justify-content-center ${
                                                                    currentStep >=
                                                                    3
                                                                        ? "bg-primary text-white"
                                                                        : "bg-light text-muted"
                                                                }`}
                                                                style={{
                                                                    width: "32px",
                                                                    height: "32px",
                                                                    minWidth: "32px",
                                                                }}
                                                            >
                                                                3
                                                            </div>

                                                            <span
                                                                className={`ms-2 small ${
                                                                    currentStep >=
                                                                    3
                                                                        ? "fw-semibold"
                                                                        : "text-muted"
                                                                }`}
                                                            >
                                                                Completed
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>
                                            )}

                                            {/* ================= CANCELLED ================= */}

                                            {booking.status ===
                                                "Cancelled" && (
                                                <div className="alert alert-danger mt-4 mb-0 py-2">

                                                    <strong>
                                                        ✕ Booking Cancelled
                                                    </strong>

                                                    <div className="small mt-1">
                                                        This booking has
                                                        been cancelled.
                                                    </div>

                                                </div>
                                            )}

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </section>
    );
}

export default MyBookings;
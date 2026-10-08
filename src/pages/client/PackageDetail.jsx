import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, resolveImageUrl } from "../../services/api";

function PackageDetail() {
    const { packageId } = useParams();
    const navigate = useNavigate();

    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH PACKAGE =================

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/packages/${packageId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch package"
                    );
                }

                if (data.success) {
                    setPkg(data.package);
                } else {
                    setError(
                        data.message ||
                            "Package not found"
                    );
                }
            } catch (error) {
                console.error(
                    "Package detail error:",
                    error
                );

                setError(
                    error.message ||
                        "Unable to load package"
                );
            } finally {
                setLoading(false);
            }
        };

        if (packageId) {
            fetchPackage();
        }
    }, [packageId]);

    // ================= LOADING =================

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
                        Loading package details...
                    </p>

                </div>
            </section>
        );
    }

    // ================= ERROR =================

    if (error || !pkg) {
        return (
            <section className="py-5">
                <div className="container">

                    <div className="alert alert-danger text-center">
                        {error ||
                            "Package not found"}
                    </div>

                    <div className="text-center">

                        <button
                            className="btn btn-dark"
                            onClick={() =>
                                navigate("/packages")
                            }
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Packages
                        </button>

                    </div>

                </div>
            </section>
        );
    }

    // ================= RENDER =================

    return (
        <section className="py-5">
            <div className="container">

                {/* BACK BUTTON */}

                <button
                    type="button"
                    className="btn btn-outline-dark mb-4"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back
                </button>

                {/* PACKAGE CARD */}

                <div className="card shadow-sm border-0 overflow-hidden">

                    <div className="row g-0">

                        {/* ================= IMAGE ================= */}

                        <div className="col-lg-6">

                            {(pkg.imageUrl || pkg.image) ? (
                                <img
                                    src={resolveImageUrl(
                                        pkg.imageUrl || pkg.image
                                    )}
                                    alt={pkg.name}
                                    className="img-fluid w-100 h-100"
                                    style={{
                                        minHeight:
                                            "450px",
                                        maxHeight:
                                            "600px",
                                        objectFit:
                                            "cover",
                                    }}
                                />
                            ) : (
                                <div
                                    className="d-flex align-items-center justify-content-center bg-light"
                                    style={{
                                        minHeight:
                                            "450px",
                                    }}
                                >
                                    <div className="text-center text-muted">
                                        <i
                                            className="bi bi-camera"
                                            style={{
                                                fontSize:
                                                    "60px",
                                            }}
                                        ></i>

                                        <p className="mt-3">
                                            No Image Available
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* ================= DETAILS ================= */}

                        <div className="col-lg-6">

                            <div className="card-body p-4 p-lg-5">

                                {/* CATEGORY */}

                                {pkg.category && (
                                    <span className="badge bg-secondary mb-3">
                                        {pkg.category}
                                    </span>
                                )}

                                {/* NAME */}

                                <h1 className="fw-bold mb-3">
                                    {pkg.name}
                                </h1>

                                {/* DESCRIPTION */}

                                {pkg.description && (
                                    <p className="text-muted mb-4">
                                        {pkg.description}
                                    </p>
                                )}

                                {/* PRICE */}

                                <div className="mb-4">

                                    <small className="text-muted d-block">
                                        Package Price
                                    </small>

                                    <h2 className="fw-bold mb-0">
                                        ₹
                                        {Number(
                                            pkg.price || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </h2>

                                </div>

                                {/* DELIVERY */}

                                {pkg.delivery && (
                                    <div className="d-flex align-items-center mb-4">

                                        <i className="bi bi-clock-fill me-2"></i>

                                        <div>
                                            <small className="text-muted d-block">
                                                Album Delivery
                                            </small>

                                            <strong>
                                                {pkg.delivery}
                                            </strong>
                                        </div>

                                    </div>
                                )}

                                {/* HIGHLIGHTS */}

                                {pkg.highlights &&
                                    pkg.highlights.length >
                                        0 && (
                                        <div className="mb-4">

                                            <h5 className="fw-bold mb-3">
                                                Package Includes
                                            </h5>

                                            <ul className="list-group list-group-flush">

                                                {pkg.highlights.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <li
                                                            key={
                                                                index
                                                            }
                                                            className="list-group-item px-0"
                                                        >
                                                            <i className="bi bi-check-circle-fill text-success me-2"></i>

                                                            {item}
                                                        </li>
                                                    )
                                                )}

                                            </ul>

                                        </div>
                                    )}

                                {/* BOOKING BUTTON */}

                                <button
                                    type="button"
                                    className="btn btn-dark btn-lg w-100 mb-3"
                                    onClick={() =>
                                        navigate(
                                            `/booking?packageId=${pkg.packageId || pkg._id}`
                                        )
                                    }
                                >
                                    <i className="bi bi-calendar-check me-2"></i>
                                    Book This Package
                                </button>

                                {/* BACK TO PACKAGES */}

                                <button
                                    type="button"
                                    className="btn btn-outline-dark w-100"
                                    onClick={() =>
                                        navigate(
                                            "/packages"
                                        )
                                    }
                                >
                                    View All Packages
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default PackageDetail;
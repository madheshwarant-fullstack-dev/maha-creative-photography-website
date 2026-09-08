import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

const API_URL = "http://localhost:5000";

function PackageDetail() {
    const { packageId } = useParams();
    const navigate = useNavigate();

    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [error, setError] = useState("");

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";

        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {
            return imagePath;
        }

        if (imagePath.startsWith("/")) {
            return `${API_URL}${imagePath}`;
        }

        return `${API_URL}/${imagePath}`;
    };

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                setLoading(true);
                setError("");
                setImageLoaded(false);
                setImageError(false);

                const response = await fetch(
                    `${API_URL}/api/packages/${packageId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Package not found"
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
                    "Fetch package error:",
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

        fetchPackage();
    }, [packageId]);

    const handleBooking = () => {
        navigate(
            `/booking?packageId=${pkg.packageId}`
        );
    };

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString(
            "en-IN"
        );
    };

    if (loading) {
        return (
            <section className="py-5">
                <div className="container">

                    <div
                        className="text-center py-5"
                    >
                        <div
                            className="spinner-border"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="text-muted mt-3">
                            Loading package...
                        </p>
                    </div>

                </div>
            </section>
        );
    }

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
                                navigate(
                                    "/packages"
                                )
                            }
                        >
                            Back to Packages
                        </button>
                    </div>

                </div>
            </section>
        );
    }

    const imageUrl = getImageUrl(pkg.image);

    return (
        <section className="py-5">
            <div className="container">

                {/* BACK BUTTON */}
                <button
                    className="btn btn-outline-dark mb-4"
                    onClick={() =>
                        navigate("/packages")
                    }
                >
                    ← Back to Packages
                </button>

                <div className="row g-5 align-items-start">

                    {/* IMAGE */}
                    <div className="col-lg-6">

                        <div
                            style={{
                                width: "100%",
                                height: "420px",
                                overflow: "hidden",
                                borderRadius: "12px",
                                backgroundColor:
                                    "#f5f5f5",
                                position: "relative",
                            }}
                        >

                            {/* IMAGE LOADING */}
                            {!imageLoaded &&
                                !imageError &&
                                imageUrl && (
                                    <div
                                        style={{
                                            position:
                                                "absolute",
                                            inset: 0,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            backgroundColor:
                                                "#f5f5f5",
                                            zIndex: 1,
                                        }}
                                    >
                                        <div
                                            className="spinner-border"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>
                                    </div>
                                )}

                            {/* IMAGE */}
                            {imageUrl &&
                                !imageError && (
                                    <img
                                        src={imageUrl}
                                        alt={pkg.name}
                                        onLoad={() =>
                                            setImageLoaded(
                                                true
                                            )
                                        }
                                        onError={() =>
                                            setImageError(
                                                true
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                            height: "420px",
                                            objectFit:
                                                "cover",
                                            objectPosition:
                                                "center",
                                            display:
                                                "block",
                                            opacity:
                                                imageLoaded
                                                    ? 1
                                                    : 0,
                                            transition:
                                                "opacity 0.3s ease",
                                        }}
                                    />
                                )}

                            {/* NO IMAGE */}
                            {(!imageUrl ||
                                imageError) && (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "420px",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        color: "#999",
                                    }}
                                >
                                    No Image Available
                                </div>
                            )}

                        </div>

                    </div>

                    {/* DETAILS */}
                    <div className="col-lg-6">

                        <span className="badge bg-dark mb-3">
                            {pkg.category}
                        </span>

                        <h1 className="fw-bold mb-3">
                            {pkg.name}
                        </h1>

                        <h2 className="fw-bold mb-3">
                            ₹
                            {formatPrice(
                                pkg.price
                            )}
                        </h2>

                        <p className="text-muted mb-4">
                            <strong>
                                Album Delivery:
                            </strong>{" "}
                            {pkg.delivery}
                        </p>

                        {pkg.description && (
                            <div className="mb-4">
                                <h5 className="fw-bold">
                                    About This Package
                                </h5>

                                <p className="text-muted">
                                    {
                                        pkg.description
                                    }
                                </p>
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

                                    <ul className="list-group">
                                        {pkg.highlights.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <li
                                                    key={
                                                        index
                                                    }
                                                    className="list-group-item"
                                                >
                                                    ✓{" "}
                                                    {
                                                        item
                                                    }
                                                </li>
                                            )
                                        )}
                                    </ul>

                                </div>
                            )}

                        {/* BUTTONS */}
                        <div className="d-flex gap-3 flex-wrap">

                            <button
                                className="btn btn-dark px-4 py-2"
                                onClick={
                                    handleBooking
                                }
                            >
                                Book This Package
                            </button>

                            <button
                                className="btn btn-outline-dark px-4 py-2"
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
        </section>
    );
}

export default PackageDetail;
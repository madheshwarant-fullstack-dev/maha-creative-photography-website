import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function PackageImage({ image, alt }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

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

    const imageUrl = getImageUrl(image);

    if (!imageUrl || error) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "240px",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                }}
            >
                No Image
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                height: "240px",
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
                position: "relative",
            }}
        >
            {!loaded && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
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

            <img
                src={imageUrl}
                alt={alt}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
            />
        </div>
    );
}

function Packages() {
    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/packages`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch packages"
                    );
                }

                if (data.success) {
                    setPackages(data.packages || []);
                } else {
                    setError(
                        data.message ||
                            "Unable to load packages"
                    );
                }
            } catch (error) {
                console.error(
                    "Fetch packages error:",
                    error
                );

                setError(
                    "Unable to load packages. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString(
            "en-IN"
        );
    };

    return (
        <section className="py-5">
            <div className="container">

                {/* HEADER */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold">
                        Our Packages
                    </h2>

                    <p className="text-muted">
                        Choose the perfect photography
                        package for your special moments.
                    </p>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="row g-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                className="col-md-6 col-lg-4"
                                key={item}
                            >
                                <div className="card h-100 shadow-sm">

                                    <div
                                        style={{
                                            width: "100%",
                                            height: "240px",
                                            background:
                                                "#f1f1f1",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
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

                                    <div className="card-body">
                                        <div
                                            className="placeholder-glow"
                                        >
                                            <span className="placeholder col-8"></span>
                                            <br />
                                            <span className="placeholder col-5"></span>
                                            <br />
                                            <span className="placeholder col-10"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                )}

                {/* EMPTY */}
                {!loading &&
                    !error &&
                    packages.length === 0 && (
                        <div className="alert alert-info text-center">
                            No packages available.
                        </div>
                    )}

                {/* PACKAGES */}
                {!loading &&
                    !error &&
                    packages.length > 0 && (
                        <div className="row g-4">

                            {packages.map((pkg) => (
                                <div
                                    className="col-md-6 col-lg-4"
                                    key={pkg._id}
                                >
                                    <div
                                        className="card h-100 shadow-sm border-0"
                                        style={{
                                            overflow: "hidden",
                                        }}
                                    >

                                        {/* IMAGE */}
                                        <PackageImage
                                            image={pkg.image}
                                            alt={pkg.name}
                                        />

                                        {/* CONTENT */}
                                        <div className="card-body p-4">

                                            <span className="badge bg-dark mb-2">
                                                {pkg.category}
                                            </span>

                                            <h4 className="fw-bold mb-2">
                                                {pkg.name}
                                            </h4>

                                            <h3 className="fw-bold mb-2">
                                                ₹
                                                {formatPrice(
                                                    pkg.price
                                                )}
                                            </h3>

                                            <p className="text-muted mb-3">
                                                <strong>
                                                    Delivery:
                                                </strong>{" "}
                                                {pkg.delivery}
                                            </p>

                                            {pkg.description && (
                                                <p className="text-muted">
                                                    {
                                                        pkg.description
                                                    }
                                                </p>
                                            )}

                                            {pkg.highlights &&
                                                pkg.highlights
                                                    .length >
                                                    0 && (
                                                    <ul className="ps-3 mb-0">
                                                        {pkg.highlights
                                                            .slice(
                                                                0,
                                                                5
                                                            )
                                                            .map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="mb-1"
                                                                    >
                                                                        {
                                                                            item
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                )}
                                        </div>

                                        {/* BUTTON */}
                                        <div className="card-footer bg-white border-0 p-4 pt-0">

                                            <button
                                                className="btn btn-dark w-100"
                                                onClick={() =>
                                                    navigate(
                                                        `/package/${pkg.packageId}`
                                                    )
                                                }
                                            >
                                                View Package
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
            </div>
        </section>
    );
}

export default Packages;
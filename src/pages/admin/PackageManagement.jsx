import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function PackageManagement() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        packageId: "",
        name: "",
        category: "AFFORDABLE",
        delivery: "",
        price: "",
        image: "",
        description: "",
        highlights: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // IMPORTANT:
    // Store packageId, NOT MongoDB _id
    const [editingId, setEditingId] = useState(null);

    // ================= FETCH PACKAGES =================

    const fetchPackages = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/packages`
            );

            const data = await response.json();

            if (data.success) {
                setPackages(data.packages || []);
            }
        } catch (error) {
            console.error(
                "Fetch packages error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= LOAD PACKAGES =================

    useEffect(() => {
        fetchPackages();
    }, []);

    // ================= HANDLE INPUT =================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ================= HANDLE IMAGE =================

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setImageFile(null);
            setImagePreview("");
            return;
        }

        setImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    // ================= ADD / UPDATE =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Admin login required.");
                return;
            }

            // ================= VALIDATION =================

            if (
                !form.packageId ||
                !form.name ||
                !form.category ||
                !form.delivery ||
                form.price === ""
            ) {
                alert(
                    "Please fill all required fields."
                );
                return;
            }

            const formData = new FormData();

            // ================= BASIC DATA =================

            formData.append(
                "packageId",
                form.packageId
            );

            formData.append(
                "name",
                form.name
            );

            formData.append(
                "category",
                form.category
            );

            formData.append(
                "delivery",
                form.delivery
            );

            formData.append(
                "price",
                Number(form.price)
            );

            formData.append(
                "description",
                form.description
            );

            // Backend currently accepts comma separated
            // highlights, so convert each line to comma.
            const formattedHighlights =
                form.highlights
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .join(",");

            formData.append(
                "highlights",
                formattedHighlights
            );

            // ================= NEW IMAGE =================

            // IMPORTANT:
            // Only send image when a NEW file is selected.
            // Existing image is already stored in MongoDB.
            if (imageFile) {
                formData.append(
                    "image",
                    imageFile
                );
            }

            let response;

            // ================= UPDATE =================

            if (editingId) {
                response = await fetch(
                    `${API_URL}/api/packages/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
            }

            // ================= ADD =================

            else {
                response = await fetch(
                    `${API_URL}/api/packages`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
            }

            const data = await response.json();

            // ================= ERROR =================

            if (!response.ok) {
                alert(
                    data.message ||
                        "Something went wrong"
                );
                return;
            }

            // ================= SUCCESS =================

            alert(
                editingId
                    ? "Package updated successfully!"
                    : "Package added successfully!"
            );

            resetForm();

            await fetchPackages();
        } catch (error) {
            console.error(
                "Save package error:",
                error
            );

            alert("Server error");
        }
    };

    // ================= EDIT PACKAGE =================

    const handleEdit = (pkg) => {
        // IMPORTANT:
        // Backend uses packageId, not MongoDB _id
        setEditingId(pkg.packageId);

        setForm({
            packageId: pkg.packageId || "",
            name: pkg.name || "",
            category:
                pkg.category || "AFFORDABLE",
            delivery: pkg.delivery || "",
            price: pkg.price || "",
            image: pkg.image || "",
            description:
                pkg.description || "",
            highlights:
                Array.isArray(pkg.highlights)
                    ? pkg.highlights.join("\n")
                    : "",
        });

        setImageFile(null);
        setImagePreview("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ================= DELETE PACKAGE =================

    const handleDelete = async (packageId) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this package?"
            );

        if (!confirmDelete) return;

        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Admin login required.");
                return;
            }

            // IMPORTANT:
            // Backend expects packageId
            const response = await fetch(
                `${API_URL}/api/packages/${packageId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Delete failed"
                );
                return;
            }

            alert(
                "Package deleted successfully!"
            );

            await fetchPackages();
        } catch (error) {
            console.error(
                "Delete package error:",
                error
            );

            alert("Server error");
        }
    };

    // ================= RESET FORM =================

    const resetForm = () => {
        setEditingId(null);

        setForm({
            packageId: "",
            name: "",
            category: "AFFORDABLE",
            delivery: "",
            price: "",
            image: "",
            description: "",
            highlights: "",
        });

        setImageFile(null);
        setImagePreview("");

        const fileInput =
            document.getElementById(
                "packageImage"
            );

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // ================= IMAGE URL =================

    const getImageUrl = (image) => {
        if (!image) return "";

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return `${API_URL}${image}`;
        }

        return `${API_URL}/${image}`;
    };

    // ================= RENDER =================

    return (
        <div className="container py-5">

            {/* ================= HEADER ================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold">
                        Package Management
                    </h2>

                    <p className="text-muted mb-0">
                        Add, edit and manage
                        photography packages
                    </p>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={resetForm}
                >
                    Clear Form
                </button>

            </div>

            {/* ================= FORM ================= */}

            <div className="card shadow-sm mb-5">

                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                        {editingId
                            ? "Edit Package"
                            : "Add New Package"}
                    </h4>

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            {/* ================= PACKAGE ID ================= */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Package ID
                                </label>

                                <input
                                    type="text"
                                    name="packageId"
                                    className="form-control"
                                    placeholder="package-mini"
                                    value={
                                        form.packageId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={
                                        !!editingId
                                    }
                                />

                                {editingId && (
                                    <small className="text-muted">
                                        Package ID cannot
                                        be changed while
                                        editing.
                                    </small>
                                )}

                            </div>

                            {/* ================= PACKAGE NAME ================= */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Package Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Package Mini"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* ================= CATEGORY ================= */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    className="form-select"
                                    value={
                                        form.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="AFFORDABLE">
                                        AFFORDABLE
                                    </option>

                                    <option value="GRAND">
                                        GRAND
                                    </option>
                                </select>

                            </div>

                            {/* ================= DELIVERY ================= */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Delivery
                                </label>

                                <input
                                    type="text"
                                    name="delivery"
                                    className="form-control"
                                    placeholder="90 Days (Album Delivery)"
                                    value={
                                        form.delivery
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* ================= PRICE ================= */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    className="form-control"
                                    placeholder="45000"
                                    value={
                                        form.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* ================= IMAGE ================= */}

                            <div className="col-12">

                                <label
                                    className="form-label"
                                    htmlFor="packageImage"
                                >
                                    Package Image
                                </label>

                                <input
                                    id="packageImage"
                                    type="file"
                                    name="image"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                />

                                <small className="text-muted">
                                    {editingId
                                        ? "Select a new image only if you want to replace the existing image."
                                        : "Select a package image."}
                                </small>

                            </div>

                            {/* ================= IMAGE PREVIEW ================= */}

                            {(imagePreview ||
                                form.image) && (

                                <div className="col-12">

                                    <label className="form-label">
                                        Image Preview
                                    </label>

                                    <div>

                                        <img
                                            src={
                                                imagePreview ||
                                                getImageUrl(
                                                    form.image
                                                )
                                            }
                                            alt="Package Preview"
                                            style={{
                                                width: "220px",
                                                height: "140px",
                                                objectFit:
                                                    "cover",
                                                borderRadius:
                                                    "8px",
                                                border:
                                                    "1px solid #ddd",
                                            }}
                                        />

                                    </div>

                                </div>
                            )}

                            {/* ================= DESCRIPTION ================= */}

                            <div className="col-12">

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Capture Moments, Create Memories"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            {/* ================= HIGHLIGHTS ================= */}

                            <div className="col-12">

                                <label className="form-label">
                                    Highlights
                                </label>

                                <textarea
                                    name="highlights"
                                    className="form-control"
                                    rows="7"
                                    placeholder={`Unlimited Photos
Candid Photography
Traditional Videography
36x12 Album
Calendar`}
                                    value={
                                        form.highlights
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <small className="text-muted">
                                    Enter one highlight
                                    per line.
                                </small>

                            </div>

                        </div>

                        {/* ================= BUTTONS ================= */}

                        <div className="mt-4">

                            <button
                                type="submit"
                                className="btn btn-dark me-2"
                            >
                                {editingId
                                    ? "Update Package"
                                    : "Add Package"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={
                                        resetForm
                                    }
                                >
                                    Cancel Edit
                                </button>
                            )}

                        </div>

                    </form>

                </div>
            </div>

            {/* ================= EXISTING PACKAGES ================= */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h4 className="fw-bold mb-0">
                    Existing Packages
                </h4>

                <span className="badge bg-dark">
                    {packages.length} Packages
                </span>

            </div>

            {/* ================= LOADING ================= */}

            {loading ? (

                <div className="text-center py-5">

                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-3 text-muted">
                        Loading packages...
                    </p>

                </div>

            ) : packages.length === 0 ? (

                <div className="alert alert-info">
                    No packages found.
                </div>

            ) : (

                /* ================= PACKAGE CARDS ================= */

                <div className="row g-4">

                    {packages.map((pkg) => (

                        <div
                            className="col-md-6 col-lg-4"
                            key={pkg._id}
                        >

                            <div className="card h-100 shadow-sm">

                                {/* ================= IMAGE ================= */}

                                {pkg.image ? (
                                    <img
                                        src={getImageUrl(
                                            pkg.image
                                        )}
                                        className="card-img-top"
                                        alt={pkg.name}
                                        style={{
                                            height: "220px",
                                            objectFit:
                                                "cover",
                                        }}
                                        onError={(
                                            e
                                        ) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            height: "220px",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            background:
                                                "#f5f5f5",
                                            color: "#999",
                                        }}
                                    >
                                        No Image
                                    </div>
                                )}

                                {/* ================= BODY ================= */}

                                <div className="card-body">

                                    <span className="badge bg-secondary mb-2">
                                        {
                                            pkg.category
                                        }
                                    </span>

                                    <h5 className="fw-bold">
                                        {pkg.name}
                                    </h5>

                                    <h4 className="fw-bold">
                                        ₹
                                        {Number(
                                            pkg.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </h4>

                                    <p className="text-muted mb-2">
                                        {
                                            pkg.delivery
                                        }
                                    </p>

                                    {pkg.description && (
                                        <p className="small">
                                            {
                                                pkg.description
                                            }
                                        </p>
                                    )}

                                    {/* HIGHLIGHTS */}

                                    {pkg.highlights &&
                                        pkg.highlights
                                            .length >
                                            0 && (
                                            <ul className="small ps-3">

                                                {pkg.highlights.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <li
                                                            key={
                                                                index
                                                            }
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

                                {/* ================= ACTIONS ================= */}

                                <div className="card-footer bg-white border-0 d-flex gap-2">

                                    <button
                                        className="btn btn-outline-dark btn-sm"
                                        onClick={() =>
                                            handleEdit(
                                                pkg
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() =>
                                            handleDelete(
                                                pkg.packageId
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default PackageManagement;
import React, { useEffect, useState } from "react";
import { API_URL, resolveImageUrl } from "../../services/api";

function PackageManagement() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    const [form, setForm] = useState({
        packageId: "",
        name: "",
        category: "AFFORDABLE",
        delivery: "",
        price: "",
        image: "",
        imageUrl: "",
        description: "",
        highlights: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");

    // Backend uses packageId slug for identifying packages
    const [editingId, setEditingId] = useState(null);

    const showMessage = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => {
            setStatusMessage({ type: "", text: "" });
        }, 5000);
    };

    // ================= FETCH PACKAGES =================
    const fetchPackages = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/packages`);
            const data = await response.json();

            if (data.success) {
                setPackages(data.packages || []);
            } else {
                showMessage("danger", data.message || "Failed to load packages");
            }
        } catch (error) {
            console.error("Fetch packages error:", error);
            showMessage("danger", "Unable to connect to server to fetch packages.");
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
            setImagePreview(existingImageUrl ? resolveImageUrl(existingImageUrl) : "");
            return;
        }

        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    // ================= ADD / UPDATE =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            showMessage("danger", "Admin login required. Please sign in.");
            return;
        }

        // ================= VALIDATION =================
        if (
            !form.packageId.trim() ||
            !form.name.trim() ||
            !form.category.trim() ||
            !form.delivery.trim() ||
            form.price === ""
        ) {
            showMessage("warning", "Please fill in all required package fields.");
            return;
        }

        setSubmitting(true);
        setStatusMessage({ type: "", text: "" });

        try {
            const formData = new FormData();

            formData.append("packageId", form.packageId.trim());
            formData.append("name", form.name.trim());
            formData.append("category", form.category.trim());
            formData.append("delivery", form.delivery.trim());
            formData.append("price", Number(form.price));
            formData.append("description", form.description.trim());

            // Convert newline-separated highlights to comma-separated
            const formattedHighlights = form.highlights
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
                .join(",");

            formData.append("highlights", formattedHighlights);

            // IMPORTANT: Only send image when a NEW file is selected.
            // If editing without selecting a file, existing image remains untouched in Cloudinary & MongoDB.
            if (imageFile) {
                formData.append("image", imageFile);
            }

            let response;

            if (editingId) {
                // ================= UPDATE =================
                response = await fetch(`${API_URL}/api/packages/${editingId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
            } else {
                // ================= ADD =================
                response = await fetch(`${API_URL}/api/packages`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
            }

            const data = await response.json();

            if (!response.ok) {
                showMessage("danger", data.message || "Failed to save package.");
                return;
            }

            showMessage(
                "success",
                editingId
                    ? "Package updated successfully in permanent cloud storage!"
                    : "Package added successfully!"
            );

            resetForm();
            await fetchPackages();
        } catch (error) {
            console.error("Save package error:", error);
            showMessage("danger", "Server connection error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // ================= EDIT PACKAGE =================
    const handleEdit = (pkg) => {
        setEditingId(pkg.packageId);

        const currentImg = pkg.imageUrl || pkg.image || "";

        setForm({
            packageId: pkg.packageId || "",
            name: pkg.name || "",
            category: pkg.category || "AFFORDABLE",
            delivery: pkg.delivery || "",
            price: pkg.price !== undefined ? pkg.price : "",
            image: currentImg,
            imageUrl: currentImg,
            description: pkg.description || "",
            highlights: Array.isArray(pkg.highlights)
                ? pkg.highlights.join("\n")
                : (Array.isArray(pkg.features) ? pkg.features.join("\n") : ""),
        });

        setImageFile(null);
        setExistingImageUrl(currentImg);
        setImagePreview(currentImg ? resolveImageUrl(currentImg) : "");

        const fileInput = document.getElementById("packageImage");
        if (fileInput) {
            fileInput.value = "";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ================= DELETE PACKAGE =================
    const handleDelete = async (packageId, name) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to permanently delete package "${name || packageId}"? Associated Cloudinary images will also be removed.`
        );

        if (!confirmDelete) return;

        setDeletingId(packageId);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showMessage("danger", "Admin authorization required.");
                setDeletingId(null);
                return;
            }

            const response = await fetch(`${API_URL}/api/packages/${packageId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage("danger", data.message || "Failed to delete package.");
                return;
            }

            showMessage("success", "Package deleted successfully!");
            await fetchPackages();
        } catch (error) {
            console.error("Delete package error:", error);
            showMessage("danger", "Unable to connect to server to delete package.");
        } finally {
            setDeletingId(null);
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
            imageUrl: "",
            description: "",
            highlights: "",
        });

        setImageFile(null);
        setImagePreview("");
        setExistingImageUrl("");

        const fileInput = document.getElementById("packageImage");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    // ================= RENDER =================
    return (
        <div className="container py-5">
            {/* ================= HEADER ================= */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">Package Management</h2>
                    <p className="text-muted mb-0">
                        Add, edit, replace and manage photography packages (Permanent Cloudinary Storage).
                    </p>
                </div>

                <button className="btn btn-secondary" onClick={resetForm}>
                    Clear Form
                </button>
            </div>

            {/* ================= NOTIFICATION ================= */}
            {statusMessage.text && (
                <div
                    className={`alert alert-${statusMessage.type} alert-dismissible fade show mb-4`}
                    role="alert"
                >
                    {statusMessage.text}
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setStatusMessage({ type: "", text: "" })}
                    ></button>
                </div>
            )}

            {/* ================= FORM ================= */}
            <div className="card shadow-sm mb-5 border-0">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0">
                            {editingId ? "Edit Package" : "Add New Package"}
                        </h4>
                        {editingId && (
                            <span className="badge bg-warning text-dark px-3 py-2">
                                Editing Package: {editingId}
                            </span>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {/* Package ID */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Package ID <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="packageId"
                                    className="form-control"
                                    placeholder="package-mini"
                                    value={form.packageId}
                                    onChange={handleChange}
                                    required
                                    disabled={!!editingId || submitting}
                                />
                                {editingId && (
                                    <small className="text-muted">
                                        Package ID cannot be modified after creation.
                                    </small>
                                )}
                            </div>

                            {/* Package Name */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Package Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Package Mini"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            {/* Category */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    Category <span className="text-danger">*</span>
                                </label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={form.category}
                                    onChange={handleChange}
                                    disabled={submitting}
                                >
                                    <option value="AFFORDABLE">AFFORDABLE</option>
                                    <option value="GRAND">GRAND</option>
                                </select>
                            </div>

                            {/* Delivery */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    Delivery <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="delivery"
                                    className="form-control"
                                    placeholder="65 Days Deliver"
                                    value={form.delivery}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            {/* Price */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">
                                    Price (₹) <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    className="form-control"
                                    placeholder="45000"
                                    value={form.price}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            {/* Package Image File */}
                            <div className="col-12">
                                <label className="form-label fw-semibold" htmlFor="packageImage">
                                    {editingId ? "Replace Package Image (Optional)" : "Package Image"}
                                </label>
                                <input
                                    id="packageImage"
                                    type="file"
                                    name="image"
                                    className="form-control"
                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                    onChange={handleImageChange}
                                    disabled={submitting}
                                />
                                <small className="text-muted d-block mt-1">
                                    {editingId
                                        ? "Leave empty to keep the existing permanent image intact. Select a new file only if you wish to replace it."
                                        : "Select a banner image for this photography package."}
                                </small>
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="col-12">
                                    <label className="form-label fw-semibold">
                                        {imageFile
                                            ? "New Image Preview (Will be uploaded)"
                                            : "Current Saved Image (Will be preserved)"}
                                    </label>
                                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded border">
                                        <img
                                            src={imagePreview}
                                            alt="Package Preview"
                                            style={{
                                                width: "220px",
                                                height: "140px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd",
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/images/hero.jpeg";
                                            }}
                                        />
                                        <div>
                                            <span
                                                className={`badge ${
                                                    imageFile ? "bg-success" : "bg-primary"
                                                } mb-2`}
                                            >
                                                {imageFile ? "New File Selected" : "Current Permanent Image"}
                                            </span>
                                            <p className="text-muted small mb-0">
                                                {imageFile
                                                    ? `Ready to upload: ${imageFile.name} (${(imageFile.size / 1024).toFixed(1)} KB)`
                                                    : "This package image is safely preserved on the cloud."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Description</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Capture Moments, Create Memories"
                                    value={form.description}
                                    onChange={handleChange}
                                    disabled={submitting}
                                />
                            </div>

                            {/* Highlights */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Highlights</label>
                                <textarea
                                    name="highlights"
                                    className="form-control"
                                    rows="5"
                                    placeholder={`Unlimited Photos\nCandid Photography\nTraditional Videography\n36x12 Album\nCalendar`}
                                    value={form.highlights}
                                    onChange={handleChange}
                                    disabled={submitting}
                                />
                                <small className="text-muted">Enter one highlight per line.</small>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 d-flex align-items-center gap-2">
                            <button
                                type="submit"
                                className="btn btn-dark d-flex align-items-center gap-2"
                                disabled={submitting}
                            >
                                {submitting && (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                )}
                                {submitting
                                    ? "Uploading & Saving..."
                                    : editingId
                                    ? "Update Package"
                                    : "Add Package"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={resetForm}
                                    disabled={submitting}
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
                <h4 className="fw-bold mb-0">Existing Packages</h4>
                <span className="badge bg-dark px-3 py-2">{packages.length} Packages</span>
            </div>

            {/* ================= LOADING ================= */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading packages...</p>
                </div>
            ) : packages.length === 0 ? (
                <div className="alert alert-info">No packages found.</div>
            ) : (
                /* ================= PACKAGE CARDS ================= */
                <div className="row g-4">
                    {packages.map((pkg) => {
                        const imgUrl = resolveImageUrl(pkg.imageUrl || pkg.image);

                        return (
                            <div className="col-md-6 col-lg-4" key={pkg._id}>
                                <div className="card h-100 shadow-sm border-0">
                                    {/* IMAGE */}
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            className="card-img-top"
                                            alt={pkg.name}
                                            style={{
                                                height: "220px",
                                                objectFit: "cover",
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/images/hero.jpeg";
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                height: "220px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#f5f5f5",
                                                color: "#999",
                                            }}
                                        >
                                            No Image Available
                                        </div>
                                    )}

                                    {/* BODY */}
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="badge bg-secondary">
                                                {pkg.category}
                                            </span>
                                            {pkg.publicId && (
                                                <span
                                                    className="badge bg-success-subtle text-success border border-success-subtle"
                                                    title="Stored permanently in Cloudinary"
                                                >
                                                    Cloud Permanent
                                                </span>
                                            )}
                                        </div>

                                        <h5 className="fw-bold">{pkg.name}</h5>

                                        <h4 className="fw-bold text-primary">
                                            ₹{Number(pkg.price || 0).toLocaleString("en-IN")}
                                        </h4>

                                        <p className="text-muted mb-2 small">
                                            <i className="bi bi-clock me-1"></i> {pkg.delivery}
                                        </p>

                                        {pkg.description && (
                                            <p className="small text-muted mb-3">{pkg.description}</p>
                                        )}

                                        {/* HIGHLIGHTS */}
                                        {pkg.highlights && pkg.highlights.length > 0 && (
                                            <ul className="small ps-3 text-muted">
                                                {pkg.highlights.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="card-footer bg-white border-0 d-flex gap-2">
                                        <button
                                            className="btn btn-outline-dark btn-sm"
                                            onClick={() => handleEdit(pkg)}
                                            disabled={submitting || deletingId === pkg.packageId}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                            onClick={() => handleDelete(pkg.packageId, pkg.name)}
                                            disabled={submitting || deletingId === pkg.packageId}
                                        >
                                            {deletingId === pkg.packageId && (
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            )}
                                            {deletingId === pkg.packageId ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default PackageManagement;
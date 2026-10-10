import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, resolveImageUrl, NEUTRAL_PLACEHOLDER_IMAGE } from "../../services/api";

const PRESET_CATEGORIES = [
    "Wedding",
    "Birthday",
    "Baby Shower",
    "Baby Shoot",
    "Engagement",
    "Pre Wedding",
    "Model Photography",
    "Portraits",
    "Events",
    "Outdoor",
];

function GalleryManagement() {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    const [form, setForm] = useState({
        title: "",
        category: "",
        customCategory: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [editingId, setEditingId] = useState(null);

    const showMessage = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => {
            setStatusMessage({ type: "", text: "" });
        }, 5000);
    };

    // ================= FETCH GALLERY =================
    const fetchGallery = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/gallery`, {
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.gallery)) {
                setGallery(data.gallery);
            } else {
                showMessage("danger", data.message || "Failed to load gallery images");
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Fetch gallery error:", error);
            const isTimeout = error.name === "AbortError";
            showMessage(
                "danger",
                isTimeout
                    ? "Connection timed out while fetching gallery. Backend may be waking up."
                    : "Unable to connect to server to fetch gallery."
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= LOAD GALLERY =================
    useEffect(() => {
        fetchGallery();
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
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            setImage(null);
            setPreview(existingImageUrl ? resolveImageUrl(existingImageUrl) : "");
            return;
        }

        setImage(selectedFile);
        const imageUrl = URL.createObjectURL(selectedFile);
        setPreview(imageUrl);
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalCategory =
            form.category === "CUSTOM"
                ? form.customCategory.trim()
                : form.category.trim();

        if (!form.title.trim() || !finalCategory) {
            showMessage("warning", "Please provide both a title and a valid category.");
            return;
        }

        if (!editingId && !image) {
            showMessage("warning", "Please select an image file to upload.");
            return;
        }

        setSubmitting(true);
        setStatusMessage({ type: "", text: "" });

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showMessage("danger", "Admin authorization token missing. Please log in again.");
                setSubmitting(false);
                return;
            }

            const formData = new FormData();
            formData.append("title", form.title.trim());
            formData.append("category", finalCategory);
            formData.append("description", form.description.trim());

            // Only append file if user actively selected a new one
            if (image) {
                formData.append("image", image);
            }

            let response;

            if (editingId) {
                // ================= UPDATE =================
                response = await fetch(`${API_URL}/api/gallery/${editingId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
            } else {
                // ================= ADD =================
                response = await fetch(`${API_URL}/api/gallery`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
            }

            const data = await response.json();

            if (!response.ok) {
                showMessage("danger", data.message || "Failed to save gallery item.");
                return;
            }

            showMessage(
                "success",
                editingId
                    ? "Gallery item updated successfully!"
                    : "New gallery image uploaded and published to portfolio successfully!"
            );

            resetForm();
            await fetchGallery();
        } catch (error) {
            console.error("Save gallery error:", error);
            showMessage("danger", "Network error: Unable to connect to server.");
        } finally {
            setSubmitting(false);
        }
    };

    // ================= EDIT =================
    const handleEdit = (item) => {
        setEditingId(item._id);

        const isKnownPreset = PRESET_CATEGORIES.includes(item.category);

        setForm({
            title: item.title || "",
            category: isKnownPreset ? item.category : "CUSTOM",
            customCategory: isKnownPreset ? "" : item.category || "",
            description: item.description || "",
        });

        setImage(null);

        const currentImg = item.imageUrl || item.image || "";
        setExistingImageUrl(currentImg);
        setPreview(currentImg ? resolveImageUrl(currentImg) : "");

        const fileInput = document.getElementById("galleryImage");
        if (fileInput) {
            fileInput.value = "";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ================= DELETE =================
    const handleDelete = async (id, title) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to permanently delete "${title || "this gallery photo"}"? This will remove the image from the portfolio and storage.`
        );

        if (!confirmDelete) return;

        setDeletingId(id);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showMessage("danger", "Admin authorization required. Please log in.");
                setDeletingId(null);
                return;
            }

            const response = await fetch(`${API_URL}/api/gallery/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage("danger", data.message || "Failed to delete gallery image.");
                return;
            }

            showMessage("success", "Gallery image permanently deleted from portfolio.");
            await fetchGallery();
        } catch (error) {
            console.error("Delete gallery error:", error);
            showMessage("danger", "Unable to connect to server to delete image.");
        } finally {
            setDeletingId(null);
        }
    };

    // ================= RESET FORM =================
    const resetForm = () => {
        setEditingId(null);
        setForm({
            title: "",
            category: "",
            customCategory: "",
            description: "",
        });
        setImage(null);
        setPreview("");
        setExistingImageUrl("");

        const fileInput = document.getElementById("galleryImage");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    // ================= RENDER =================
    return (
        <div className="container py-5">
            {/* ================= HEADER ================= */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Link to="/admin/dashboard" className="btn btn-sm btn-outline-dark">
                            <i className="bi bi-arrow-left me-1"></i> Dashboard
                        </Link>
                        <h2 className="fw-bold mb-0">Gallery Management</h2>
                    </div>
                    <p className="text-muted mb-0">
                        Upload, edit, and delete photography portfolio images. Only images added here will be shown in the client gallery.
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <Link to="/gallery" target="_blank" className="btn btn-outline-primary">
                        <i className="bi bi-box-arrow-up-right me-1"></i> View Live Gallery
                    </Link>
                    <button className="btn btn-secondary" onClick={resetForm}>
                        Clear Form
                    </button>
                </div>
            </div>

            {/* ================= STATUS NOTIFICATION ================= */}
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

            {/* ================= FORM CARD ================= */}
            <div className="card shadow-sm mb-5 border-0">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0">
                            {editingId ? "Edit Gallery Item" : "Add New Gallery Image"}
                        </h4>
                        {editingId && (
                            <span className="badge bg-warning text-dark px-3 py-2">
                                Editing Existing Item
                            </span>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {/* Title */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Photo Title <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="e.g. Royal Wedding Reception"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            {/* Category Select */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Category <span className="text-danger">*</span>
                                </label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                >
                                    <option value="">Select Category</option>
                                    {PRESET_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                    <option value="CUSTOM">+ Custom Category (Type your own)</option>
                                </select>
                            </div>

                            {/* Custom Category Input (shown when CUSTOM selected) */}
                            {form.category === "CUSTOM" && (
                                <div className="col-12">
                                    <label className="form-label fw-semibold">
                                        Custom Category Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="customCategory"
                                        className="form-control"
                                        placeholder="e.g. Traditional Rituals, Fine Art, Fashion"
                                        value={form.customCategory}
                                        onChange={handleChange}
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            )}

                            {/* Image Input */}
                            <div className="col-12">
                                <label className="form-label fw-semibold" htmlFor="galleryImage">
                                    {editingId ? "Replace Image (Optional)" : "Photo File"}
                                    {!editingId && <span className="text-danger"> *</span>}
                                </label>
                                <input
                                    id="galleryImage"
                                    type="file"
                                    className="form-control"
                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                    onChange={handleImageChange}
                                    disabled={submitting}
                                />
                                <small className="text-muted d-block mt-1">
                                    {editingId
                                        ? "Leave empty to keep current image intact. Select a new file if you want to replace it."
                                        : "Supported formats: JPG, JPEG, PNG, WEBP."}
                                </small>
                            </div>

                            {/* Image Preview Card */}
                            {preview && (
                                <div className="col-12">
                                    <label className="form-label fw-semibold">
                                        {image
                                            ? "New Image Preview (Will be uploaded)"
                                            : "Current Saved Image"}
                                    </label>
                                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded border">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                width: "180px",
                                                height: "120px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = NEUTRAL_PLACEHOLDER_IMAGE;
                                            }}
                                        />
                                        <div>
                                            <span
                                                className={`badge ${
                                                    image ? "bg-success" : "bg-primary"
                                                } mb-2`}
                                            >
                                                {image ? "New File Selected" : "Current Stored Image"}
                                            </span>
                                            <p className="text-muted small mb-0">
                                                {image
                                                    ? `Ready to upload: ${image.name} (${(image.size / 1024).toFixed(1)} KB)`
                                                    : "This photo is currently active in the database."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter caption or description for this photo..."
                                    value={form.description}
                                    onChange={handleChange}
                                    disabled={submitting}
                                />
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
                                    ? "Update Gallery Photo"
                                    : "Upload to Gallery"}
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

            {/* ================= EXISTING GALLERY ================= */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">Current Gallery Images</h4>
                <span className="badge bg-dark px-3 py-2">{gallery.length} Photos</span>
            </div>

            {loading ? (
                /* Loading State */
                <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading gallery photos...</p>
                </div>
            ) : gallery.length === 0 ? (
                /* Empty Gallery State */
                <div className="alert alert-info py-4 text-center">
                    <i className="bi bi-info-circle me-2 fs-5"></i>
                    <strong>No photos in gallery.</strong> Use the form above to upload images to display on your portfolio.
                </div>
            ) : (
                /* Gallery Grid */
                <div className="row g-4">
                    {gallery.map((item) => {
                        const imgUrl = resolveImageUrl(item.imageUrl || item.image);

                        return (
                            <div className="col-md-6 col-lg-4" key={item._id}>
                                <div className="card h-100 shadow-sm border-0">
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            className="card-img-top"
                                            alt={item.title}
                                            style={{
                                                height: "240px",
                                                objectFit: "cover",
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = NEUTRAL_PLACEHOLDER_IMAGE;
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="bg-light d-flex align-items-center justify-content-center text-muted"
                                            style={{ height: "240px" }}
                                        >
                                            No Image Available
                                        </div>
                                    )}

                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="badge bg-dark">{item.category}</span>
                                            {item.publicId && (
                                                <span
                                                    className="badge bg-success-subtle text-success border border-success-subtle"
                                                    title="Stored permanently in Cloudinary"
                                                >
                                                    Cloud
                                                </span>
                                            )}
                                        </div>

                                        <h5 className="fw-bold">{item.title}</h5>

                                        {item.description && (
                                            <p className="text-muted small mb-0">{item.description}</p>
                                        )}
                                    </div>

                                    <div className="card-footer bg-white border-0 d-flex gap-2">
                                        <button
                                            className="btn btn-outline-dark btn-sm"
                                            onClick={() => handleEdit(item)}
                                            disabled={submitting || deletingId === item._id}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                            onClick={() => handleDelete(item._id, item.title)}
                                            disabled={submitting || deletingId === item._id}
                                        >
                                            {deletingId === item._id && (
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            )}
                                            {deletingId === item._id ? "Deleting..." : "Delete"}
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

export default GalleryManagement;
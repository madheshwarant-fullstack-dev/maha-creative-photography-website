import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function GalleryManagement() {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [editingId, setEditingId] = useState(null);

    // ================= FETCH GALLERY =================

    const fetchGallery = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/gallery`
            );

            const data = await response.json();

            if (data.success) {
                setGallery(data.gallery);
            }
        } catch (error) {
            console.error(
                "Fetch gallery error:",
                error
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

        if (!selectedFile) return;

        setImage(selectedFile);

        const imageUrl = URL.createObjectURL(
            selectedFile
        );

        setPreview(imageUrl);
    };

    // ================= SUBMIT =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.category) {
            alert(
                "Please enter title and category."
            );
            return;
        }

        if (!editingId && !image) {
            alert("Please select an image.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("category", form.category);
            formData.append(
                "description",
                form.description
            );

            if (image) {
                formData.append("image", image);
            }

            let response;

            if (editingId) {
                // ================= UPDATE =================

                response = await fetch(
                    `${API_URL}/api/gallery/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
            } else {
                // ================= ADD =================

                response = await fetch(
                    `${API_URL}/api/gallery`,
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

            if (!response.ok) {
                alert(
                    data.message ||
                        "Something went wrong"
                );
                return;
            }

            alert(
                editingId
                    ? "Gallery updated successfully!"
                    : "Gallery image added successfully!"
            );

            resetForm();
            fetchGallery();

        } catch (error) {
            console.error(
                "Save gallery error:",
                error
            );

            alert(
                "Unable to connect to server"
            );
        }
    };

    // ================= EDIT =================

    const handleEdit = (item) => {
        setEditingId(item._id);

        setForm({
            title: item.title || "",
            category: item.category || "",
            description: item.description || "",
        });

        setImage(null);

        if (item.image) {
            setPreview(
                item.image.startsWith("http")
                    ? item.image
                    : `${API_URL}${item.image}`
            );
        } else {
            setPreview("");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ================= DELETE =================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this gallery image?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/gallery/${id}`,
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
                        "Failed to delete gallery image"
                );
                return;
            }

            alert(
                "Gallery image deleted successfully!"
            );

            fetchGallery();

        } catch (error) {
            console.error(
                "Delete gallery error:",
                error
            );

            alert(
                "Unable to connect to server"
            );
        }
    };

    // ================= RESET FORM =================

    const resetForm = () => {
        setEditingId(null);

        setForm({
            title: "",
            category: "",
            description: "",
        });

        setImage(null);
        setPreview("");

        // Clear file input
        const fileInput =
            document.getElementById(
                "galleryImage"
            );

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // ================= IMAGE URL =================

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

    // ================= RENDER =================

    return (
        <div className="container py-5">

            {/* ================= HEADER ================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold">
                        Gallery Management
                    </h2>

                    <p className="text-muted mb-0">
                        Add, edit and manage photography
                        gallery images.
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
                            ? "Edit Gallery"
                            : "Add New Gallery Image"}
                    </h4>

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            {/* Title */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="Wedding Photography"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Category */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    className="form-select"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="Wedding">
                                        Wedding
                                    </option>

                                    <option value="Birthday">
                                        Birthday
                                    </option>

                                    <option value="Baby Shower">
                                        Baby Shower
                                    </option>

                                    <option value="Baby Shoot">
                                        Baby Shoot
                                    </option>

                                    <option value="Engagement">
                                        Engagement
                                    </option>

                                    <option value="Pre Wedding">
                                        Pre Wedding
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>

                            </div>

                            {/* Image */}

                            <div className="col-12">

                                <label
                                    className="form-label"
                                    htmlFor="galleryImage"
                                >
                                    Image
                                </label>

                                <input
                                    id="galleryImage"
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                />

                                <small className="text-muted">
                                    {editingId
                                        ? "Leave empty to keep the existing image."
                                        : "Select a photography image."}
                                </small>

                            </div>

                            {/* Preview */}

                            {preview && (
                                <div className="col-12">

                                    <label className="form-label">
                                        Image Preview
                                    </label>

                                    <div>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                width: "250px",
                                                height: "180px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>

                                </div>
                            )}

                            {/* Description */}

                            <div className="col-12">

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter image description..."
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                        {/* Buttons */}

                        <div className="mt-4">

                            <button
                                type="submit"
                                className="btn btn-dark me-2"
                            >
                                {editingId
                                    ? "Update Gallery"
                                    : "Add Gallery"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={resetForm}
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

                <h4 className="fw-bold mb-0">
                    Existing Gallery
                </h4>

                <span className="badge bg-dark">
                    {gallery.length} Photos
                </span>

            </div>

            {loading ? (

                /* ================= LOADING ================= */

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
                        Loading gallery...
                    </p>

                </div>

            ) : gallery.length === 0 ? (

                /* ================= NO GALLERY ================= */

                <div className="alert alert-info">
                    No gallery images found.
                </div>

            ) : (

                /* ================= GALLERY CARDS ================= */

                <div className="row g-4">

                    {gallery.map((item) => (

                        <div
                            className="col-md-6 col-lg-4"
                            key={item._id}
                        >

                            <div className="card h-100 shadow-sm border-0">

                                {item.image && (
                                    <img
                                        src={getImageUrl(
                                            item.image
                                        )}
                                        className="card-img-top"
                                        alt={item.title}
                                        style={{
                                            height: "250px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )}

                                <div className="card-body">

                                    <span className="badge bg-dark mb-2">
                                        {item.category}
                                    </span>

                                    <h5 className="fw-bold">
                                        {item.title}
                                    </h5>

                                    {item.description && (
                                        <p className="text-muted small">
                                            {
                                                item.description
                                            }
                                        </p>
                                    )}

                                </div>

                                <div className="card-footer bg-white border-0 d-flex gap-2">

                                    <button
                                        className="btn btn-outline-dark btn-sm"
                                        onClick={() =>
                                            handleEdit(item)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() =>
                                            handleDelete(
                                                item._id
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

export default GalleryManagement;
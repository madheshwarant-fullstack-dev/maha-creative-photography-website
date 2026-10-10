import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_URL, resolveImageUrl, NEUTRAL_PLACEHOLDER_IMAGE } from "../../services/api";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  // Fetch live photos directly from database API
  const fetchGallery = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/gallery`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.gallery)) {
        const liveItems = data.gallery.map((item) => ({
          _id: item._id || item.id || `photo-${Math.random()}`,
          title: item.title || "Studio Capture",
          category: (item.category || "Photography").trim(),
          imageUrl: item.imageUrl || item.image || "",
          description: item.description || "",
        }));

        setPhotos(liveItems);
      } else {
        setPhotos([]);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("[Gallery] Failed to fetch gallery photos:", err);
      const isTimeout = err.name === "AbortError";
      setError(
        isTimeout
          ? "Connection timed out while fetching gallery photos. Please try again."
          : "Unable to connect to the server to load gallery photos."
      );
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Handle ESC key to dismiss photo lightbox modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute available categories dynamically based on photos present in the database
  const availableCategories = useMemo(() => {
    const categorySet = new Set();
    photos.forEach((photo) => {
      if (photo.category && photo.category.trim()) {
        categorySet.add(photo.category.trim());
      }
    });

    if (categorySet.size === 0) {
      return ["All"];
    }

    return ["All", ...Array.from(categorySet)];
  }, [photos]);

  // Automatically switch back to "All" if current active category has no photos
  useEffect(() => {
    if (activeCategory !== "All" && !availableCategories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, availableCategories]);

  // Filter photos by active category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") return photos;
    return photos.filter(
      (p) => (p.category || "").toLowerCase() === activeCategory.toLowerCase()
    );
  }, [photos, activeCategory]);

  const handleImageLoad = (photoId) => {
    setLoadedImages((prev) => ({ ...prev, [photoId]: true }));
  };

  return (
    <div className="gallery-page">
      {/* Header Section */}
      <section className="gallery-header text-center py-5">
        <div className="container">
          <p className="gallery-small-title">MAHA CREATIVE PHOTOGRAPHY</p>
          <h1>
            Our <span>Gallery</span>
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "650px" }}>
            Explore our curated portfolio of weddings, baby showers, birthdays, and fine-art portraits captured with elegance and passion.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="container pb-5">
        {/* Loading State */}
        {loading && (
          <div className="py-5">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <div className="spinner-border text-danger me-2" role="status">
                <span className="visually-hidden">Loading gallery...</span>
              </div>
              <span className="text-muted fw-semibold">Loading gallery photos...</span>
            </div>
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div className="col-lg-4 col-md-6" key={`skeleton-${idx}`}>
                  <div
                    className="gallery-card d-flex align-items-center justify-content-center"
                    style={{
                      background: "#f3f4f6",
                      borderRadius: "12px",
                      minHeight: "320px",
                    }}
                  >
                    <div className="spinner-border spinner-border-sm text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 text-danger"
              style={{ width: "70px", height: "70px", background: "rgba(220, 53, 69, 0.1)" }}
            >
              <i className="bi bi-exclamation-triangle" style={{ fontSize: "32px" }}></i>
            </div>
            <h4 className="fw-bold mb-2">Unable to Load Gallery</h4>
            <p className="text-muted mb-4">{error}</p>
            <button
              type="button"
              className="btn btn-outline-danger px-4 rounded-pill"
              onClick={fetchGallery}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Retry Loading
            </button>
          </div>
        )}

        {/* Empty State: No photos uploaded yet */}
        {!loading && !error && photos.length === 0 && (
          <div className="text-center py-5 my-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255, 20, 147, 0.1)",
                color: "#ff1493",
              }}
            >
              <i className="bi bi-camera" style={{ fontSize: "36px" }}></i>
            </div>
            <h3 className="fw-bold mb-2">No Gallery Photos Yet</h3>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: "500px" }}>
              Our portfolio is currently being curated. Images added by the admin will appear here shortly.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/packages" className="btn btn-pink px-4 py-2">
                Explore Packages
              </Link>
              <Link to="/contact" className="btn btn-outline-dark px-4 py-2">
                Contact Studio
              </Link>
            </div>
          </div>
        )}

        {/* Photos Present: Show Filters and Grid */}
        {!loading && !error && photos.length > 0 && (
          <>
            {/* Category Filter Pills (Only shown when multiple categories exist) */}
            {availableCategories.length > 1 && (
              <div className="d-flex flex-wrap justify-content-center mb-4">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`gallery-filter-btn ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Empty Category State */}
            {filteredPhotos.length === 0 && (
              <div className="text-center py-5">
                <h5 className="text-muted">No photos found in "{activeCategory}"</h5>
                <p className="text-secondary small">
                  Select another category or click "All" to view the full gallery collection.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm rounded-pill mt-2 px-3"
                  onClick={() => setActiveCategory("All")}
                >
                  Show All Photos
                </button>
              </div>
            )}

            {/* Gallery Grid */}
            {filteredPhotos.length > 0 && (
              <div className="row g-4">
                {filteredPhotos.map((photo) => {
                  const photoKey = photo._id || photo.title;
                  const resolvedSrc =
                    resolveImageUrl(photo.imageUrl || photo.image) || NEUTRAL_PLACEHOLDER_IMAGE;
                  const isLoaded = loadedImages[photoKey];

                  return (
                    <div className="col-lg-4 col-md-6" key={photoKey}>
                      <div
                        className="gallery-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        {/* Placeholder shimmer before image loads */}
                        {!isLoaded && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              backgroundColor: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 1,
                            }}
                          >
                            <div className="spinner-border spinner-border-sm text-secondary" role="status">
                              <span className="visually-hidden">Loading photo...</span>
                            </div>
                          </div>
                        )}

                        <img
                          src={resolvedSrc}
                          alt={photo.title}
                          loading="lazy"
                          onLoad={() => handleImageLoad(photoKey)}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = NEUTRAL_PLACEHOLDER_IMAGE;
                            handleImageLoad(photoKey);
                          }}
                          style={{
                            opacity: isLoaded ? 1 : 0,
                            transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
                          }}
                        />

                        <div className="gallery-overlay">
                          {photo.category && (
                            <span className="gallery-category-badge">
                              {photo.category}
                            </span>
                          )}

                          <h4>{photo.title}</h4>

                          <button
                            type="button"
                            className="btn btn-light btn-sm rounded-pill mt-1"
                            style={{ alignSelf: "flex-start", fontWeight: 600, padding: "5px 16px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhoto(photo);
                            }}
                          >
                            View Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* ================= PHOTO LIGHTBOX MODAL ================= */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "24px",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "960px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo preview"
              style={{
                position: "absolute",
                top: "-18px",
                right: "-18px",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#ffffff",
                color: "#111111",
                fontSize: "26px",
                lineHeight: "1",
                fontWeight: "bold",
                cursor: "pointer",
                zIndex: 3,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              ×
            </button>

            {/* Full Image */}
            <img
              src={resolveImageUrl(selectedPhoto.imageUrl || selectedPhoto.image) || NEUTRAL_PLACEHOLDER_IMAGE}
              alt={selectedPhoto.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = NEUTRAL_PLACEHOLDER_IMAGE;
              }}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: "12px",
                display: "block",
                margin: "0 auto",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.5)",
              }}
            />

            {/* Photo Details */}
            <div className="mt-3 text-center">
              {selectedPhoto.category && (
                <span
                  className="badge bg-danger rounded-pill px-3 py-1 mb-2 text-uppercase"
                  style={{ fontSize: "11px", letterSpacing: "1px" }}
                >
                  {selectedPhoto.category}
                </span>
              )}
              <h4 style={{ color: "#ffffff", fontWeight: 700, margin: "4px 0" }}>
                {selectedPhoto.title}
              </h4>
              {selectedPhoto.description && (
                <p style={{ color: "#cccccc", fontSize: "14px", maxWidth: "600px", margin: "6px auto 0" }}>
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
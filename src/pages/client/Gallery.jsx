import React, { useEffect, useState } from "react";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected photo for popup
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Get gallery from backend
  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/gallery"
      );

      const data = await response.json();

      if (data.success) {
        setPhotos(data.gallery);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Unable to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Get image URL
  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };

  return (
    <div className="gallery-page">

      {/* Heading */}
      <section className="gallery-header text-center py-5">
        <p className="gallery-small-title">
          MAHA CREATIVE PHOTOGRAPHY
        </p>

        <h1>
          Our <span>Gallery</span>
        </h1>

        <p className="text-muted">
          Explore some of our beautiful photography moments.
        </p>
      </section>

      {/* Gallery */}
      <section className="container pb-5">

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border"></div>

            <p className="mt-2">
              Loading gallery...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && photos.length === 0 && (
          <div className="text-center py-5">
            <h5>No photos available</h5>

            <p className="text-muted">
              Gallery photos will appear here.
            </p>
          </div>
        )}

        {/* Gallery Cards */}
        {!loading && !error && photos.length > 0 && (
          <div className="row g-4">

            {photos.map((photo) => (
              <div
                className="col-lg-4 col-md-6"
                key={photo._id}
              >
                <div className="gallery-card">

                  <img
                    src={getImageUrl(photo.image)}
                    alt={photo.title}
                    className="img-fluid w-100"
                    style={{
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="gallery-overlay">

                    <h4>{photo.title}</h4>

                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() =>
                        setSelectedPhoto(photo)
                      }
                    >
                      View Photo
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </section>

      {/* ================= PHOTO MODAL ================= */}

      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "30px",
          }}
        >

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "1000px",
              width: "100%",
              textAlign: "center",
            }}
          >

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: "absolute",
                top: "-15px",
                right: "-15px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#fff",
                color: "#000",
                fontSize: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              ×
            </button>

            {/* Full Image */}
            <img
              src={getImageUrl(selectedPhoto.image)}
              alt={selectedPhoto.title}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "10px",
                display: "block",
                margin: "0 auto",
              }}
            />

            {/* Photo Title */}
            <h4
              style={{
                color: "#fff",
                marginTop: "15px",
              }}
            >
              {selectedPhoto.title}
            </h4>

          </div>

        </div>
      )}

    </div>
  );
}

export default Gallery;
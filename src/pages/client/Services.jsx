import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Services.css";

function Services() {
  const navigate = useNavigate();

  const services = [
    {
      image: "/images/gallery/Wedding2.jpeg",
      title: "Wedding Photography",
      description:
        "Beautifully capture every special moment of your wedding day.",
      price: "₹15,000",
    },
    {
      image: "/images/gallery/birthday1.png",
      title: "Birthday Photography",
      description:
        "Professional photography for memorable birthday celebrations.",
      price: "₹5,000",
    },
    {
      image: "/images/gallery/baby.jpeg",
      title: "Baby Photography",
      description:
        "Creative and adorable photography for your little ones.",
      price: "₹7,000",
    },
    {
      image: "/images/gallery/prewedding.jpeg",
      title: "Pre-Wedding Photography",
      description:
        "Romantic pre-wedding photoshoots at beautiful locations.",
      price: "₹10,000",
    },
    {
      image: "/images/gallery/model.jpeg",
      title: "Model Photography",
      description:
        "Professional portfolio and fashion photography sessions.",
      price: "₹8,000",
    },
    {
      image: "/images/gallery/baby shower.jpeg",
      title: "Event Photography",
      description:
        "Capture your special events with professional photography.",
      price: "₹6,000",
    },
  ];

  const handleBooking = () => {
    navigate("/packages");
  };

  return (
    <div className="services-page">

      {/* Header */}
      <section className="services-header text-center">
        <p>MAHA CREATIVE PHOTOGRAPHY</p>

        <h1>
          Our <span>Services</span>
        </h1>

        <p className="subtitle">
          Professional photography services for your beautiful moments.
        </p>
      </section>

      {/* Services */}
      <section className="container py-5">
        <div className="row g-4">

          {services.map((service, index) => (
            <div
              className="col-lg-4 col-md-6"
              key={index}
            >
              <div className="service-card">

                <div className="service-image">
                  <img
                    src={service.image}
                    alt={service.title}
                  />
                </div>

                <div className="service-content">

                  <h3>{service.title}</h3>

                  <p>
                    {service.description}
                  </p>

                  <h4>{service.price}</h4>

                  <button
                    className="book-btn"
                    onClick={handleBooking}
                  >
                    Book Now
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}

export default Services;
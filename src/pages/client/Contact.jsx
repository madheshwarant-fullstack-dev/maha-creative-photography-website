import React, { useState } from "react";

const API_URL = "http://localhost:5000";

function Contact() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");


    // ================= HANDLE INPUT =================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    // ================= SUBMIT FORM =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        setSuccess("");
        setError("");

        try {

            const response = await fetch(
                `${API_URL}/api/messages`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Failed to send enquiry"
                );

                return;
            }


            // Success message
            setSuccess(
                "Your enquiry has been sent successfully!"
            );


            // Clear form
            setFormData({
                name: "",
                email: "",
                phone: "",
                message: "",
            });

        } catch (error) {

            console.error(
                "Contact form error:",
                error
            );

            setError(
                "Unable to connect to server. Please try again."
            );

        } finally {

            setSubmitting(false);

        }
    };


    return (
        <section
            id="contact"
            className="contact-section py-5"
        >

            <div className="container py-5">

                {/* ================= TITLE ================= */}

                <div className="text-center mb-5">

                    <p className="section-title">
                        GET IN TOUCH
                    </p>

                    <h2 className="display-5 fw-bold">

                        Let's Capture Your

                        <span className="pink-text">
                            {" "}Story
                        </span>

                    </h2>

                </div>


                <div className="row g-5">


                    {/* ================= CONTACT INFO ================= */}

                    <div className="col-lg-5">

                        <h3>
                            Contact Information
                        </h3>

                        <p className="text-muted">
                            Have a photography requirement?
                            We'd love to hear from you.
                        </p>


                        <div className="contact-item">

                            <i className="bi bi-telephone-fill"></i>

                            <div>
                                <strong>
                                    Phone
                                </strong>

                                <p>
                                    +91 97901 02798
                                </p>
                            </div>

                        </div>


                        <div className="contact-item">

                            <i className="bi bi-envelope-at-fill"></i>

                            <div>
                                <strong>
                                    Email
                                </strong>

                                <p>
                                    mahacreative05@gmail.com
                                </p>
                            </div>

                        </div>


                        <div className="contact-item">

                            <i className="bi bi-geo-alt-fill"></i>

                            <div>
                                <strong>
                                    Location
                                </strong>

                                <p>
                                    Divya Paradise(opp),<br />12th Ward,Srinivasanagar,<br />Aundipatty,Theni,<br />Tamil Nadu,625512
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* ================= CONTACT FORM ================= */}

                    <div className="col-lg-7">

                        {/* Success */}

                        {success && (
                            <div className="alert alert-success">
                                {success}
                            </div>
                        )}


                        {/* Error */}

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}


                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="row g-3">


                                {/* Name */}

                                <div className="col-md-6">

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* Email */}

                                <div className="col-md-6">

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* Phone */}

                                <div className="col-12">

                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* Message */}

                                <div className="col-12">

                                    <textarea
                                        name="message"
                                        className="form-control"
                                        rows="5"
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>

                                </div>


                                {/* Submit */}

                                <div className="col-12">

                                    <button
                                        type="submit"
                                        className="btn btn-pink"
                                        disabled={submitting}
                                    >

                                        {submitting
                                            ? "Sending..."
                                            : "Send Enquiry"
                                        }

                                    </button>

                                </div>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Contact;
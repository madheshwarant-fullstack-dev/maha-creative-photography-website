import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Booking() {
    const navigate = useNavigate();
    const location = useLocation();

    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        location: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [packagesLoading, setPackagesLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ================= GET PACKAGE ID FROM URL =================

    const searchParams = new URLSearchParams(location.search);
    const packageId = searchParams.get("packageId");

    // ================= FETCH PACKAGES =================

    const fetchPackages = async () => {
        try {
            setPackagesLoading(true);

            const response = await fetch(
                `${API_URL}/api/packages`
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setPackages(data.packages || []);
            }
        } catch (error) {
            console.error(
                "Packages fetch error:",
                error
            );
        } finally {
            setPackagesLoading(false);
        }
    };

    // ================= GET LOGGED-IN USER =================

    const loadUserData = () => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            if (userData) {
                const user = JSON.parse(userData);

                setFormData((prev) => ({
                    ...prev,
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                }));
            }
        } catch (error) {
            console.error(
                "User data error:",
                error
            );
        }
    };

    useEffect(() => {
        loadUserData();
        fetchPackages();
    }, []);

    // ================= SELECT PACKAGE FROM URL =================

    useEffect(() => {
        if (packageId && packages.length > 0) {
            const foundPackage = packages.find(
                (item) =>
                    item.packageId === packageId
            );

            if (foundPackage) {
                setSelectedPackage(foundPackage);
            }
        }
    }, [packageId, packages]);

    // ================= INPUT CHANGE =================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ================= PACKAGE CHANGE =================

    const handlePackageChange = (e) => {
        const selectedId = e.target.value;

        const foundPackage = packages.find(
            (item) =>
                item.packageId === selectedId
        );

        setSelectedPackage(
            foundPackage || null
        );
    };

    // ================= SUBMIT BOOKING =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!formData.eventType) {
            setError(
                "Please select an event type."
            );
            return;
        }

        if (!formData.eventDate) {
            setError(
                "Please select an event date."
            );
            return;
        }

        if (!formData.location.trim()) {
            setError(
                "Please enter the event location."
            );
            return;
        }

        try {
            setLoading(true);

            const bookingData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                eventType: formData.eventType,
                eventDate: formData.eventDate,
                location: formData.location,
                message: formData.message,

                packageId:
                    selectedPackage?.packageId || "",

                packageName:
                    selectedPackage?.name || "",

                packagePrice:
                    selectedPackage?.price || 0,
            };

            const response = await fetch(
                `${API_URL}/api/bookings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                        bookingData
                    ),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    navigate("/login");
                    return;
                }

                throw new Error(
                    data.message ||
                        "Booking failed"
                );
            }

            if (data.success) {
                setSuccess(
                    "Booking submitted successfully!"
                );

                setFormData((prev) => ({
                    ...prev,
                    eventType: "",
                    eventDate: "",
                    location: "",
                    message: "",
                }));

                setSelectedPackage(null);
            } else {
                setError(
                    data.message ||
                        "Unable to create booking"
                );
            }
        } catch (error) {
            console.error(
                "Booking submit error:",
                error
            );

            setError(
                error.message ||
                    "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= TODAY DATE =================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    return (
        <section className="py-5">
            <div className="container">
                  {/* Back Button */}
            <button
                    type="button"
                    className="btn btn-outline-dark mb-4"
                    onClick={() => navigate(-1)}
            >
            <i className="bi bi-arrow-left me-2"></i>
                Back
            </button>

                {/* ================= HEADING ================= */}

                <div className="text-center mb-5">
                    <h2 className="fw-bold">
                        Book Your Photography Session
                    </h2>

                    <p className="text-muted">
                        Tell us about your event and
                        we'll get back to you soon.
                    </p>
                </div>

                {/* ================= ALERTS ================= */}

                {success && (
                    <div className="alert alert-success text-center">
                        {success}

                        <div className="mt-3">
                            <button
                                className="btn btn-dark"
                                onClick={() =>
                                    navigate(
                                        "/my-bookings"
                                    )
                                }
                            >
                                View My Bookings
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                )}

                <div className="row justify-content-center">

                    <div className="col-lg-8">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4 p-md-5">

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                >

                                    {/* ================= NAME ================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* ================= EMAIL ================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* ================= PHONE ================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Phone
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* ================= PACKAGE ================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Select Package
                                        </label>

                                        {packagesLoading ? (
                                            <div className="form-control">
                                                Loading packages...
                                            </div>
                                        ) : (
                                            <select
                                                className="form-select"
                                                value={
                                                    selectedPackage
                                                        ?.packageId ||
                                                    ""
                                                }
                                                onChange={
                                                    handlePackageChange
                                                }
                                            >

                                                <option value="">
                                                    Select a package
                                                </option>

                                                {packages.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <option
                                                            key={
                                                                item._id
                                                            }
                                                            value={
                                                                item.packageId
                                                            }
                                                        >
                                                            {
                                                                item.name
                                                            }{" "}
                                                            - ₹
                                                            {Number(
                                                                item.price
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </option>
                                                    )
                                                )}

                                            </select>
                                        )}

                                    </div>

                                    {/* ================= SELECTED PACKAGE ================= */}

                                    {selectedPackage && (
                                        <div className="alert alert-light border mb-4">

                                            <h5 className="mb-2">
                                                {
                                                    selectedPackage.name
                                                }
                                            </h5>

                                            <p className="mb-1">
                                                <strong>
                                                    Category:
                                                </strong>{" "}
                                                {
                                                    selectedPackage.category
                                                }
                                            </p>

                                            <p className="mb-1">
                                                <strong>
                                                    Delivery:
                                                </strong>{" "}
                                                {
                                                    selectedPackage.delivery
                                                }
                                            </p>

                                            <p className="mb-0">
                                                <strong>
                                                    Price:
                                                </strong>{" "}
                                                ₹
                                                {Number(
                                                    selectedPackage.price
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                        </div>
                                    )}

                                    {/* ================= EVENT TYPE ================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Event Type
                                        </label>

                                        <select
                                            name="eventType"
                                            className="form-select"
                                            value={
                                                formData.eventType
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select event type
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

                                            <option value="Engagement">
                                                Engagement
                                            </option>

                                            <option value="Pre Wedding">
                                                Pre Wedding
                                            </option>

                                            <option value="Baby Shoot">
                                                Baby Shoot
                                            </option>

                                            <option value="Puberty ceremony">
                                                Puberty ceremony
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                    </div>

                                    {/* ================= DATE ================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Event Date
                                        </label>

                                        <input
                                            type="date"
                                            name="eventDate"
                                            className="form-control"
                                            value={
                                                formData.eventDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min={today}
                                            required
                                        />

                                    </div>

                                    {/* ================= LOCATION ================= */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Event Location
                                        </label>

                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            placeholder="Enter event location"
                                            value={
                                                formData.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* ================= MESSAGE ================= */}

                                    <div className="mb-4">

                                        <label className="form-label">
                                            Additional Message
                                        </label>

                                        <textarea
                                            name="message"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Tell us anything else about your event..."
                                            value={
                                                formData.message
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        ></textarea>

                                    </div>

                                    {/* ================= SUBMIT ================= */}

                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 py-2"
                                        disabled={
                                            loading
                                        }
                                    >
                                        {loading
                                            ? "Submitting..."
                                            : "Submit Booking"}
                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Booking;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ================= CHECK AUTH STATUS =================
    const checkLogin = () => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                // Public footer only tracks client status (no admin exposure)
                if (parsedUser && parsedUser.role !== "admin") {
                    setUser(parsedUser);
                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch {
                setUser(null);
                setIsLoggedIn(false);
            }
        } else {
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        checkLogin();
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, []);

    // Dynamic current year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer footer-section" aria-label="Site Footer">
            <div className="container">
                <div className="row g-4 g-lg-5 justify-content-between">
                    {/* ================= COLUMN 1: BRAND & TAGLINE ================= */}
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-brand mb-3">
                            <Link to="/" className="d-inline-block mb-3" aria-label="Maha Creative Photography Home">
                                <img
                                    src="/images/Logo.png"
                                    alt="Maha Creative Photography"
                                    className="footer-logo"
                                />
                            </Link>
                            <h3 className="footer-brand-title">
                                Maha Creative <span>Photography</span>
                            </h3>
                            <p className="footer-tagline">
                                Capturing Moments, Creating Memories.
                            </p>
                        </div>
                        <p className="footer-desc">
                            Professional photography studio capturing royal weddings, joyous baby showers, milestone birthdays, and fine-art portraits with timeless elegance.
                        </p>
                        <div className="footer-social-connect d-flex align-items-center gap-2 mt-3">
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-btn facebook"
                                aria-label="Visit Maha Creative Photography on Facebook"
                                title="Facebook"
                            >
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a
                                href="https://www.instagram.com/maha_creative__photography/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-btn instagram"
                                aria-label="Visit Maha Creative Photography on Instagram"
                                title="Instagram: @maha_creative__photography"
                            >
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a
                                href="https://wa.me/919790102798"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-btn whatsapp"
                                aria-label="Chat with Maha Creative Photography on WhatsApp"
                                title="WhatsApp: +91 97901 02798"
                            >
                                <i className="bi bi-whatsapp"></i>
                            </a>
                        </div>
                    </div>

                    {/* ================= COLUMN 2: QUICK LINKS ================= */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h4 className="footer-column-title">Quick Links</h4>
                        <ul className="footer-links-list">
                            <li>
                                <Link to="/" className="footer-link">
                                    <i className="bi bi-chevron-right"></i> Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="footer-link">
                                    <i className="bi bi-chevron-right"></i> About
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="footer-link">
                                    <i className="bi bi-chevron-right"></i> Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="footer-link">
                                    <i className="bi bi-chevron-right"></i> Gallery
                                </Link>
                            </li>
                            <li>
                                <Link to="/packages" className="footer-link">
                                    <i className="bi bi-chevron-right"></i> Packages
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="footer-link">
                                    <i className="bi bi-chevron-right"></i> Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ================= COLUMN 3: CUSTOMER PORTAL ================= */}
                    <div className="col-lg-3 col-md-6 col-6">
                        <h4 className="footer-column-title">Customer Area</h4>
                        <ul className="footer-links-list">
                            <li>
                                <Link to="/booking" className="footer-link">
                                    <i className="bi bi-calendar-event"></i> Book a Session
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-bookings" className="footer-link">
                                    <i className="bi bi-collection-play"></i> My Bookings
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="footer-link">
                                    <i className="bi bi-person"></i> My Profile
                                </Link>
                            </li>
                            {!isLoggedIn ? (
                                <>
                                    <li>
                                        <Link to="/login" className="footer-link">
                                            <i className="bi bi-box-arrow-in-right"></i> Client Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/signup" className="footer-link">
                                            <i className="bi bi-person-plus"></i> Create Account
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <li className="pt-2">
                                    <span className="footer-client-badge">
                                        <i className="bi bi-person-check-fill text-pink"></i> Signed in as {user?.name?.split(" ")[0] || "Client"}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* ================= COLUMN 4: STUDIO CONTACT ================= */}
                    <div className="col-lg-3 col-md-6">
                        <h4 className="footer-column-title">Studio Contact</h4>
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon">
                                <i className="bi bi-geo-alt-fill"></i>
                            </div>
                            <div className="footer-contact-text">
                                <span className="d-block fw-semibold text-white mb-1">Our Studio</span>
                                Divya Paradise (opp), 12th Ward, Srinivasanagar, Aundipatty, Theni, Tamil Nadu - 625512
                            </div>
                        </div>

                        <div className="footer-contact-item">
                            <div className="footer-contact-icon">
                                <i className="bi bi-telephone-fill"></i>
                            </div>
                            <div className="footer-contact-text">
                                <span className="d-block fw-semibold text-white mb-1">Phone Enquiries</span>
                                <a href="tel:+919790102798" className="footer-contact-link">
                                    +91 97901 02798
                                </a>
                            </div>
                        </div>

                        <div className="footer-contact-item">
                            <div className="footer-contact-icon">
                                <i className="bi bi-envelope-at-fill"></i>
                            </div>
                            <div className="footer-contact-text">
                                <span className="d-block fw-semibold text-white mb-1">Email Enquiries</span>
                                <a href="mailto:mahacreative05@gmail.com" className="footer-contact-link text-break">
                                    mahacreative05@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= BOTTOM COPYRIGHT BAR ================= */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright mb-0">
                            © {currentYear} Maha Creative Photography. All Rights Reserved.
                        </p>
                        <div className="footer-badge">
                            <i className="bi bi-camera-fill text-pink"></i> Capturing Moments, Creating Memories.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
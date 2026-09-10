import React from "react";

function Footer() {
    return (
        <footer className="footer">

            <div className="container">

                <img
                    src="/images/Logo.png"
                    alt="Maha Creative Photography"
                    className="footer-logo"
                />

                <p>
                    Capturing moments. Creating memories.
                </p>

                <div className="footer-links">
                    <a href="/">Home</a>
                    <a href="/services">Services</a>
                    <a href="/gallery">Gallery</a>
                    <a href="/packages">Packages</a>
                    <a href="/contact">Contact</a>
                </div>

                <hr />

                <p className="copyright">
                    © 2026 Maha Creative Photography.
                    All Rights Reserved.
                </p>

            </div>

        </footer>
    );
}

export default Footer;
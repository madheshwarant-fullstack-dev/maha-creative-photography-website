import React from "react";
import { Link } from "react-router-dom";

import About from "./About";
import Services from "./Services";
import Gallery from "./Gallery";
import Packages from "./Packages";
import Testimonials from "../../components/Testimonials";
import Contact from "./Contact";

function Home() {
    return (
        <>
            {/* Hero Section */}

            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center min-vh-100">

                        <div className="col-lg-7">

                            <p className="hero-small-text">
                                MAHA CREATIVE PHOTOGRAPHY
                            </p>

                            <h1>
                                We Capture
                                <br />
                                Your <span>Beautiful Moments</span>
                            </h1>

                            <p className="hero-description">
                                We turn your special moments into timeless
                                memories with creativity, passion and
                                professional photography.
                            </p>

                            <div className="mt-4">

                                <Link
                                    to="/booking"
                                    className="btn btn-pink btn-lg me-3"
                                >
                                    Book Your Session
                                </Link>

                                <Link
                                    to="/gallery"
                                    className="btn btn-outline-light btn-lg"
                                >
                                    View Gallery
                                </Link>

                            </div>

                        </div>

                    </div>
                </div>
            </section>


            {/* About */}

            <About />


            {/* Services */}

            <Services />


            {/* Gallery */}

            <Gallery />


            {/* Packages */}

            <Packages />


            {/* Testimonials */}

            <Testimonials />


            {/* Contact */}

            <Contact />
        </>
    );
}

export default Home;
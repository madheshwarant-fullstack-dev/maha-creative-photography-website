import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ================= CHECK LOGIN =================

    const checkLogin = () => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);

                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (error) {
                console.error(
                    "Invalid user data:",
                    error
                );

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

        window.addEventListener(
            "storage",
            checkLogin
        );

        return () => {
            window.removeEventListener(
                "storage",
                checkLogin
            );
        };
    }, []);

    // ================= LOGOUT =================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setIsLoggedIn(false);

        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">

            <div className="container">

                {/* ================= LOGO ================= */}

                <Link
                    className="navbar-brand d-flex align-items-center"
                    to="/"
                >
                    <img
                        src="/images/Logo.png"
                        alt="Maha Creative Photography"
                        style={{
                            height: "45px",
                            width: "auto",
                            objectFit: "contain",
                        }}
                    />
                </Link>

                {/* ================= MOBILE TOGGLE ================= */}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* ================= NAVIGATION ================= */}

                <div
                    className="collapse navbar-collapse"
                    id="mainNavbar"
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center">

                        {/* HOME */}

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/"
                            >
                                Home
                            </Link>
                        </li>

                        {/* ABOUT */}

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/about"
                            >
                                About
                            </Link>
                        </li>

                        {/* SERVICES */}

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/services"
                            >
                                Services
                            </Link>
                        </li>

                        {/* GALLERY */}

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/gallery"
                            >
                                Gallery
                            </Link>
                        </li>

                        {/* PACKAGES */}

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/packages"
                            >
                                Packages
                            </Link>
                        </li>

                        {/* CONTACT */}

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/contact"
                            >
                                Contact
                            </Link>
                        </li>

                        {/* ================= LOGGED OUT ================= */}

                        {!isLoggedIn && (
                            <>
                                {/* LOGIN */}

                                <li className="nav-item ms-lg-2">
                                    <Link
                                        className="btn btn-outline-light btn-sm px-3"
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                </li>

                                {/* SIGNUP */}

                                <li className="nav-item ms-lg-2">
                                    <Link
                                        className="btn btn-pink btn-sm px-3"
                                        to="/signup"
                                    >
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* ================= LOGGED IN ================= */}

                        {isLoggedIn && user && (
                            <li className="nav-item dropdown ms-lg-2">

                                <button
                                    className="btn btn-outline-light btn-sm dropdown-toggle px-3"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i class="bi bi-person-fill"></i>{" "}
                                    {user.name}
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end shadow">

                                    {/* PROFILE */}

                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/profile"
                                        >
                                            <i class="bi bi-person-fill"></i> My Profile
                                        </Link>
                                    </li>

                                    {/* MY BOOKINGS */}

                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/my-bookings"
                                        >
                                            <i class="bi bi-camera-fill"></i> My Bookings
                                        </Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    {/* LOGOUT */}

                                    <li>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={
                                                handleLogout
                                            }
                                        >
                                            <i class="bi bi-door-open-fill"></i> Logout
                                        </button>
                                    </li>

                                </ul>

                            </li>
                        )}

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
import React, { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ClientProtectedRoute from "./components/ClientProtectedRoute";

// ================= CLIENT PAGES =================

import Home from "./pages/client/Home";
import About from "./pages/client/About";
import Services from "./pages/client/Services";
import Gallery from "./pages/client/Gallery";
import Packages from "./pages/client/Packages";
import PackageDetail from "./pages/client/PackageDetail";
import Booking from "./pages/client/Booking";
import Contact from "./pages/client/Contact";
import Login from "./pages/client/Login";
import Signup from "./pages/client/Signup";
import Profile from "./pages/client/Profile";
import MyBookings from "./pages/client/MyBookings";

// ================= ADMIN PAGES =================

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Bookings from "./pages/admin/Bookings";
import GalleryManagement from "./pages/admin/GalleryManagement";
import PackageManagement from "./pages/admin/PackageManagement";
import Messages from "./pages/admin/Messages";

// ================= SCROLL TO TOP =================

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

// ================= APP =================

function App() {
    return (
        <BrowserRouter>

            {/* Scroll page to top whenever route changes */}
            <ScrollToTop />

            <Routes>

                {/* ================= CLIENT PUBLIC ================= */}

                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <Home />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/about"
                    element={
                        <>
                            <Navbar />
                            <About />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/services"
                    element={
                        <>
                            <Navbar />
                            <Services />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/gallery"
                    element={
                        <>
                            <Navbar />
                            <Gallery />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/packages"
                    element={
                        <>
                            <Navbar />
                            <Packages />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/package/:packageId"
                    element={
                        <>
                            <Navbar />
                            <PackageDetail />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/booking"
                    element={
                        <>
                            <Navbar />
                            <Booking />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/contact"
                    element={
                        <>
                            <Navbar />
                            <Contact />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* ================= CLIENT PROTECTED ================= */}

                <Route element={<ClientProtectedRoute />}>

                    <Route
                        path="/profile"
                        element={
                            <>
                                <Navbar />
                                <Profile />
                                <Footer />
                            </>
                        }
                    />

                    <Route
                        path="/my-bookings"
                        element={
                            <>
                                <Navbar />
                                <MyBookings />
                                <Footer />
                            </>
                        }
                    />

                </Route>

                {/* ================= ADMIN LOGIN ================= */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/* ================= ADMIN PROTECTED ================= */}

                <Route element={<AdminProtectedRoute />}>

                    <Route
                        path="/admin/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/admin/users"
                        element={<Users />}
                    />

                    <Route
                        path="/admin/bookings"
                        element={<Bookings />}
                    />

                    <Route
                        path="/admin/gallery"
                        element={<GalleryManagement />}
                    />

                    <Route
                        path="/admin/packages"
                        element={<PackageManagement />}
                    />

                    <Route
                        path="/admin/messages"
                        element={<Messages />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
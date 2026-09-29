import React, { useEffect, useState } from "react";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH USERS =================

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/auth/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch users"
                );
            }

            if (data.success) {
                setUsers(data.users);
            } else {
                setError(
                    data.message || "Unable to load users"
                );
            }
        } catch (error) {
            console.error("Fetch users error:", error);

            setError(
                error.message === "Admin access required."
                    ? "Admin access required."
                    : "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= LOAD USERS =================

    useEffect(() => {
        fetchUsers();
    }, []);

    // ================= DELETE USER =================

    const handleDelete = async (id, role) => {
        // Prevent deleting admin
        if (role === "admin") {
            alert("Admin account cannot be deleted from here.");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/auth/users/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Failed to delete user"
                );
                return;
            }

            alert("User deleted successfully!");

            fetchUsers();
        } catch (error) {
            console.error(
                "Delete user error:",
                error
            );

            alert("Unable to connect to server");
        }
    };

    // ================= ROLE BADGE =================

    const getRoleBadge = (role) => {
        if (role === "admin") {
            return "bg-danger";
        }

        return "bg-primary";
    };

    return (
        <div className="container py-5">

            {/* ================= HEADER ================= */}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">

                <div>
                    <h1 className="fw-bold mb-2">
                        Users
                    </h1>

                    <p className="text-muted mb-0">
                        Manage registered Maha Creative
                        Photography clients.
                    </p>
                </div>

                <button
                    className="btn btn-dark"
                    onClick={fetchUsers}
                >
                    Refresh
                </button>
            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* ================= USER COUNT ================= */}

            {!loading && !error && (
                <div className="mb-3">
                    <span className="badge bg-dark">
                        {users.length} Users
                    </span>
                </div>
            )}

            {/* ================= CARD ================= */}

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    {loading ? (

                        /* ================= LOADING ================= */

                        <div className="text-center py-5">

                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p className="mt-3 text-muted">
                                Loading users...
                            </p>

                        </div>

                    ) : users.length === 0 ? (

                        /* ================= NO USERS ================= */

                        <div className="alert alert-info text-center mb-0">
                            No registered users found.
                        </div>

                    ) : (

                        <>
                            {/* ================================================= */}
                            {/* DESKTOP TABLE */}
                            {/* ================================================= */}

                            <div className="d-none d-md-block">

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Role</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {users.map(
                                                (user, index) => (

                                                    <tr
                                                        key={user._id}
                                                    >

                                                        {/* Number */}

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        {/* Name */}

                                                        <td>
                                                            <strong>
                                                                {user.name}
                                                            </strong>
                                                        </td>

                                                        {/* Email */}

                                                        <td>
                                                            {user.email}
                                                        </td>

                                                        {/* Phone */}

                                                        <td>
                                                            {user.phone}
                                                        </td>

                                                        {/* Role */}

                                                        <td>

                                                            <span
                                                                className={`badge ${getRoleBadge(
                                                                    user.role
                                                                )}`}
                                                            >
                                                                {user.role ===
                                                                "admin"
                                                                    ? "Admin"
                                                                    : "Client"}
                                                            </span>

                                                        </td>

                                                        {/* Action */}

                                                        <td>

                                                            {user.role ===
                                                            "admin" ? (

                                                                <button
                                                                    className="btn btn-sm btn-secondary"
                                                                    disabled
                                                                >
                                                                    Admin
                                                                </button>

                                                            ) : (

                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            user._id,
                                                                            user.role
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>

                                                            )}

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* MOBILE CARD LAYOUT */}
                            {/* ================================================= */}

                            <div className="d-md-none">

                                <div className="d-flex flex-column gap-3">

                                    {users.map(
                                        (user, index) => (

                                            <div
                                                key={user._id}
                                                className="border rounded-3 p-3 shadow-sm"
                                            >

                                                {/* User Header */}

                                                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">

                                                    <div className="d-flex align-items-center gap-2">

                                                        <div
                                                            className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                minWidth: "40px",
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </div>

                                                        <div>

                                                            <div
                                                                className="fw-bold"
                                                                style={{
                                                                    overflowWrap:
                                                                        "anywhere",
                                                                }}
                                                            >
                                                                {user.name}
                                                            </div>

                                                            <small className="text-muted">
                                                                User #{index + 1}
                                                            </small>

                                                        </div>

                                                    </div>

                                                    <span
                                                        className={`badge ${getRoleBadge(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {user.role ===
                                                        "admin"
                                                            ? "Admin"
                                                            : "Client"}
                                                    </span>

                                                </div>


                                                {/* Email */}

                                                <div className="mb-2">

                                                    <small className="text-muted d-block">
                                                        Email
                                                    </small>

                                                    <div
                                                        className="fw-medium"
                                                        style={{
                                                            overflowWrap:
                                                                "anywhere",
                                                        }}
                                                    >
                                                        {user.email}
                                                    </div>

                                                </div>


                                                {/* Phone */}

                                                <div className="mb-3">

                                                    <small className="text-muted d-block">
                                                        Phone
                                                    </small>

                                                    <div>
                                                        {user.phone || "Not provided"}
                                                    </div>

                                                </div>


                                                {/* Action */}

                                                <div className="pt-2 border-top">

                                                    {user.role ===
                                                    "admin" ? (

                                                        <button
                                                            className="btn btn-secondary w-100"
                                                            disabled
                                                        >
                                                            <i className="bi bi-shield-lock me-2"></i>
                                                            Admin Account
                                                        </button>

                                                    ) : (

                                                        <button
                                                            className="btn btn-outline-danger w-100"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user._id,
                                                                    user.role
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-trash me-2"></i>
                                                            Delete User
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Users;
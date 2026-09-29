import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH MESSAGES =================

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch messages"
                );
            }

            if (data.success) {
                setMessages(data.messages);
            } else {
                setError(
                    data.message || "Unable to load messages"
                );
            }
        } catch (error) {
            console.error(
                "Fetch messages error:",
                error
            );

            setError(
                error.message === "Admin access required."
                    ? "Admin access required."
                    : error.message === "Invalid or expired token."
                    ? "Session expired. Please login again."
                    : "Unable to connect to server"
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= LOAD MESSAGES =================

    useEffect(() => {
        fetchMessages();
    }, []);

    // ================= UPDATE STATUS =================

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/messages/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Failed to update message"
                );
                return;
            }

            alert("Message status updated successfully!");

            fetchMessages();
        } catch (error) {
            console.error(
                "Update message error:",
                error
            );

            alert("Unable to connect to server");
        }
    };

    // ================= DELETE MESSAGE =================

    const deleteMessage = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/messages/${id}`,
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
                        "Failed to delete message"
                );
                return;
            }

            alert("Message deleted successfully!");

            fetchMessages();
        } catch (error) {
            console.error(
                "Delete message error:",
                error
            );

            alert("Unable to connect to server");
        }
    };

    // ================= FORMAT DATE =================

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };

    // ================= STATUS BADGE =================

    const getStatusBadge = (status) => {
        return status === "New"
            ? "bg-warning text-dark"
            : "bg-success";
    };

    // ================= RENDER =================

    return (
        <div className="container py-5">

            {/* ================= HEADER ================= */}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">

                <div>
                    <h1 className="fw-bold mb-2">
                        Messages
                    </h1>

                    <p className="text-muted mb-0">
                        Manage messages received from clients.
                    </p>
                </div>

                <button
                    className="btn btn-dark"
                    onClick={fetchMessages}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                </button>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* ================= MESSAGE COUNT ================= */}

            {!loading && !error && (
                <div className="mb-3 d-flex flex-wrap gap-2">

                    <span className="badge bg-dark">
                        {messages.length} Messages
                    </span>

                    <span className="badge bg-warning text-dark">
                        {
                            messages.filter(
                                (item) =>
                                    item.status === "New"
                            ).length
                        }{" "}
                        New
                    </span>

                    <span className="badge bg-success">
                        {
                            messages.filter(
                                (item) =>
                                    item.status === "Read"
                            ).length
                        }{" "}
                        Read
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
                                Loading messages...
                            </p>

                        </div>

                    ) : messages.length === 0 ? (

                        /* ================= NO MESSAGES ================= */

                        <div className="alert alert-info text-center mb-0">
                            No messages found.
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
                                                <th>Subject</th>
                                                <th>Message</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {messages.map(
                                                (item, index) => (

                                                    <tr
                                                        key={item._id}
                                                    >

                                                        {/* Number */}

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        {/* Name */}

                                                        <td>
                                                            <strong>
                                                                {item.name}
                                                            </strong>
                                                        </td>

                                                        {/* Email */}

                                                        <td>
                                                            {item.email}
                                                        </td>

                                                        {/* Phone */}

                                                        <td>
                                                            {item.phone || "-"}
                                                        </td>

                                                        {/* Subject */}

                                                        <td>
                                                            {item.subject || "-"}
                                                        </td>

                                                        {/* Message */}

                                                        <td
                                                            style={{
                                                                minWidth: "250px",
                                                                maxWidth: "350px",
                                                            }}
                                                        >
                                                            {item.message}
                                                        </td>

                                                        {/* Date */}

                                                        <td>
                                                            {formatDate(
                                                                item.createdAt
                                                            )}
                                                        </td>

                                                        {/* Status */}

                                                        <td>

                                                            <span
                                                                className={`badge ${getStatusBadge(
                                                                    item.status
                                                                )}`}
                                                            >
                                                                {item.status}
                                                            </span>

                                                        </td>

                                                        {/* Action */}

                                                        <td>

                                                            <div
                                                                className="d-flex flex-column gap-2"
                                                                style={{
                                                                    minWidth: "120px",
                                                                }}
                                                            >

                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={
                                                                        item.status
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateStatus(
                                                                            item._id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="New">
                                                                        New
                                                                    </option>

                                                                    <option value="Read">
                                                                        Read
                                                                    </option>
                                                                </select>

                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() =>
                                                                        deleteMessage(
                                                                            item._id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>

                                                            </div>

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

                                    {messages.map(
                                        (item, index) => (

                                            <div
                                                key={item._id}
                                                className="border rounded-3 p-3 shadow-sm"
                                            >

                                                {/* Header */}

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
                                                                {item.name}
                                                            </div>

                                                            <small className="text-muted">
                                                                Message #{index + 1}
                                                            </small>

                                                        </div>

                                                    </div>

                                                    <span
                                                        className={`badge ${getStatusBadge(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status}
                                                    </span>

                                                </div>


                                                {/* Email */}

                                                <div className="mb-3">

                                                    <small className="text-muted d-block">
                                                        Email
                                                    </small>

                                                    <div
                                                        style={{
                                                            overflowWrap:
                                                                "anywhere",
                                                        }}
                                                    >
                                                        {item.email}
                                                    </div>

                                                </div>


                                                {/* Phone */}

                                                <div className="mb-3">

                                                    <small className="text-muted d-block">
                                                        Phone
                                                    </small>

                                                    <div>
                                                        {item.phone || "Not provided"}
                                                    </div>

                                                </div>


                                                {/* Subject */}

                                                <div className="mb-3">

                                                    <small className="text-muted d-block">
                                                        Subject
                                                    </small>

                                                    <div className="fw-semibold">
                                                        {item.subject || "-"}
                                                    </div>

                                                </div>


                                                {/* Message */}

                                                <div className="mb-3">

                                                    <small className="text-muted d-block mb-1">
                                                        Message
                                                    </small>

                                                    <div
                                                        className="bg-light rounded p-3"
                                                        style={{
                                                            overflowWrap:
                                                                "anywhere",
                                                            whiteSpace:
                                                                "pre-wrap",
                                                        }}
                                                    >
                                                        {item.message || "-"}
                                                    </div>

                                                </div>


                                                {/* Date */}

                                                <div className="mb-3">

                                                    <small className="text-muted d-block">
                                                        Date
                                                    </small>

                                                    <div>
                                                        {formatDate(
                                                            item.createdAt
                                                        )}
                                                    </div>

                                                </div>


                                                {/* Actions */}

                                                <div className="pt-3 border-top">

                                                    <small className="text-muted d-block mb-2">
                                                        Message Status
                                                    </small>

                                                    <select
                                                        className="form-select mb-2"
                                                        value={
                                                            item.status
                                                        }
                                                        onChange={(e) =>
                                                            updateStatus(
                                                                item._id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="New">
                                                            New
                                                        </option>

                                                        <option value="Read">
                                                            Read
                                                        </option>
                                                    </select>

                                                    <button
                                                        className="btn btn-outline-danger w-100"
                                                        onClick={() =>
                                                            deleteMessage(
                                                                item._id
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash me-2"></i>
                                                        Delete Message
                                                    </button>

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

export default Messages;
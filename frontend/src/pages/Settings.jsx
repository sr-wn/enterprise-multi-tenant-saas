import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const CONFIRM_PHRASE = "DELETE";

function StatusBadge({ status }) {
    const resolved = status === "RESOLVED";
    const color = resolved ? "var(--color-success)" : "var(--color-status-in-progress)";
    const bg = resolved ? "rgba(34,197,94,0.12)" : "rgba(59,130,246,0.12)";
    return (
        <span
            style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color,
                border: `1px solid ${color}`,
                borderRadius: 999,
                padding: "2px 10px",
                backgroundColor: bg,
                whiteSpace: "nowrap",
            }}
        >
            {resolved ? "Resolved" : "In progress"}
        </span>
    );
}

function Settings() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [ticket, setTicket] = useState("");
    const [ticketLoading, setTicketLoading] = useState(false);
    const [ticketSuccess, setTicketSuccess] = useState(null);
    const [ticketError, setTicketError] = useState(null);

    const [myTickets, setMyTickets] = useState([]);
    const [myLoading, setMyLoading] = useState(false);

    const [adminTickets, setAdminTickets] = useState([]);
    const [adminLoading, setAdminLoading] = useState(false);
    const [resolvingId, setResolvingId] = useState(null);

    const isAdmin = user?.role === "ADMIN";

    async function loadMyTickets() {
        setMyLoading(true);
        try {
            const res = await api.get("/support-tickets/mine");
            setMyTickets(res.data);
        } catch {
            /* ignore */
        } finally {
            setMyLoading(false);
        }
    }

    async function loadAdminTickets() {
        setAdminLoading(true);
        try {
            const res = await api.get("/support-tickets");
            setAdminTickets(res.data);
        } catch {
            /* ignore */
        } finally {
            setAdminLoading(false);
        }
    }

    useEffect(() => {
        if (!user) return;
        const timer = setTimeout(() => {
            if (isAdmin) loadAdminTickets();
            else loadMyTickets();
        }, 0);
        return () => clearTimeout(timer);
    }, [user, isAdmin]);

    function openModal() {
        setConfirmText("");
        setError(null);
        setModalOpen(true);
    }

    function closeModal() {
        if (loading) return;
        setModalOpen(false);
        setConfirmText("");
        setError(null);
    }

    async function handleDissolve() {
        if (confirmText !== CONFIRM_PHRASE) return;
        setLoading(true);
        setError(null);
        try {
            await api.delete("/tenants/dissolve");
            logout();
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not dissolve the tenancy. Please try again."
            );
            setLoading(false);
        }
    }

    async function handleSubmitTicket() {
        if (!ticket.trim()) return;
        setTicketLoading(true);
        setTicketError(null);
        setTicketSuccess(null);
        try {
            await api.post("/support-tickets", { issue: ticket.trim() });
            setTicketSuccess("Your ticket has been sent to the admin.");
            setTicket("");
            loadMyTickets();
        } catch (err) {
            setTicketError(
                err.response?.data?.message ||
                "Could not send the ticket. Please try again."
            );
        } finally {
            setTicketLoading(false);
        }
    }

    async function handleResolve(id) {
        setResolvingId(id);
        try {
            await api.patch(`/support-tickets/${id}/resolve`);
            loadAdminTickets();
        } catch {
            /* ignore */
        } finally {
            setResolvingId(null);
        }
    }

    return (
        <Layout>
            <div className="mb-6">
                <h1
                    className="text-primary font-semibold m-0"
                    style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}
                >
                    Account Settings
                </h1>
                <p className="text-secondary m-0 mt-1" style={{ fontSize: "var(--text-sm)" }}>
                    Manage your workspace and account preferences.
                </p>
            </div>

            {!isAdmin && (
                <div className="card p-6">
                    <h2 className="text-primary font-semibold m-0 mb-1" style={{ fontSize: "var(--text-lg)" }}>
                        Contact Admin Support
                    </h2>
                    <p className="text-secondary m-0 mb-4" style={{ fontSize: "var(--text-sm)" }}>
                        Raise an issue with your tenant admin. They'll be notified and can
                        follow up with you directly.
                    </p>

                    <textarea
                        className="input-base"
                        style={{ width: "100%", minHeight: "6.5rem", resize: "vertical" }}
                        placeholder="Describe your issue..."
                        value={ticket}
                        onChange={(e) => setTicket(e.target.value)}
                        aria-label="Describe your issue"
                    />

                    {ticketError && (
                        <p className="m-0 mt-3" style={{ fontSize: "var(--text-sm)", color: "var(--color-error)" }}>
                            {ticketError}
                        </p>
                    )}

                    {ticketSuccess && (
                        <p className="m-0 mt-3" style={{ fontSize: "var(--text-sm)", color: "var(--color-success)" }}>
                            {ticketSuccess}
                        </p>
                    )}

                    <div className="flex items-center justify-end mt-4">
                        <button
                            type="button"
                            className="btn-primary"
                            disabled={!ticket.trim() || ticketLoading}
                            onClick={handleSubmitTicket}
                        >
                            {ticketLoading ? "Sending..." : "Send ticket"}
                        </button>
                    </div>
                </div>
            )}

            {!isAdmin && (
                <div className="card p-6 mt-6">
                    <h2 className="text-primary font-semibold m-0 mb-1" style={{ fontSize: "var(--text-lg)" }}>
                        My support requests
                    </h2>
                    <p className="text-secondary m-0 mb-4" style={{ fontSize: "var(--text-sm)" }}>
                        Track the issues you've raised and their status.
                    </p>

                    {myLoading ? (
                        <p className="text-secondary m-0" style={{ fontSize: "var(--text-sm)" }}>
                            Loading...
                        </p>
                    ) : myTickets.length === 0 ? (
                        <p className="text-secondary m-0" style={{ fontSize: "var(--text-sm)" }}>
                            You haven't raised any support requests yet.
                        </p>
                    ) : (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {myTickets.map((t) => (
                                <li
                                    key={t.id}
                                    className="flex items-start justify-between gap-4"
                                    style={{
                                        padding: "0.875rem 0",
                                        borderBottom: "1px solid var(--color-border-default)",
                                    }}
                                >
                                    <div style={{ minWidth: 0 }}>
                                        <p className="text-primary m-0" style={{ fontSize: "var(--text-sm)" }}>
                                            {t.issue}
                                        </p>
                                        <p className="text-tertiary m-0 mt-1" style={{ fontSize: "var(--text-xs)" }}>
                                            {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
                                        </p>
                                    </div>
                                    <StatusBadge status={t.status} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {isAdmin && (
                <div
                    className="card p-6"
                    style={{ borderColor: "var(--color-status-overdue)" }}
                >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-primary font-semibold m-0 mb-1" style={{ fontSize: "var(--text-lg)" }}>
                                Dissolve tenancy
                            </h2>
                            <p className="text-secondary m-0" style={{ fontSize: "var(--text-sm)", maxWidth: "42rem" }}>
                                Permanently delete this entire workspace — all projects, tasks,
                                comments, activity history, notifications, and user accounts.
                                This action is <strong>irreversible</strong> and cannot be undone.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="btn-secondary"
                            style={{
                                color: "var(--color-error)",
                                borderColor: "var(--color-status-overdue)",
                            }}
                            onClick={openModal}
                        >
                            Dissolve tenancy
                        </button>
                    </div>
                </div>
            )}

            {isAdmin && (
                <div className="card p-6 mt-6">
                    <h2 className="text-primary font-semibold m-0 mb-1" style={{ fontSize: "var(--text-lg)" }}>
                        Support tickets
                    </h2>
                    <p className="text-secondary m-0 mb-4" style={{ fontSize: "var(--text-sm)" }}>
                        Review issues raised by your team and mark them resolved.
                    </p>

                    {adminLoading ? (
                        <p className="text-secondary m-0" style={{ fontSize: "var(--text-sm)" }}>
                            Loading...
                        </p>
                    ) : adminTickets.length === 0 ? (
                        <p className="text-secondary m-0" style={{ fontSize: "var(--text-sm)" }}>
                            No support tickets yet. When a member of your workspace raises one
                            from their Settings page, it will appear here with a Resolve button.
                        </p>
                    ) : (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {adminTickets.map((t) => (
                                <li
                                    key={t.id}
                                    className="flex items-start justify-between gap-4"
                                    style={{
                                        padding: "0.875rem 0",
                                        borderBottom: "1px solid var(--color-border-default)",
                                    }}
                                >
                                    <div style={{ minWidth: 0 }}>
                                        <p className="text-primary m-0" style={{ fontSize: "var(--text-sm)" }}>
                                            {t.issue}
                                        </p>
                                        <p className="text-tertiary m-0 mt-1" style={{ fontSize: "var(--text-xs)" }}>
                                            From {t.requesterName} ({t.requesterEmail}) ·{" "}
                                            {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <StatusBadge status={t.status} />
                                        {t.status !== "RESOLVED" && (
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                disabled={resolvingId === t.id}
                                                onClick={() => handleResolve(t.id)}
                                            >
                                                {resolvingId === t.id ? "Resolving..." : "Resolve"}
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {modalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={closeModal}
                >
                    <div
                        className="card p-6 w-full max-w-md"
                        style={{ borderColor: "var(--color-status-overdue)" }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dissolve-title"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span
                                className="flex items-center justify-center rounded-lg"
                                style={{
                                    width: 36,
                                    height: 36,
                                    backgroundColor: "rgba(239,68,68,0.12)",
                                    color: "var(--color-error)",
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </span>
                            <h3 id="dissolve-title" className="text-primary font-semibold m-0" style={{ fontSize: "var(--text-lg)" }}>
                                Dissolve this tenancy?
                            </h3>
                        </div>

                        <p className="text-secondary m-0 mb-4" style={{ fontSize: "var(--text-sm)" }}>
                            This will permanently delete <strong>everything</strong> in your
                            workspace. To confirm, type <strong className="text-primary">{CONFIRM_PHRASE}</strong> below.
                        </p>

                        <input
                            className="input-base"
                            placeholder={CONFIRM_PHRASE}
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            autoFocus
                            aria-label={`Type ${CONFIRM_PHRASE} to confirm`}
                        />

                        {error && (
                            <p className="m-0 mt-3" style={{ fontSize: "var(--text-sm)", color: "var(--color-error)" }}>
                                {error}
                            </p>
                        )}

                        <div className="flex items-center justify-end gap-3 mt-5">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={closeModal}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn-primary"
                                style={{
                                    backgroundColor: "var(--color-error)",
                                }}
                                disabled={confirmText !== CONFIRM_PHRASE || loading}
                                onClick={handleDissolve}
                            >
                                {loading ? "Dissolving..." : "Permanently dissolve"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Settings;

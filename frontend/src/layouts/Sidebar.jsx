import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";


const NAV_ITEMS = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        to: "/projects",
        label: "Projects",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
        ),
    },
    {
        to: "/tasks",
        label: "Tasks",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
        ),
    },
    {
        to: "/users",
        label: "Users",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
    },
    {
        to: "/notifications",
        label: "Notifications",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
        ),
    },
];


function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [unreadCount, setUnreadCount] = useState(0);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("tena-theme") === "dark";
        }
        return false;
    });

    // Apply dark mode class to <html>
    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("tena-theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("tena-theme", "light");
        }
    }, [darkMode]);

    // Load notification count
    useEffect(() => {
        if (!user) return;

        async function loadUnreadCount() {
            try {
                const response = await api.get("/notifications/count");
                setUnreadCount(response.data.unreadCount || 0);
            } catch (error) {
                console.log(error);
            }
        }

        loadUnreadCount();

        const handleNotificationRefresh = () => {
            loadUnreadCount();
        };

        window.addEventListener("notificationsRead", handleNotificationRefresh);
        return () => window.removeEventListener("notificationsRead", handleNotificationRefresh);
    }, [user]);


    return (
        <aside
            className={`
                fixed top-0 left-0 z-50 h-full w-60
                surface-sidebar
                border-r border-default
                flex flex-col
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}
        >
            {/* Brand */}
            <div className="flex items-center justify-between h-14 px-5 border-b border-default flex-shrink-0">
                <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
                    <BrandLogo size="var(--text-lg)" dotSize={5} />
                </Link>

                {/* Mobile close */}
                <button
                    onClick={onClose}
                    className="btn-ghost p-1 md:hidden"
                    aria-label="Close sidebar"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.to;
                    const isNotification = item.to === "/notifications";

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg
                                text-sm font-medium no-underline
                                transition-fast
                                ${isActive
                                    ? "text-white"
                                    : "text-secondary hover:text-primary"
                                }
                            `}
                            style={isActive ? {
                                backgroundColor: "var(--color-accent-600)",
                                color: "white",
                            } : undefined}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = "var(--color-surface-elevated)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = "";
                                }
                            }}
                        >
                            <span className="flex-shrink-0 opacity-80">{item.icon}</span>
                            <span className="flex-1">{item.label}</span>

                            {isNotification && unreadCount > 0 && (
                                <span
                                    className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full text-white"
                                    style={{ backgroundColor: "var(--color-accent-600)" }}
                                >
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer: Theme toggle + shortcut hint */}
            <div className="px-3 pb-4 space-y-2 flex-shrink-0">
                {/* Dark mode toggle */}
                <button
                    onClick={() => setDarkMode(prev => !prev)}
                    className="btn-ghost w-full justify-start gap-3 px-3 py-2 text-sm"
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {darkMode ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                    )}
                    <span>{darkMode ? "Light mode" : "Dark mode"}</span>
                </button>

                {/* Keyboard shortcut hint */}
                <div className="flex items-center gap-2 px-3 py-1.5 text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                    <kbd className="px-1.5 py-0.5 rounded border border-default text-tertiary" style={{ fontSize: "10px", fontFamily: "var(--font-sans)" }}>
                        ⌘K
                    </kbd>
                    <span>Quick navigation</span>
                </div>
            </div>
        </aside>
    );
}


export default Sidebar;
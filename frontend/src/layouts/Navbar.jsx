import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const PAGE_TITLES = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/tasks": "My Tasks",
    "/users": "Users",
    "/notifications": "Notifications",
};


function Navbar({ onMenuToggle }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const pageTitle = PAGE_TITLES[location.pathname] || "Tena";

    function handleLogout() {
        logout();
        navigate("/login");
    }

    // Get user initials
    const initials = user?.fullName
        ? user.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
        : user?.sub?.[0]?.toUpperCase() || "U";

    return (
        <header
            className="sticky top-0 z-30 h-14 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 border-b border-default surface-canvas"
            style={{ backdropFilter: "blur(8px)", backgroundColor: "color-mix(in srgb, var(--color-surface-canvas) 85%, transparent)" }}
        >
            {/* Left: Hamburger + Title */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    className="btn-ghost p-1.5 md:hidden"
                    aria-label="Toggle sidebar"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <h1
                    className="text-primary font-semibold tracking-tight m-0"
                    style={{ fontSize: "var(--text-lg)" }}
                >
                    {pageTitle}
                </h1>
            </div>

            {/* Right: Search trigger + User + Logout */}
            <div className="flex items-center gap-2">
                {/* Cmd+K search trigger */}
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
                    className="btn-ghost hidden sm:flex items-center gap-2 px-2.5 py-1.5 border border-default radius-md"
                    style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>Search...</span>
                    <kbd className="ml-2 px-1.5 py-0.5 rounded border border-default" style={{ fontSize: "10px", fontFamily: "var(--font-sans)" }}>
                        ⌘K
                    </kbd>
                </button>

                {/* User info */}
                <div className="flex items-center gap-2 px-2">
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                        style={{ backgroundColor: "var(--color-accent-600)" }}
                    >
                        {initials}
                    </div>
                    <div className="hidden lg:block">
                        <div className="text-primary font-medium leading-tight" style={{ fontSize: "var(--text-sm)" }}>
                            {user?.fullName || user?.sub || "User"}
                        </div>
                        <div className="text-tertiary leading-tight" style={{ fontSize: "var(--text-xs)" }}>
                            {user?.role || "Member"}
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="btn-ghost text-secondary"
                    style={{ fontSize: "var(--text-sm)" }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}


export default Navbar;
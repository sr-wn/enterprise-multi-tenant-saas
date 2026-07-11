import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS = [
    { id: "nav-dashboard", title: "Go to Dashboard", icon: "layout", type: "navigation", to: "/dashboard" },
    { id: "nav-projects", title: "Go to Projects", icon: "folder", type: "navigation", to: "/projects" },
    { id: "nav-tasks", title: "Go to Tasks", icon: "check-square", type: "navigation", to: "/tasks" },
    { id: "nav-users", title: "Go to Users", icon: "users", type: "navigation", to: "/users" },
    { id: "nav-notifications", title: "Go to Notifications", icon: "bell", type: "navigation", to: "/notifications" },
    { id: "action-create-task", title: "Create Task", icon: "plus", type: "action", action: "create-task" },
    { id: "action-toggle-theme", title: "Toggle Theme", icon: "moon", type: "action", action: "toggle-theme" },
];

function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Filter items based on query
    const filteredItems = ITEMS.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.type.toLowerCase().includes(query.toLowerCase())
    );

    // Global keyboard listener
    useEffect(() => {
        function handleKeyDown(e) {
            // Cmd+K (Mac) or Ctrl+K (Windows)
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(open => !open);
            }
            
            // Escape to close
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        }

        // Custom event listener for buttons that trigger the palette
        function handleCustomOpen() {
            setIsOpen(true);
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("open-command-palette", handleCustomOpen);
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("open-command-palette", handleCustomOpen);
        };
    }, [isOpen]);

    // Reset state and focus input when opened
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery("");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedIndex(0);
            // Small delay to ensure render before focus
            setTimeout(() => inputRef.current?.focus(), 10);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Handle navigation within palette
    function handleKeyDown(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === "Enter" && filteredItems.length > 0) {
            e.preventDefault();
            executeItem(filteredItems[selectedIndex]);
        }
    }

    function executeItem(item) {
        setIsOpen(false);
        if (item.type === "navigation") {
            navigate(item.to);
        } else if (item.type === "action") {
            if (item.action === "create-task") {
                window.dispatchEvent(new Event("open-create-task"));
            } else if (item.action === "toggle-theme") {
                const isDark = document.documentElement.classList.toggle("dark");
                localStorage.setItem("theme", isDark ? "dark" : "light");
            }
        }
    }

    // Render SVG icons based on id
    function getIcon(iconId) {
        const props = {
            width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", 
            stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round",
            className: "text-secondary flex-shrink-0"
        };
        
        switch (iconId) {
            case "layout": return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
            case "folder": return <svg {...props}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>;
            case "check-square": return <svg {...props}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>;
            case "users": return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
            case "bell": return <svg {...props}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
            case "plus": return <svg {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
            case "moon": return <svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;
            default: return <svg {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 dark:bg-black/60" 
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
            
            {/* Modal */}
            <div 
                className="relative w-full max-w-xl surface-elevated rounded-xl shadow-overlay overflow-hidden animate-slide-up border border-default"
                role="dialog"
                aria-modal="true"
            >
                {/* Search Input */}
                <div className="flex items-center px-4 border-b border-default">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary mr-3 flex-shrink-0">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={inputRef}
                        className="w-full bg-transparent border-none py-4 outline-none text-primary placeholder:text-tertiary focus:ring-0"
                        style={{ fontSize: "var(--text-lg)" }}
                        placeholder="Search for commands, navigation..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-tertiary hover:text-secondary rounded ml-2 flex-shrink-0"
                    >
                        <kbd className="px-1.5 py-0.5 rounded border border-default text-xs font-sans">esc</kbd>
                    </button>
                </div>

                {/* Results List */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-secondary">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <ul className="m-0 p-0 list-none">
                            {filteredItems.map((item, index) => {
                                const isSelected = index === selectedIndex;
                                return (
                                    <li key={item.id}>
                                        <button
                                            className={`
                                                w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-fast text-left
                                                ${isSelected ? 'bg-accent-50 dark:bg-accent-50/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                                            `}
                                            onClick={() => executeItem(item)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div 
                                                className={`p-2 rounded-md ${isSelected ? 'bg-white dark:bg-white/10 shadow-sm' : 'bg-black/5 dark:bg-white/5'}`}
                                            >
                                                {getIcon(item.icon)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div 
                                                    className={`font-medium truncate ${isSelected ? 'text-accent-700 dark:text-accent-200' : 'text-primary'}`}
                                                    style={{ fontSize: "var(--text-sm)" }}
                                                >
                                                    {item.title}
                                                </div>
                                                <div className="text-tertiary text-xs capitalize truncate">
                                                    {item.type}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="flex-shrink-0 text-accent-600">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="9 18 15 12 9 6" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                
                {/* Footer hints */}
                <div className="flex items-center gap-4 px-4 py-2 border-t border-default surface-canvas text-tertiary" style={{ fontSize: "11px" }}>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 rounded bg-black/5 border border-default font-sans">↑</kbd>
                        <kbd className="px-1 rounded bg-black/5 border border-default font-sans">↓</kbd>
                        to navigate
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1 rounded bg-black/5 border border-default font-sans">enter</kbd>
                        to select
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CommandPalette;

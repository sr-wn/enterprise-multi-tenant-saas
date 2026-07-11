import { useEffect, useState } from "react";
import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/notifications", {
          params: { page, size },
        });

        setNotifications(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        console.log(error);
        setError("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [page]);

  async function markAsRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      // Update local state optimisticly instead of full reload for snappier feel
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, readStatus: true } : n)
      );
      window.dispatchEvent(new Event("notificationsRead"));
    } catch (error) {
      console.log(error);
      setError("Unable to mark notification as read.");
    }
  }

  function formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins || 1}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  return (
    <Layout>
      <h1 className="text-primary font-semibold mb-6 m-0" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
        Notifications
      </h1>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "var(--color-error)", fontSize: "var(--text-sm)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="space-y-3 max-w-3xl">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="card overflow-hidden max-w-3xl">
          
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-default surface-canvas">
            <div className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              {totalElements} notification{totalElements !== 1 ? 's' : ''}
            </div>
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-tertiary mb-3 flex justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </div>
              <p className="text-secondary font-medium mb-1 m-0" style={{ fontSize: "var(--text-base)" }}>
                You're all caught up
              </p>
              <p className="text-tertiary m-0" style={{ fontSize: "var(--text-sm)" }}>
                No new notifications at this time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-default">
              {notifications.map((notification) => {
                const isUnread = !notification.readStatus;
                return (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-4 p-4 transition-fast ${isUnread ? 'bg-accent-50/30 dark:bg-accent-50/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                  >
                    {/* Unread dot */}
                    <div className="pt-1.5 flex-shrink-0 w-2">
                      {isUnread && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-accent-600)" }} />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div 
                        className={`mb-1 ${isUnread ? 'text-primary font-medium' : 'text-secondary'}`}
                        style={{ fontSize: "var(--text-sm)" }}
                      >
                        {notification.message}
                      </div>
                      <div className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                        {formatTime(notification.createdAt)}
                      </div>
                    </div>
                    
                    {/* Action */}
                    {isUnread && (
                      <button
                        className="btn-ghost py-1 px-2 text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 md:opacity-100"
                        onClick={() => markAsRead(notification.id)}
                        aria-label="Mark as read"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Mark read
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-default surface-canvas">
              <button
                className="btn-secondary py-1 px-3 text-xs"
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </button>
              <span className="text-secondary text-sm">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn-secondary py-1 px-3 text-xs"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default Notifications;

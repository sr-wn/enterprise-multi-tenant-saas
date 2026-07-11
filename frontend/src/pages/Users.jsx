import { useContext, useEffect, useState } from "react";
import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Users() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");
  
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      if (!user || user.role !== "ADMIN") {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users", {
          params: { page, size },
        });
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        console.log(error);
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [user, page, size]);

  async function createUser(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(true);

    try {
      await api.post("/users", {
        fullName,
        email,
        password,
        role,
      });

      setSubmitSuccess("User created successfully.");
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("MEMBER");
      setError(null);

      const response = await api.get("/users", {
        params: { page, size },
      });
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.log(error);
      const responseData = error.response?.data;
      if (responseData?.messages) {
        setSubmitError(responseData.messages);
      } else {
        setSubmitError(responseData?.message || "Unable to create user.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteUser(userId, name) {
    if (!window.confirm(`Delete ${name}? Their tasks will be reassigned to you. This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/users/${userId}`);
      const response = await api.get("/users", { params: { page, size } });
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to delete user.");
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="space-y-4">
          <div className="skeleton h-8 w-40" />
          <div className="skeleton h-[400px] rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <Layout>
        <h1 className="text-primary font-semibold mb-6 m-0" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
          Users
        </h1>
        <div className="card p-12 text-center">
          <div className="text-tertiary mb-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <p className="text-secondary font-medium mb-1 m-0" style={{ fontSize: "var(--text-base)" }}>
            Access Denied
          </p>
          <p className="text-tertiary m-0" style={{ fontSize: "var(--text-sm)" }}>
            Only workspace administrators can manage users.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-primary font-semibold mb-6 m-0" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
        Users
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create form (left col on desktop) */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="text-primary font-medium mb-4 m-0" style={{ fontSize: "var(--text-base)" }}>
              Invite User
            </h2>

            {submitSuccess && (
              <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg" style={{ backgroundColor: "rgba(34,197,94,0.08)", color: "var(--color-success)", fontSize: "var(--text-sm)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{submitSuccess}</span>
              </div>
            )}
            
            {submitError && (
              <div className="flex items-start gap-2 px-3 py-2.5 mb-4 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "var(--color-error)", fontSize: "var(--text-sm)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <div className="flex-1 space-y-1">
                  {Array.isArray(submitError) || typeof submitError === "object" ? (
                    Object.entries(submitError).map(([field, message]) => (
                      <p key={field} className="m-0">{field}: {message}</p>
                    ))
                  ) : (
                    <p className="m-0">{submitError}</p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={createUser} className="space-y-3">
              <input
                className="input-base"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                className="input-base"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="input-base"
                placeholder="Temporary Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <select
                className="input-base"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="MEMBER">Member</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? "Inviting..." : "Invite User"}
              </button>
            </form>
          </div>
        </div>

        {/* User list (right cols on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-lg" />
              ))}
            </div>
          )}

          {error && <p className="text-red-600 m-0">{error}</p>}

          {!loading && !error && (
            <div className="card overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-default surface-canvas">
                <div className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                  {totalElements} user{totalElements !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>Show:</span>
                  <select
                    className="input-base py-1 px-2 h-auto text-sm w-auto"
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      setPage(0);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* List */}
              {users.length === 0 ? (
                 <div className="p-8 text-center text-secondary">No users found.</div>
              ) : (
                <div className="divide-y divide-default">
                  {users.map((userItem) => {
                    const initials = userItem.fullname
                      ? userItem.fullname.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                      : "U";
                      
                    return (
                      <div key={userItem.id} className="flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-fast">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                          style={{ backgroundColor: "var(--color-accent-600)" }}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-primary font-medium truncate" style={{ fontSize: "var(--text-sm)" }}>
                            {userItem.fullname}
                          </div>
                          <div className="text-secondary truncate" style={{ fontSize: "var(--text-sm)" }}>
                            {userItem.email}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black/5 dark:bg-white/10 text-secondary">
                            {userItem.role}
                          </span>
                          {userItem.email !== user.sub && (
                            <button
                              onClick={() => deleteUser(userItem.id, userItem.fullname)}
                              className="btn-ghost p-1.5"
                              style={{ color: "var(--color-error)" }}
                              aria-label={`Delete ${userItem.fullname}`}
                              title="Delete user"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          )}
                        </div>
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
          
        </div>
      </div>
    </Layout>
  );
}

export default Users;

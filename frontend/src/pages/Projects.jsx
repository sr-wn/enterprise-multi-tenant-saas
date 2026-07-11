import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";


function Projects() {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === "ADMIN";

    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProjects();
        if (isAdmin) loadMembers();
    }, [isAdmin]);

    async function loadProjects() {
        setLoading(true);
        try {
            const response = await api.get("/projects", { params: { size: 100 } });
            setProjects(response.data.content);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function loadMembers() {
        try {
            const response = await api.get("/users", { params: { page: 0, size: 100 } });
            setMembers(response.data.content);
        } catch (error) {
            console.log(error);
        }
    }

    async function createProject(e) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await api.post("/projects", {
                name,
                description,
                assignedUserId: assignedUserId ? Number(assignedUserId) : null,
            });
            setName("");
            setDescription("");
            setAssignedUserId("");
            loadProjects();
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Unable to create project.");
        } finally {
            setSubmitting(false);
        }
    }

    async function deleteProject(id, projectName) {
        if (!window.confirm(`Delete "${projectName}" and all its tasks? This cannot be undone.`)) return;
        try {
            await api.delete(`/projects/${id}`);
            loadProjects();
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Unable to delete project.");
        }
    }

    return (
        <Layout>
            <h1
                className="text-primary font-semibold mb-6 m-0"
                style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}
            >
                Projects
            </h1>

            {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "var(--color-error)", fontSize: "var(--text-sm)" }}>
                    {error}
                </div>
            )}

            {/* Create form — admin only */}
            {isAdmin && (
                <form onSubmit={createProject} className="card p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            className="input-base sm:flex-1"
                            placeholder="Project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            className="input-base sm:flex-1"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <select
                            className="input-base sm:w-52"
                            value={assignedUserId}
                            onChange={(e) => setAssignedUserId(e.target.value)}
                        >
                            <option value="">Assign to member…</option>
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>{m.fullname}</option>
                            ))}
                        </select>
                        <button type="submit" className="btn-primary whitespace-nowrap" disabled={submitting}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            {submitting ? "Creating…" : "Create"}
                        </button>
                    </div>
                </form>
            )}

            {/* Loading */}
            {loading && (
                <div className="grid gap-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="skeleton h-20 rounded-lg" />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && projects.length === 0 && (
                <div className="card p-12 text-center">
                    <div className="text-tertiary mb-3">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                        </svg>
                    </div>
                    <p className="text-secondary font-medium mb-1 m-0" style={{ fontSize: "var(--text-base)" }}>
                        {isAdmin ? "No projects yet" : "No projects assigned to you"}
                    </p>
                    <p className="text-tertiary m-0" style={{ fontSize: "var(--text-sm)" }}>
                        {isAdmin ? "Create your first project to get started." : "Your admin hasn't assigned you a project yet."}
                    </p>
                </div>
            )}

            {/* List */}
            {!loading && projects.length > 0 && (
                <div className="grid gap-3">
                    {projects.map(project => (
                        <div key={project.id} className="card p-5 transition-fast flex items-start justify-between gap-4">
                            <Link to={`/projects/${project.id}`} className="flex-1 min-w-0 no-underline">
                                <h2
                                    className="text-primary font-medium m-0 mb-1"
                                    style={{ fontSize: "var(--text-lg)" }}
                                >
                                    {project.name}
                                </h2>
                                <p className="text-secondary m-0 mb-3" style={{ fontSize: "var(--text-sm)" }}>
                                    {project.description || "No description"}
                                </p>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="pill status-in-progress">
                                        {project.taskCount} task{project.taskCount !== 1 ? "s" : ""}
                                    </span>
                                    {project.assignedTo ? (
                                        <span className="flex items-center gap-1.5 text-secondary" style={{ fontSize: "var(--text-xs)" }}>
                                            <span
                                                className="inline-flex items-center justify-center rounded-full text-white font-medium"
                                                style={{ width: 18, height: 18, fontSize: "9px", backgroundColor: "var(--color-accent-600)" }}
                                            >
                                                {project.assignedTo.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                            </span>
                                            {project.assignedTo}
                                        </span>
                                    ) : (
                                        <span className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>Unassigned</span>
                                    )}
                                </div>
                            </Link>
                            {isAdmin && (
                                <button
                                    onClick={() => deleteProject(project.id, project.name)}
                                    className="btn-ghost p-1.5 flex-shrink-0"
                                    style={{ color: "var(--color-error)" }}
                                    aria-label={`Delete ${project.name}`}
                                    title="Delete project"
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
                    ))}
                </div>
            )}
        </Layout>
    );
}


export default Projects;

import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import TaskComments from "../components/TaskComments.jsx";
import TaskAttachments from "../components/TaskAttachments.jsx";
import TaskActivity from "../components/TaskActivity.jsx";

function StatusPill({ status }) {
    const map = {
        TODO: { cls: "status-todo", label: "To Do", icon: "○" },
        IN_PROGRESS: { cls: "status-in-progress", label: "In Progress", icon: "▶" },
        DONE: { cls: "status-done", label: "Done", icon: "✓" },
    };
    const s = map[status] || map.TODO;
    return (
        <span className={`pill ${s.cls}`}>
            <span aria-hidden="true">{s.icon}</span>
            {s.label}
        </span>
    );
}

function PriorityDot({ priority }) {
    const map = {
        LOW: { cls: "priority-low", label: "Low" },
        MEDIUM: { cls: "priority-medium", label: "Medium" },
        HIGH: { cls: "priority-high", label: "High" },
    };
    const p = map[priority] || map.LOW;
    return (
        <span className="flex items-center gap-1.5" style={{ fontSize: "var(--text-xs)" }}>
            <span className={`priority-dot ${p.cls}`} aria-hidden="true" />
            <span className="text-secondary">{p.label}</span>
        </span>
    );
}

function ProjectDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === "ADMIN";
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [expandedTask, setExpandedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        async function loadProject() {
            setLoading(true);
            setError(null);
            try {
                const [projectRes, tasksRes] = await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get(`/projects/${id}/tasks`, { params: { size: 100 } })
                ]);
                setProject(projectRes.data);
                setTasks(tasksRes.data.content || []);
            } catch (err) {
                console.error(err);
                setError("Unable to load project details.");
            } finally {
                setLoading(false);
            }
        }
        loadProject();
    }, [id, user]);

    async function deleteProject() {
        if (!window.confirm(`Delete "${project.name}" and all its tasks? This cannot be undone.`)) return;
        try {
            await api.delete(`/projects/${id}`);
            navigate("/projects");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to delete project.");
        }
    }

    async function deleteTask(taskId, taskTitle) {
        if (!window.confirm(`Delete "${taskTitle}"? This cannot be undone.`)) return;
        const prev = tasks;
        setTasks(prev.filter(t => t.id !== taskId));
        try {
            await api.delete(`/tasks/${taskId}`);
        } catch (err) {
            console.error(err);
            setTasks(prev);
        }
    }

    if (!user) return <Layout><div className="skeleton h-8 w-40 mb-6" /><div className="skeleton h-64 rounded-lg" /></Layout>;

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center gap-2 mb-6">
                    <div className="skeleton h-8 w-24" />
                    <div className="text-tertiary">/</div>
                    <div className="skeleton h-8 w-48" />
                </div>
                <div className="skeleton h-32 rounded-lg mb-6" />
                <div className="space-y-3">
                    <div className="skeleton h-16 rounded-lg" />
                    <div className="skeleton h-16 rounded-lg" />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="card p-12 text-center text-error">{error}</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link to="/projects" className="text-secondary hover:text-primary no-underline transition-fast">Projects</Link>
                <span className="text-tertiary">/</span>
                <span className="text-primary font-medium truncate">{project.name}</span>
            </div>

            <div className="card p-6 mb-8 border-l-4" style={{ borderLeftColor: 'var(--color-accent)' }}>
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-primary font-semibold m-0 mb-2" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
                            {project.name}
                        </h1>
                        <p className="text-secondary m-0 mb-4" style={{ fontSize: "var(--text-sm)" }}>
                            {project.description || "No description provided."}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                            <span>Created by {project.createdBy}</span>
                            {project.assignedTo ? (
                                <span className="flex items-center gap-1.5 text-secondary">
                                    <span
                                        className="inline-flex items-center justify-center rounded-full text-white font-medium"
                                        style={{ width: 18, height: 18, fontSize: "9px", backgroundColor: "var(--color-accent-600)" }}
                                    >
                                        {project.assignedTo.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                    </span>
                                    {project.assignedTo}
                                </span>
                            ) : (
                                <span>Unassigned</span>
                            )}
                            {project.createdAt && (
                                <span>• {new Date(project.createdAt).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={deleteProject}
                            className="btn-ghost p-2 flex-shrink-0"
                            style={{ color: "var(--color-error)" }}
                            aria-label="Delete project"
                            title="Delete project"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <h2 className="text-primary font-medium mb-4 m-0" style={{ fontSize: "var(--text-lg)" }}>
                Project Tasks ({tasks.length})
            </h2>

            {tasks.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-secondary font-medium m-0">No tasks found for this project.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {tasks.map(task => (
                        <div key={task.id} className="card overflow-hidden">
                            <div className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <h3 className="text-primary font-medium m-0 mb-1" style={{ fontSize: "var(--text-base)" }}>
                                            {task.title}
                                        </h3>
                                        <p className="text-secondary m-0" style={{ fontSize: "var(--text-sm)" }}>
                                            {task.assignedUserEmail ? `Assigned to ${task.assignedUserEmail}` : "Unassigned"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <PriorityDot priority={task.priority} />
                                        <StatusPill status={task.status} />
                                        <button
                                            className="btn-ghost py-1.5 px-3 text-xs"
                                            onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                                        >
                                            {expandedTask === task.id ? "Hide" : "Details"}
                                        </button>
                                        {isAdmin && (
                                            <button
                                                className="btn-ghost p-1.5 text-xs"
                                                style={{ color: "var(--color-error)" }}
                                                onClick={() => deleteTask(task.id, task.title)}
                                                aria-label={`Delete ${task.title}`}
                                                title="Delete task"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                    <line x1="10" y1="11" x2="10" y2="17" />
                                                    <line x1="14" y1="11" x2="14" y2="17" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {expandedTask === task.id && (
                                <div className="px-5 pb-5 border-t border-default pt-4 space-y-4">
                                    <TaskComments taskId={task.id} />
                                    <TaskAttachments taskId={task.id} />
                                    <TaskActivity taskId={task.id} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}

export default ProjectDetails;

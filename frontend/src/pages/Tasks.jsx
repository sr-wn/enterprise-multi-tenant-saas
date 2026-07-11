import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import TaskComments from "../components/TaskComments.jsx";
import TaskAttachments from "../components/TaskAttachments.jsx";
import TaskActivity from "../components/TaskActivity.jsx";

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

function Tasks() {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === "ADMIN";
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectId, setProjectId] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [priority, setPriority] = useState("LOW");
    const [dueDate, setDueDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedTask, setExpandedTask] = useState(null);
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'board'

    // Inline editing state
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingField, setEditingField] = useState(null); // 'title' or 'description'
    const [editValue, setEditValue] = useState("");
    const editInputRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        async function loadPageData() {
            setLoading(true);
            setError(null);
            try {
                await Promise.all([loadUsers(), loadProjects(), loadTasks()]);
            } catch (err) {
                setError("Unable to load tasks.");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        loadPageData();
    }, [user, isAdmin]);

    // Focus input when editing starts
    useEffect(() => {
        if (editingTaskId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingTaskId]);

    async function loadUsers() {
        try {
            const response = await api.get("/users", { params: { page: 0, size: 100 } });
            setUsers(response.data.content);
        } catch (error) { console.log(error); }
    }

    async function loadProjects() {
        try {
            const response = await api.get("/projects", { params: { page: 0, size: 100 } });
            setProjects(response.data.content);
        } catch (error) { console.log(error); }
    }

    async function loadTasks() {
        try {
            const endpoint = isAdmin ? "/tasks" : "/tasks/my";
            const response = await api.get(endpoint, { params: { page: 0, size: 100 } });
            setTasks(response.data.content);
        } catch (error) { console.log(error); }
    }

    async function updateStatus(taskId, status) {
        // Optimistic UI update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
        try {
            await api.patch(`/tasks/${taskId}/status`, { status });
        } catch (error) {
            console.log(error);
            loadTasks(); // Revert on failure
        }
    }

    async function deleteTask(taskId, taskTitle) {
        if (!window.confirm(`Delete "${taskTitle}"? This cannot be undone.`)) return;
        const prev = tasks;
        setTasks(prev.filter(t => t.id !== taskId));
        try {
            await api.delete(`/tasks/${taskId}`);
        } catch (error) {
            console.log(error);
            setTasks(prev); // revert
        }
    }

    async function saveInlineEdit(taskId) {
        if (!editingTaskId || !editingField) return;
        
        const task = tasks.find(t => t.id === taskId);
        if (task && task[editingField] !== editValue) {
            // Optimistic update
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [editingField]: editValue } : t));
            try {
                await api.patch(`/tasks/${taskId}`, { [editingField]: editValue });
            } catch (error) {
                console.log("Failed to update task", error);
                loadTasks(); // revert
            }
        }
        setEditingTaskId(null);
        setEditingField(null);
    }

    function startEdit(task, field) {
        setEditingTaskId(task.id);
        setEditingField(field);
        setEditValue(task[field] || "");
    }

    async function createTask(e) {
        e.preventDefault();
        try {
            await api.post("/tasks", {
                title, description, projectId: Number(projectId),
                assignedUserId: Number(assignedUserId), priority, dueDate,
            });
            setTitle(""); setDescription(""); setProjectId("");
            setAssignedUserId(""); setPriority("LOW"); setDueDate("");
            loadTasks();
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Unable to create task.");
        }
    }

    function isOverdue(dateStr) {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date() && true;
    }

    // Drag and drop handlers for Kanban board
    function handleDragStart(e, taskId) {
        e.dataTransfer.setData("taskId", taskId);
    }
    function handleDragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
    }
    function handleDrop(e, status) {
        e.preventDefault();
        const taskId = Number(e.dataTransfer.getData("taskId"));
        if (taskId) {
            updateStatus(taskId, status);
        }
    }

    if (!user) {
        return (
            <Layout>
                <div className="space-y-4">
                    <div className="skeleton h-8 w-40" />
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-lg" />)}
                </div>
            </Layout>
        );
    }

    const renderEditableField = (task, field, className, style) => {
        if (editingTaskId === task.id && editingField === field) {
            if (field === 'description') {
                return (
                    <textarea 
                        ref={editInputRef}
                        className="input-base w-full p-1 -ml-1 text-sm bg-black/5 dark:bg-white/5 border-transparent focus:border-accent-500"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => saveInlineEdit(task.id)}
                        onKeyDown={e => {
                            if (e.key === 'Escape') {
                                setEditingTaskId(null); setEditingField(null);
                            }
                        }}
                    />
                );
            }
            return (
                <input 
                    ref={editInputRef}
                    className="input-base w-full p-1 -ml-1 text-sm bg-black/5 dark:bg-white/5 border-transparent focus:border-accent-500"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => saveInlineEdit(task.id)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') saveInlineEdit(task.id);
                        if (e.key === 'Escape') {
                            setEditingTaskId(null); setEditingField(null);
                        }
                    }}
                />
            );
        }
        return (
            <div 
                className={`${className} cursor-text hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 -ml-1 transition-fast min-h-[20px]`}
                style={style}
                onClick={() => startEdit(task, field)}
                title="Click to edit"
            >
                {task[field] || (field === 'description' ? <span className="text-tertiary italic">Add description...</span> : "")}
            </div>
        );
    };

    const renderTaskCard = (task) => (
        <div key={task.id} className="card overflow-hidden" draggable onDragStart={(e) => handleDragStart(e, task.id)}>
            <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            {renderEditableField(task, 'title', 'text-primary font-medium m-0', { fontSize: "var(--text-lg)" })}
                            {viewMode === 'list' && <StatusPill status={task.status} />}
                        </div>
                        {task.projectName && (
                            <Link
                                to={`/projects/${task.projectId}`}
                                className="pill bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200 no-underline hover:opacity-80"
                                style={{ fontSize: "var(--text-xs)" }}
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                                </svg>
                                {task.projectName}
                            </Link>
                        )}
                        {renderEditableField(task, 'description', 'text-secondary m-0 mt-1', { fontSize: "var(--text-sm)" })}
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <PriorityDot priority={task.priority} />
                        {task.dueDate && (
                            <span
                                className="flex items-center gap-1"
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: isOverdue(task.dueDate) && task.status !== "DONE"
                                        ? "var(--color-status-overdue)"
                                        : "var(--color-text-secondary)"
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {task.dueDate}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                    {viewMode === 'list' && task.status !== "IN_PROGRESS" && task.status !== "DONE" && (
                        <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => updateStatus(task.id, "IN_PROGRESS")}>
                            Start
                        </button>
                    )}
                    {viewMode === 'list' && task.status !== "DONE" && (
                        <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => updateStatus(task.id, "DONE")}>
                            Complete
                        </button>
                    )}
                    <button
                        className="btn-ghost py-1.5 px-3 ml-auto text-xs"
                        onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    >
                        {expandedTask === task.id ? "Hide details" : "Show details"}
                    </button>
                    {user?.role === "ADMIN" && (
                        <button
                            className="btn-ghost py-1.5 px-2 text-xs"
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

            {expandedTask === task.id && (
                <div className="px-5 pb-5 border-t border-default pt-4 space-y-4">
                    <TaskComments taskId={task.id} />
                    <TaskAttachments taskId={task.id} />
                    <TaskActivity taskId={task.id} />
                </div>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-primary font-semibold m-0" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
                    {isAdmin ? "Tasks" : "My Tasks"}
                </h1>
                
                {/* View Mode Toggle */}
                <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1 border border-default">
                    <button 
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-fast flex items-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-black shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}
                        onClick={() => setViewMode('list')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                        List
                    </button>
                    <button 
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-fast flex items-center gap-2 ${viewMode === 'board' ? 'bg-white dark:bg-black shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}
                        onClick={() => setViewMode('board')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                        Board
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg bg-red-500/10 text-error text-sm">
                    <span>{error}</span>
                </div>
            )}

            {/* Create task — admin only */}
            {isAdmin && (
                <form onSubmit={createTask} className="card p-4 mb-6 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            className="input-base sm:flex-1"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <input
                            className="input-base sm:flex-1"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            className="input-base sm:flex-1"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            required
                        >
                            <option value="">Select project…</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <select
                            className="input-base sm:w-52"
                            value={assignedUserId}
                            onChange={(e) => setAssignedUserId(e.target.value)}
                            required
                        >
                            <option value="">Assign to…</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>{u.fullname}</option>
                            ))}
                        </select>
                        <select
                            className="input-base sm:w-36"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                        <input
                            type="date"
                            className="input-base sm:w-44"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        <button type="submit" className="btn-primary whitespace-nowrap">Create Task</button>
                    </div>
                </form>
            )}

            {/* Loading */}
            {loading && (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-lg" />)}
                </div>
            )}

            {!loading && tasks.length === 0 && (
                <div className="card p-12 text-center">
                    <p className="text-secondary font-medium m-0">
                        {isAdmin ? "No tasks yet" : "No tasks assigned to you"}
                    </p>
                </div>
            )}

            {!loading && tasks.length > 0 && viewMode === 'list' && (
                <div className="space-y-3">
                    {tasks.map(renderTaskCard)}
                </div>
            )}

            {!loading && tasks.length > 0 && viewMode === 'board' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
                        <div 
                            key={status} 
                            className="flex flex-col gap-3 min-h-[200px] p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-default"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, status)}
                        >
                            <div className="px-2 pt-2 pb-1 flex items-center justify-between">
                                <StatusPill status={status} />
                                <span className="text-tertiary text-xs font-medium">
                                    {tasks.filter(t => t.status === status).length}
                                </span>
                            </div>
                            {tasks.filter(t => t.status === status).map(renderTaskCard)}
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}

export default Tasks;

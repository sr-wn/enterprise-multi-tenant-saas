import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";


const SR_ONLY = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
};

const AVATAR_COLORS = [
    "var(--color-accent-600)",
    "var(--color-status-in-progress)",
    "var(--color-priority-medium)",
    "var(--color-status-done)",
    "var(--color-priority-high)",
];

const STATUS_META = {
    TODO: { label: "To Do", color: "var(--color-status-todo)" },
    IN_PROGRESS: { label: "In Progress", color: "var(--color-status-in-progress)" },
    DONE: { label: "Done", color: "var(--color-status-done)" },
};


function hashString(str) {
    let h = 0;
    for (let i = 0; i < (str || "").length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

function initialsFromName(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    let s = "";
    for (let i = 0; i < Math.min(2, parts.length); i++) {
        if (parts[i]) s += parts[i][0].toUpperCase();
    }
    return s || "?";
}

function formatDay(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function relativeTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    const days = Math.floor(hrs / 24);
    if (days < 7) return days + "d ago";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatPct(pct) {
    if (pct == null) return "";
    const r = Math.round(pct * 10) / 10;
    const str = Number.isInteger(r) ? String(r) : r.toFixed(1);
    return (r > 0 ? "+" : "") + str + "%";
}

function priorityColor(priority) {
    const p = (priority || "").toLowerCase();
    if (p === "high") return "var(--color-priority-high)";
    if (p === "medium") return "var(--color-priority-medium)";
    if (p === "low") return "var(--color-priority-low)";
    return "var(--color-status-todo)";
}


function Avatar({ name, email, initials, size = 28 }) {
    const color = AVATAR_COLORS[hashString(email || name || "?") % AVATAR_COLORS.length];
    return (
        <span
            title={name || email}
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: color,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size * 0.4,
                fontWeight: 600,
                border: "2px solid var(--color-surface-primary)",
                flexShrink: 0,
            }}
        >
            {initials || initialsFromName(name)}
        </span>
    );
}

function MemberStack({ members }) {
    const shown = (members || []).slice(0, 4);
    const extra = (members || []).length - shown.length;
    return (
        <div className="flex items-center">
            {shown.map((m, i) => (
                <span key={m.email || i} style={{ marginLeft: i ? -8 : 0, zIndex: shown.length - i }}>
                    <Avatar name={m.name} email={m.email} initials={m.initials} />
                </span>
            ))}
            {extra > 0 && (
                <span
                    style={{
                        marginLeft: -8,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: "var(--color-surface-elevated)",
                        color: "var(--color-text-secondary)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                        border: "2px solid var(--color-surface-primary)",
                        zIndex: 0,
                    }}
                >
                    +{extra}
                </span>
            )}
            {(!members || members.length === 0) && (
                <span className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>No members</span>
            )}
        </div>
    );
}

function TrendBadge({ stat }) {
    if (!stat.hasTrend) return null;
    const up = stat.delta > 0;
    const flat = stat.delta === 0;
    const arrow = flat ? "→" : up ? "▲" : "▼";
    const color = stat.favorable ? "var(--color-success)" : "var(--color-error)";
    return (
        <span style={{ color, fontSize: "var(--text-xs)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span aria-hidden="true">{arrow}</span>
            {formatPct(stat.deltaPct)}
            <span className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>vs last wk</span>
        </span>
    );
}

function SummaryCard({ stat }) {
    return (
        <div className="card p-4 flex flex-col gap-2">
            <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>{stat.label}</span>
            <span className="text-primary font-semibold" style={{ fontSize: "var(--text-2xl)" }}>
                {stat.value}
            </span>
            <TrendBadge stat={stat} />
        </div>
    );
}

function VelocityChart({ velocity }) {
    const labels = velocity.labels || [];
    const created = velocity.created || [];
    const completed = velocity.completed || [];
    const max = Math.max(1, ...created, ...completed);

    const ariaLabel =
        "Tasks created versus completed per week. " +
        labels.map((l, i) => `${l}: ${created[i]} created, ${completed[i]} completed`).join(". ");

    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <h2 className="text-primary font-semibold m-0" style={{ fontSize: "var(--text-base)" }}>
                    Task Velocity
                </h2>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-secondary" style={{ fontSize: "var(--text-xs)" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "var(--color-accent-600)" }} />
                        Created
                    </span>
                    <span className="flex items-center gap-1.5 text-secondary" style={{ fontSize: "var(--text-xs)" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "var(--color-status-done)" }} />
                        Completed
                    </span>
                </div>
            </div>
            <p className="text-secondary m-0 mb-4" style={{ fontSize: "var(--text-sm)" }}>
                Created vs. completed over the last 4 weeks
            </p>

            <div
                role="img"
                aria-label={ariaLabel}
                className="flex items-end justify-between gap-3"
                style={{ height: "11rem" }}
            >
                {labels.map((label, i) => (
                    <div key={label} className="flex flex-col items-center flex-1 h-full justify-end gap-2">
                        <div className="flex items-end justify-center gap-1 w-full" style={{ height: "100%" }}>
                            <div
                                className="rounded-t-md"
                                style={{
                                    width: "42%",
                                    height: `${Math.max((created[i] / max) * 100, created[i] > 0 ? 4 : 2)}%`,
                                    backgroundColor: "var(--color-accent-600)",
                                }}
                                title={`${created[i]} created`}
                            />
                            <div
                                className="rounded-t-md"
                                style={{
                                    width: "42%",
                                    height: `${Math.max((completed[i] / max) * 100, completed[i] > 0 ? 4 : 2)}%`,
                                    backgroundColor: "var(--color-status-done)",
                                }}
                                title={`${completed[i]} completed`}
                            />
                        </div>
                        <span className="text-secondary" style={{ fontSize: "var(--text-xs)" }}>{label}</span>
                    </div>
                ))}
            </div>

            <table style={SR_ONLY}>
                <caption>Task velocity: created versus completed per week</caption>
                <thead>
                    <tr><th>Week</th><th>Created</th><th>Completed</th></tr>
                </thead>
                <tbody>
                    {labels.map((label, i) => (
                        <tr key={label}>
                            <td>{label}</td><td>{created[i]}</td><td>{completed[i]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function BreakdownBars({ title, items, colorFor }) {
    const max = Math.max(1, ...items.map((it) => it.count));
    return (
        <div className="card p-5">
            <h2 className="text-primary font-semibold m-0 mb-4" style={{ fontSize: "var(--text-base)" }}>
                {title}
            </h2>
            <div className="space-y-3">
                {items.map((it) => (
                    <div key={it.status || it.priority}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-2 text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                                <span className="priority-dot" style={{ backgroundColor: colorFor(it.status || it.priority) }} />
                                {it.status ? (STATUS_META[it.status]?.label || it.status) : it.priority}
                            </span>
                            <span className="text-primary font-medium" style={{ fontSize: "var(--text-sm)" }}>
                                {it.count}
                            </span>
                        </div>
                        <div
                            className="w-full rounded-full overflow-hidden"
                            style={{ height: 8, backgroundColor: "var(--color-border-default)" }}
                        >
                            <div
                                style={{
                                    width: `${(it.count / max) * 100}%`,
                                    height: "100%",
                                    backgroundColor: colorFor(it.status || it.priority),
                                    transition: "width var(--transition-normal)",
                                }}
                            />
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <span className="text-tertiary" style={{ fontSize: "var(--text-sm)" }}>No data</span>
                )}
            </div>
        </div>
    );
}

function ProjectCard({ project }) {
    return (
        <Link
            to={`/projects/${project.id}`}
            className="block card p-4 no-underline transition-normal hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                    <h3 className="text-primary font-medium m-0 truncate" style={{ fontSize: "var(--text-base)" }}>
                        {project.name}
                    </h3>
                    {project.description && (
                        <p className="text-secondary m-0 mt-0.5 line-clamp-1" style={{ fontSize: "var(--text-xs)" }}>
                            {project.description}
                        </p>
                    )}
                </div>
                <MemberStack members={project.members} />
            </div>

            <div className="flex items-center justify-between mb-1.5">
                <span className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                    {project.doneTasks}/{project.totalTasks} tasks
                </span>
                <span className="text-primary font-medium" style={{ fontSize: "var(--text-xs)" }}>
                    {Math.round(project.progress)}%
                </span>
            </div>
            <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: 6, backgroundColor: "var(--color-border-default)" }}
            >
                <div
                    style={{
                        width: `${project.progress}%`,
                        height: "100%",
                        backgroundColor: "var(--color-accent-600)",
                    }}
                />
            </div>

            <div className="mt-3 flex items-center gap-1.5" style={{ fontSize: "var(--text-xs)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={project.dueSoon ? "" : "text-tertiary"} style={project.dueSoon ? { color: "var(--color-status-overdue)" } : {}}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className={project.dueSoon ? "" : "text-secondary"} style={project.dueSoon ? { color: "var(--color-status-overdue)" } : {}}>
                    {project.nextDueDate ? `Due ${formatDay(project.nextDueDate)}` : "No upcoming due date"}
                </span>
            </div>
        </Link>
    );
}

function ActivityFeed({ activity }) {
    return (
        <div className="card p-5">
            <h2 className="text-primary font-semibold m-0 mb-4" style={{ fontSize: "var(--text-base)" }}>
                Recent Activity
            </h2>
            <ul className="space-y-3 m-0 p-0" style={{ listStyle: "none" }}>
                {(activity || []).map((a) => (
                    <li key={a.id} className="flex items-start gap-3">
                        <span style={{ marginTop: 2, flexShrink: 0 }}>
                            <Avatar name={a.actorName} email={a.actorEmail} initials={initialsFromName(a.actorName)} size={26} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-primary m-0" style={{ fontSize: "var(--text-sm)" }}>
                                <span className="font-medium">{a.actorName}</span>{" "}
                                <span className="text-secondary">{a.text}</span>
                            </p>
                            <span className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                                {relativeTime(a.timestamp)}
                            </span>
                        </div>
                    </li>
                ))}
                {(activity || []).length === 0 && (
                    <li className="text-tertiary" style={{ fontSize: "var(--text-sm)" }}>No recent activity</li>
                )}
            </ul>
        </div>
    );
}

function AttentionPanel({ attention }) {
    const overdue = attention.overdue || [];
    const notifications = attention.notifications || [];
    return (
        <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-primary font-semibold m-0" style={{ fontSize: "var(--text-base)" }}>
                    Needs Your Attention
                </h2>
                {attention.unreadCount > 0 && (
                    <span
                        className="pill"
                        style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "var(--color-error)" }}
                    >
                        {attention.unreadCount} unread
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-secondary font-medium m-0 mb-2" style={{ fontSize: "var(--text-sm)" }}>
                        Overdue tasks assigned to you
                    </h3>
                    <ul className="space-y-2 m-0 p-0" style={{ listStyle: "none" }}>
                        {overdue.map((o) => (
                            <li key={o.id} className="flex items-center justify-between gap-2">
                                <Link to={`/tasks`} className="text-primary no-underline truncate" style={{ fontSize: "var(--text-sm)" }}>
                                    {o.title}
                                </Link>
                                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-status-overdue)", whiteSpace: "nowrap" }}>
                                    {formatDay(o.dueDate)}
                                </span>
                            </li>
                        ))}
                        {overdue.length === 0 && (
                            <li className="text-tertiary" style={{ fontSize: "var(--text-sm)" }}>You're all caught up</li>
                        )}
                    </ul>
                </div>

                <div>
                    <h3 className="text-secondary font-medium m-0 mb-2" style={{ fontSize: "var(--text-sm)" }}>
                        Recent notifications
                    </h3>
                    <ul className="space-y-2 m-0 p-0" style={{ listStyle: "none" }}>
                        {notifications.map((n) => (
                            <li key={n.id} className="flex items-start justify-between gap-2">
                                <span className="text-secondary truncate" style={{ fontSize: "var(--text-sm)" }}>
                                    {n.message}
                                </span>
                                <span className="text-tertiary" style={{ fontSize: "var(--text-xs)", whiteSpace: "nowrap" }}>
                                    {relativeTime(n.createdAt)}
                                </span>
                            </li>
                        ))}
                        {notifications.length === 0 && (
                            <li className="text-tertiary" style={{ fontSize: "var(--text-sm)" }}>No notifications</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}


function DashBoard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const response = await api.get("/dashboard");
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        load();
    }, []);


    if (!data) {
        return (
            <Layout>
                <div className="space-y-6">
                    <div className="skeleton h-8 w-56" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="skeleton h-24 rounded-lg" />
                        ))}
                    </div>
                    <div className="skeleton h-64 rounded-lg" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-6">
                {data.companyName && (
                    <p className="text-secondary font-medium m-0 mb-1" style={{ fontSize: "var(--text-sm)" }}>
                        {data.companyName}
                    </p>
                )}
                <h1 className="text-primary font-semibold m-0" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
                    Dashboard Overview
                </h1>
            </div>

            {/* 1. Summary strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {data.summary.map((stat) => (
                    <SummaryCard key={stat.key} stat={stat} />
                ))}
            </div>

            {/* 2. Primary velocity chart */}
            <div className="mb-4">
                <VelocityChart velocity={data.velocity} />
            </div>

            {/* 3. Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <BreakdownBars
                    title="Tasks by Status"
                    items={data.statusBreakdown}
                    colorFor={(s) => STATUS_META[s]?.color || "var(--color-status-todo)"}
                />
                <BreakdownBars
                    title="Tasks by Priority"
                    items={data.priorityBreakdown}
                    colorFor={priorityColor}
                />
            </div>

            {/* 4 + 5. Projects + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-primary font-semibold m-0" style={{ fontSize: "var(--text-base)" }}>
                            Active Projects
                        </h2>
                        <Link to="/projects" className="text-secondary no-underline hover:underline" style={{ fontSize: "var(--text-sm)" }}>
                            View all
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(data.projects || []).map((p) => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                        {(data.projects || []).length === 0 && (
                            <div className="card p-5 text-tertiary" style={{ fontSize: "var(--text-sm)" }}>
                                No projects yet
                            </div>
                        )}
                    </div>
                </div>
                <ActivityFeed activity={data.activity} />
            </div>

            {/* 6. Attention */}
            <AttentionPanel attention={data.attention} />
        </Layout>
    );
}


export default DashBoard;

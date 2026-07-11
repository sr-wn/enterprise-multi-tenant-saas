import { useEffect, useState } from "react";

import Layout from "../layouts/Layout.jsx";
import api from "../api/axios";


const STAT_CARDS = [
    {
        key: "totalProjects",
        label: "Total Projects",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
        ),
    },
    {
        key: "totalUsers",
        label: "Total Users",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
    },
    {
        key: "totalTasks",
        label: "Total Tasks",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
        ),
    },
];

const STATUS_CARDS = [
    {
        key: "todoTasks",
        label: "To Do",
        borderColor: "var(--color-status-todo)",
        dotClass: "status-todo",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
            </svg>
        ),
    },
    {
        key: "inProgressTasks",
        label: "In Progress",
        borderColor: "var(--color-status-in-progress)",
        dotClass: "status-in-progress",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
        ),
    },
    {
        key: "completedTasks",
        label: "Done",
        borderColor: "var(--color-status-done)",
        dotClass: "status-done",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
];


function DashBoard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const response = await api.get("/dashboard");
                setStats(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadDashboard();
    }, []);


    if (!stats) {
        return (
            <Layout>
                <div className="space-y-6">
                    <div className="skeleton h-8 w-56" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton h-28 rounded-lg" />
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }


    return (
        <Layout>
            <div className="mb-6">
                {stats.companyName && (
                    <p
                        className="text-secondary font-medium m-0 mb-1"
                        style={{ fontSize: "var(--text-sm)" }}
                    >
                        {stats.companyName}
                    </p>
                )}
                <h1
                    className="text-primary font-semibold m-0"
                    style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}
                >
                    Dashboard Overview
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Metric cards */}
                {STAT_CARDS.map((card) => (
                    <div key={card.key} className="card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                                {card.label}
                            </span>
                            <span className="text-tertiary">{card.icon}</span>
                        </div>
                        <p
                            className="text-primary font-semibold m-0"
                            style={{ fontSize: "var(--text-2xl)" }}
                        >
                            {stats[card.key] ?? 0}
                        </p>
                    </div>
                ))}

                {/* Status cards with left border */}
                {STATUS_CARDS.map((card) => (
                    <div
                        key={card.key}
                        className="card p-5 overflow-hidden"
                        style={{ borderLeft: `3px solid ${card.borderColor}` }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className={card.dotClass} style={{ display: "flex" }}>{card.icon}</span>
                            <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>
                                {card.label}
                            </span>
                        </div>
                        <p
                            className="text-primary font-semibold m-0"
                            style={{ fontSize: "var(--text-2xl)" }}
                        >
                            {stats[card.key] ?? 0}
                        </p>
                    </div>
                ))}
            </div>
        </Layout>
    );
}


export default DashBoard;
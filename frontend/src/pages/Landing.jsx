import { useState, useEffect, useRef, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";

/* ──────────────────────────────────────────────────────────
   Small shared pieces — mirror the app's real components
   ────────────────────────────────────────────────────────── */

function StatusPill({ status }) {
  const map = {
    TODO: { cls: "status-todo", label: "To do" },
    IN_PROGRESS: { cls: "status-in-progress", label: "In progress" },
    DONE: { cls: "status-done", label: "Done" },
  };
  const { cls, label } = map[status] || map.TODO;
  return <span className={`pill ${cls}`}>{label}</span>;
}

function PriorityDot({ priority }) {
  const cls =
    priority === "HIGH"
      ? "priority-high"
      : priority === "MEDIUM"
      ? "priority-medium"
      : "priority-low";
  return <span className={`priority-dot ${cls}`} aria-hidden="true" />;
}

function Avatar({ initials }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-medium flex-shrink-0"
      style={{
        width: 22,
        height: 22,
        fontSize: "0.625rem",
        color: "var(--color-text-inverse)",
        backgroundColor: "var(--color-accent-600)",
      }}
    >
      {initials}
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   Hero task card
   ────────────────────────────────────────────────────────── */

function MiniTaskCard({ task, dragging, onGrab }) {
  return (
    <div
      className="card p-3 select-none"
      style={{
        cursor: "grab",
        opacity: dragging ? 0.55 : 1,
        transition: "opacity var(--transition-fast), transform var(--transition-fast)",
      }}
      onMouseDown={onGrab}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-primary font-medium m-0" style={{ fontSize: "var(--text-sm)", lineHeight: 1.4 }}>
          {task.title}
        </span>
        <PriorityDot priority={task.priority} />
      </div>
      <div className="flex items-center justify-between">
        <span
          className="flex items-center gap-1"
          style={{
            fontSize: "var(--text-xs)",
            color: task.overdue ? "var(--color-status-overdue)" : "var(--color-text-secondary)",
          }}
        >
          <CalendarIcon />
          {task.due}
        </span>
        <Avatar initials={task.assignee} />
      </div>
    </div>
  );
}

/* Column layout with a card that loops from one column to the next */
function HeroBoard() {
  const columns = [
    { key: "TODO", tasks: ["a", "b"] },
    { key: "IN_PROGRESS", tasks: ["c"] },
    { key: "DONE", tasks: ["d"] },
  ];

  const taskData = {
    a: { title: "Draft Q3 onboarding flow", priority: "MEDIUM", due: "Aug 14", assignee: "RK" },
    b: { title: "Fix tenant invite email", priority: "HIGH", due: "Aug 9", overdue: true, assignee: "MP" },
    c: { title: "Review API pagination", priority: "LOW", due: "Aug 18", assignee: "JL" },
    d: { title: "Ship dark mode tokens", priority: "MEDIUM", due: "Aug 2", assignee: "SR" },
  };

  const [movingCol, setMovingCol] = useState(0);
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    timerRef.current = setInterval(() => {
      setMovingCol((c) => (c + 1) % 3);
    }, 2200);
    return () => clearInterval(timerRef.current);
  }, [reduced]);

  // Card "b" loops through columns 0 -> 1 -> 2, everything else stays put
  const layout = [[], [], []];
  columns.forEach((col, i) => {
    col.tasks.forEach((t) => {
      if (t === "b") return;
      layout[i].push(t);
    });
  });
  layout[movingCol].push("b");

  const labelCount = (i) => layout[i].length;

  return (
    <div className="grid grid-cols-3 gap-3">
      {columns.map((col, i) => (
        <div
          key={col.key}
          className="flex flex-col gap-3 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-default min-h-[220px]"
        >
          <div className="px-1 pt-1 pb-0.5 flex items-center justify-between">
            <StatusPill status={col.key} />
            <span className="text-tertiary" style={{ fontSize: "var(--text-xs)", fontWeight: 500 }}>
              {labelCount(i)}
            </span>
          </div>
          {layout[i].map((t) => (
            <div
              key={t}
              style={{
                transition: reduced ? "none" : "transform var(--transition-slow)",
              }}
              className={t === "b" && !reduced ? "animate-slide-up" : ""}
            >
              <MiniTaskCard task={taskData[t]} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Feature mockups
   ────────────────────────────────────────────────────────── */

function TaskMock() {
  return (
    <div className="card p-4 max-w-sm w-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-primary font-medium m-0" style={{ fontSize: "var(--text-base)" }}>
          Migrate billing to Stripe
        </span>
        <StatusPill status="IN_PROGRESS" />
      </div>
      <div className="flex items-center gap-4 flex-wrap" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
        <span className="flex items-center gap-1.5">
          <PriorityDot priority="HIGH" /> High priority
        </span>
        <span className="flex items-center gap-1">
          <CalendarIcon /> Due Aug 12
        </span>
        <span className="flex items-center gap-1.5">
          <Avatar initials="MP" /> Maria P.
        </span>
      </div>
    </div>
  );
}

function CommentMock() {
  const rows = [
    { who: "JL", name: "Jordan L.", text: "Blocked on the staging DB — can someone grant access?", when: "2h" },
    { who: "RK", name: "Rae K.", text: "Done. You should be in now.", when: "1h" },
  ];
  return (
    <div className="card p-4 max-w-sm w-full space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary font-medium flex-shrink-0 mt-0.5" style={{ fontSize: "0.625rem" }}>
            {r.who}
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-primary font-medium" style={{ fontSize: "var(--text-sm)" }}>{r.name}</span>
              <span className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>{r.when} ago</span>
            </div>
            <p className="text-secondary m-0" style={{ fontSize: "var(--text-sm)" }}>{r.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TenantMock() {
  const tenants = [
    { name: "Northwind Co.", members: 12 },
    { name: "Acme Labs", members: 8 },
  ];
  return (
    <div className="max-w-sm w-full space-y-3">
      {tenants.map((t, i) => (
        <div key={i} className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: i === 0 ? "var(--color-accent-600)" : "var(--color-status-todo)", fontSize: "var(--text-sm)" }}
            >
              {t.name[0]}
            </div>
            <div>
              <div className="text-primary font-medium" style={{ fontSize: "var(--text-sm)" }}>{t.name}</div>
              <div className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>{t.members} members · isolated data</div>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-tertiary)" }} aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function NotificationMock() {
  const items = [
    { text: "Maria assigned you “Migrate billing to Stripe”", unread: true, when: "5m" },
    { text: "Jordan commented on “Fix tenant invite email”", unread: true, when: "22m" },
    { text: "Rae marked “Ship dark mode tokens” as done", unread: false, when: "1h" },
  ];
  return (
    <div className="card max-w-sm w-full overflow-hidden divide-y" style={{ borderColor: "var(--color-border-default)" }}>
      {items.map((n, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 p-3 ${n.unread ? "bg-accent-50/30 dark:bg-accent-50/10" : ""}`}
          style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-border-default)" }}
        >
          <span
            className="rounded-full flex-shrink-0 mt-1.5"
            style={{ width: 7, height: 7, backgroundColor: n.unread ? "var(--color-accent-600)" : "var(--color-border-strong)" }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-primary m-0" style={{ fontSize: "var(--text-sm)" }}>{n.text}</p>
            <span className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>{n.when} ago</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Feature row
   ────────────────────────────────────────────────────────── */

function FeatureRow({ flip, heading, copy, mock }) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${flip ? "md:[direction:rtl]" : ""}`}>
      <div className="[direction:ltr] flex justify-center">{mock}</div>
      <div className="[direction:ltr]">
        <h3 className="text-primary font-semibold m-0 mb-2" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
          {heading}
        </h3>
        <p className="text-secondary m-0" style={{ fontSize: "var(--text-lg)", lineHeight: 1.6 }}>
          {copy}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Landing page
   ────────────────────────────────────────────────────────── */

function Landing() {
  const { token } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen surface-canvas">
      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-40 transition-normal"
        style={{
          backgroundColor: scrolled ? "var(--color-surface-primary)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--color-border-default)" : "1px solid transparent",
        }}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="var(--text-2xl)" dotSize={7} />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <a href="#features" className="btn-ghost hidden sm:inline-flex">Features</a>
            <a href="#how" className="btn-ghost hidden sm:inline-flex">How it works</a>
            <Link to="/login" className="btn-ghost no-underline">Log in</Link>
            <Link to="/register" className="btn-primary no-underline">Get started</Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-slide-up">
            <h1
              className="text-primary font-semibold m-0"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              See who&apos;s blocked, what&apos;s due, and what&apos;s next — without another status meeting.
            </h1>
            <p className="text-secondary m-0 mt-5" style={{ fontSize: "var(--text-lg)", lineHeight: 1.6, maxWidth: "34rem" }}>
              Tena gives each company its own private workspace to run projects, tasks,
              comments, and files in one place. Your team&apos;s data stays isolated from
              every other tenant — no shared spreadsheets, no lost email threads.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <Link to="/register" className="btn-primary no-underline" style={{ padding: "0.625rem 1.25rem", fontSize: "var(--text-base)" }}>
                Start free
              </Link>
              <a href="#how" className="btn-ghost no-underline" style={{ fontSize: "var(--text-base)" }}>
                See how it works →
              </a>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
            <div className="card p-3 sm:p-4 shadow-elevated">
              <div className="flex items-center justify-between px-1 pb-3">
                <span className="text-secondary font-medium" style={{ fontSize: "var(--text-sm)" }}>
                  Northwind Co. · Website relaunch
                </span>
                <div className="flex gap-1" aria-hidden="true">
                  <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-border-strong)" }} />
                  <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-border-strong)" }} />
                  <span className="rounded-full" style={{ width: 8, height: 8, background: "var(--color-border-strong)" }} />
                </div>
              </div>
              <HeroBoard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-20 md:space-y-28">
        <FeatureRow
          heading="Every task has an owner, a priority, and a due date"
          copy="Assign work, set what matters most, and see at a glance what's overdue. No more guessing who's on what."
          mock={<TaskMock />}
        />
        <FeatureRow
          flip
          heading="Keep the conversation on the work, not in your inbox"
          copy="Comments, file attachments, and a full activity history live right on the task — so context never gets lost when someone jumps in."
          mock={<CommentMock />}
        />
        <FeatureRow
          heading="Your company's data stays yours"
          copy="Every tenant gets a fully isolated workspace. Members only ever see their own company's projects, tasks, and files — enforced on the server, not by convention."
          mock={<TenantMock />}
        />
        <FeatureRow
          flip
          heading="Know the moment something needs you"
          copy="Get notified when you're assigned work, mentioned in a comment, or a task you own changes — and nothing more."
          mock={<NotificationMock />}
        />
      </section>

      {/* ── How it works ── */}
      <section id="how" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <h2 className="text-primary font-semibold text-center m-0 mb-12" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
          Up and running in three steps
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { n: 1, t: "Create your workspace", d: "Register your company as its own tenant in under a minute." },
            { n: 2, t: "Invite your team", d: "Add teammates by email — they only see your company's data." },
            { n: 3, t: "Start tracking work", d: "Spin up projects, assign tasks, and watch the chaos settle." },
          ].map((s) => (
            <div key={s.n} className="card p-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold mb-3"
                style={{ backgroundColor: "var(--color-accent-50)", color: "var(--color-accent-600)", fontSize: "var(--text-base)" }}
              >
                {s.n}
              </div>
              <h3 className="text-primary font-medium m-0 mb-1" style={{ fontSize: "var(--text-lg)" }}>{s.t}</h3>
              <p className="text-secondary m-0" style={{ fontSize: "var(--text-sm)" }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="card p-10 md:p-14 text-center">
          <h2 className="text-primary font-semibold m-0 mb-3" style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em" }}>
            Give your team one place to see the work
          </h2>
          <p className="text-secondary m-0 mb-7 mx-auto" style={{ fontSize: "var(--text-lg)", maxWidth: "32rem" }}>
            Set up your company&apos;s workspace and invite your team today. Free to start.
          </p>
          <Link to="/register" className="btn-primary no-underline" style={{ padding: "0.625rem 1.5rem", fontSize: "var(--text-base)" }}>
            Create your workspace
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-default">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="var(--text-lg)" dotSize={5} />
            <span className="text-secondary" style={{ fontSize: "var(--text-sm)" }}>· Multi-tenant project management</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost no-underline">Log in</Link>
            <Link to="/register" className="btn-ghost no-underline">Get started</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
          © {year} Tena. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Landing;

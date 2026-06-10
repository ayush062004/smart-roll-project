import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const API = "https://smart-roll-backend.onrender.com";

/* ─── DESIGN TOKENS ─────────────────────────────────────── */
const T = {
  navy:       "#0f1f3d",
  navyLight:  "#162a50",
  gold:       "#c9a84c",
  goldLight:  "#e8c96b",
  bg:         "#f4f6f9",
  surface:    "#ffffff",
  border:     "#e2e8ef",
  textPrimary:"#1a2a40",
  textMuted:  "#64748b",
  red:        "#dc2626",
  green:      "#16a34a",
  sky:        "#0284c7",
  fontSans:   "'Inter', 'Segoe UI', system-ui, sans-serif",
};

/* ─── GLOBAL INJECTED STYLES ─────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { font-family: ${T.fontSans}; background: ${T.bg}; color: ${T.textPrimary}; -webkit-font-smoothing: antialiased; }
    button { font-family: ${T.fontSans}; cursor: pointer; }

    /* ── Sidebar ── */
.sidebar {
  width: 230px;
  height: 100vh;
  background: #0f1f3d;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4000; /* Increased */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.28s cubic-bezier(.4,0,.2,1);
}

/* Desktop: always visible */
@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0) !important;
  }
}

/* Mobile: hidden by default, shown only when open */
@media (max-width: 767px) {
  .sidebar {
    transform: translateX(-100%);
    z-index: 4000;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }
}

/* ── Mobile topbar ── */
.mobile-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #0f1f3d;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  z-index: 3000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

/* ── Overlay ── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 3500;
  backdrop-filter: blur(2px);
}

    /* ── Sidebar internals ── */
    .sidebar-brand {
      padding: 24px 20px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-icon {
      width: 34px; height: 34px;
      background: ${T.gold};
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .brand-name { color: #fff; font-weight: 700; font-size: 15px; letter-spacing: 0.04em; }
    .brand-sub  { color: #4a6080; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 1px; }

    .sidebar-nav { flex: 1; padding: 10px 10px 0; }
    .sidebar-section-label {
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: #4a6080; padding: 14px 12px 6px;
    }
    .sidebar-link {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 10px 12px;
      border: none; border-radius: 7px;
      background: transparent; color: #8ba4be;
      font-size: 13.5px; font-weight: 500; text-align: left;
      transition: background 0.16s, color 0.16s;
      letter-spacing: 0.01em;
    }
    .sidebar-link:hover { background: rgba(201,168,76,0.12); color: ${T.goldLight}; }
    .sidebar-link svg { flex-shrink: 0; opacity: 0.7; }
    .sidebar-link:hover svg { opacity: 1; }

    .sidebar-footer {
      padding: 12px 10px 20px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .logout-btn {
      display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 10px 12px;
      border: 1px solid rgba(220,38,38,0.3); border-radius: 7px;
      background: transparent; color: #f87171;
      font-size: 13px; font-weight: 600;
      letter-spacing: 0.04em; text-transform: uppercase;
      transition: background 0.16s, color 0.16s;
    }
    .logout-btn:hover { background: rgba(220,38,38,0.1); color: #fca5a5; }

    /* ── Main ── */
    .main-content {
      flex: 1;
      min-width: 0;
      padding: 36px 32px 40px;
    }
    @media (max-width: 767px) {
      .main-content {
        padding: 68px 14px 32px;
      }
    }

    /* ── Page header ── */
    .page-sub   { font-size: 12px; color: ${T.textMuted}; margin-bottom: 4px; }
    .page-heading { font-size: 22px; font-weight: 700; color: ${T.textPrimary}; letter-spacing: -0.01em; }

    /* ── Stat cards ── */
    .stats-grid {
      display: grid;
      gap: 14px;
      margin-bottom: 24px;
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 767px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
    }
    .stat-card {
      background: ${T.surface};
      border-radius: 10px;
      padding: 18px 20px;
      border-left: 3px solid ${T.gold};
      box-shadow: 0 1px 4px rgba(15,31,61,0.07);
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .stat-card:hover { box-shadow: 0 4px 16px rgba(15,31,61,0.12); transform: translateY(-1px); }
    .stat-card .label {
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: ${T.textMuted}; margin-bottom: 7px;
    }
    .stat-card .value {
      font-size: 30px; font-weight: 700;
      color: ${T.textPrimary}; line-height: 1;
    }

    /* ── Charts ── */
    .charts-grid {
      display: grid;
      gap: 18px;
      margin-bottom: 24px;
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 767px) {
      .charts-grid { grid-template-columns: 1fr; }
    }
    .chart-card {
      background: ${T.surface};
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 1px 4px rgba(15,31,61,0.07);
    }
    .chart-title {
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: ${T.textMuted};
      padding-bottom: 14px;
      border-bottom: 1px solid ${T.border};
      margin-bottom: 18px;
    }

    /* ── Quick actions ── */
    .section-heading {
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: ${T.textMuted}; margin-bottom: 12px;
    }
    .actions-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .action-btn {
      flex: 1 1 160px;
      padding: 13px 20px;
      border: none; border-radius: 8px;
      font-size: 13.5px; font-weight: 700;
      letter-spacing: 0.03em;
      transition: background 0.18s, transform 0.15s;
    }
    @media (max-width: 480px) {
      .action-btn { flex: 1 1 100%; }
    }
    .action-btn:hover { transform: translateY(-1px); }
    .action-btn-gold { background: ${T.gold}; color: ${T.navy}; }
    .action-btn-gold:hover { background: ${T.goldLight}; }
    .action-btn-navy { background: ${T.navy}; color: #fff; }
    .action-btn-navy:hover { background: ${T.navyLight}; }

    /* ── Loading ── */
    .loading-screen {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: ${T.bg};
    }
    .spinner {
      width: 34px; height: 34px;
      border: 3px solid ${T.border};
      border-top-color: ${T.gold};
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      margin: 0 auto 12px;
    }
    .loading-text {
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: ${T.textMuted}; text-align: center;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `}</style>
);

/* ─── ICONS ──────────────────────────────────────────────── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  inventory:  "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  qr:         "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h3v3h-3z M20 14v3 M17 20h3 M20 17v3",
  cut:        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  logout:     "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
};

/* ─── DASHBOARD ──────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, available: 0, used: 0, damaged: 0 });
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ CHECK LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // ✅ MOBILE RESPONSIVE
  useEffect(() => {
    const resize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch(`${API}/api/fabric/stats`);
        const statsData = await statsRes.json();
        setStats({
          total:     Number(statsData.total)     || 0,
          available: Number(statsData.available) || 0,
          used:      Number(statsData.used)      || 0,
          damaged:   Number(statsData.damaged)   || 0,
        });
        try {
          const barRes = await fetch(`${API}/api/fabric/weekly`);
          const bar = await barRes.json();
          setBarData(Array.isArray(bar) ? bar : []);
        } catch {
          setBarData([
            { name: "Mon", cuts: 0 },
            { name: "Tue", cuts: 0 },
            { name: "Wed", cuts: 0 },
            { name: "Thu", cuts: 0 },
            { name: "Fri", cuts: 0 },
          ]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = [
    { name: "Available", value: stats.available },
    { name: "Used",      value: stats.used },
    { name: "Damaged",   value: stats.damaged },
  ];
  const COLORS = [T.sky, T.green, T.red];

  const goTo = (path) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <div className="loading-screen">
          <div>
            <div className="spinner" />
            <p className="loading-text">Loading Dashboard</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>

        {/* ── MOBILE TOPBAR ── */}
        {isMobile && (
          <div className="mobile-topbar">
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <h3>FabricSys</h3>
          </div>
        )}

        {/* ── OVERLAY ── */}
        {isMobile && sidebarOpen && (
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar${isMobile && sidebarOpen ? " mobile-open" : ""}`}>
          <div className="sidebar-brand">
            <div className="brand-icon">🧵</div>
            <div>
              <div className="brand-name">FabricSys</div>
              <div className="brand-sub">Smart Roll System</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <p className="sidebar-section-label">Navigation</p>
            <SidebarLink icon={icons.dashboard} label="Dashboard"  onClick={() => goTo("/dashboard")} />
            <SidebarLink icon={icons.inventory} label="Inventory"  onClick={() => goTo("/inventory")} />
            <SidebarLink icon={icons.qr}        label="QR Scanner" onClick={() => goTo("/qrscanner")} />
            <SidebarLink icon={icons.cut}       label="Cutting"    onClick={() => goTo("/cutting")} />
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <Icon d={icons.logout} size={14} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="main-content" style={{ marginLeft: isMobile ? 0 : "230px" }}>

          {/* Page header */}
          <div style={{ marginBottom: "26px" }}>
            <p className="page-sub">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <h1 className="page-heading">Dashboard Overview</h1>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="stats-grid">
            <StatCard title="Total Rolls"  value={stats.total}     accent={T.gold}  />
            <StatCard title="Available"    value={stats.available} accent={T.sky}   />
            <StatCard title="Used"         value={stats.used}      accent={T.green} />
            <StatCard title="Damaged"      value={stats.damaged}   accent={T.red}   />
          </div>

          {/* ── CHARTS ── */}
          <div className="charts-grid">
            <div className="chart-card">
              <p className="chart-title">Inventory Distribution</p>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={88} strokeWidth={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: T.surface, border: `1px solid ${T.border}`,
                      borderRadius: "6px", fontSize: "13px", fontFamily: T.fontSans,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <p className="chart-title">Weekly Cutting Activity</p>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={barData} barCategoryGap="35%">
                  <CartesianGrid stroke={T.border} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: T.surface, border: `1px solid ${T.border}`,
                      borderRadius: "6px", fontSize: "13px", fontFamily: T.fontSans,
                    }}
                    cursor={{ fill: "rgba(15,31,61,0.04)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", fontFamily: T.fontSans }} />
                  <Bar dataKey="cuts" fill={T.navy} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div>
            <p className="section-heading">Quick Actions</p>
            <div className="actions-row">
              <button className="action-btn action-btn-gold" onClick={() => goTo("/addfabric")}>
                + Add Fabric Roll
              </button>
              <button className="action-btn action-btn-navy" onClick={() => goTo("/qrscanner")}>
                Scan QR Code
              </button>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

/* ─── SUB-COMPONENTS ─────────────────────────────────────── */
const SidebarLink = ({ icon, label, onClick }) => (
  <button className="sidebar-link" onClick={onClick}>
    <Icon d={icon} size={15} />
    {label}
  </button>
);

const StatCard = ({ title, value, accent }) => (
  <div className="stat-card" style={{ borderLeftColor: accent }}>
    <p className="label">{title}</p>
    <p className="value">{value}</p>
  </div>
);

export default Dashboard;
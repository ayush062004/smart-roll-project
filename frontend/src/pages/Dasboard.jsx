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

    body { font-family: ${T.fontSans}; background: ${T.bg}; color: ${T.textPrimary}; }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 14px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #a8bbd4;
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: background 0.18s, color 0.18s;
      font-family: ${T.fontSans};
      letter-spacing: 0.01em;
    }
    .sidebar-link:hover {
      background: rgba(201,168,76,0.12);
      color: ${T.goldLight};
    }
    .sidebar-link .icon {
      width: 18px;
      text-align: center;
      flex-shrink: 0;
      font-size: 15px;
    }

    .stat-card {
      background: ${T.surface};
      border-radius: 10px;
      padding: 20px 24px;
      border-left: 3px solid ${T.gold};
      box-shadow: 0 1px 4px rgba(15,31,61,0.07);
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .stat-card:hover {
      box-shadow: 0 4px 16px rgba(15,31,61,0.12);
      transform: translateY(-1px);
    }
    .stat-card .label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${T.textMuted};
      margin-bottom: 8px;
    }
    .stat-card .value {
      font-size: 32px;
      font-weight: 700;
      color: ${T.textPrimary};
      line-height: 1;
    }

    .chart-card {
      background: ${T.surface};
      border-radius: 10px;
      padding: 24px;
      box-shadow: 0 1px 4px rgba(15,31,61,0.07);
    }
    .chart-card .chart-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${T.textMuted};
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid ${T.border};
    }

    .action-btn {
      flex: 1 1 160px;
      padding: 14px 20px;
      background: ${T.navy};
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 0.03em;
      transition: background 0.18s, transform 0.15s;
      font-family: ${T.fontSans};
    }
    .action-btn:hover {
      background: ${T.navyLight};
      transform: translateY(-1px);
    }
    .action-btn.gold {
      background: ${T.gold};
      color: ${T.navy};
    }
    .action-btn.gold:hover {
      background: ${T.goldLight};
    }

    .logout-btn {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid rgba(220,38,38,0.35);
      border-radius: 6px;
      background: transparent;
      color: #f87171;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: background 0.18s, color 0.18s;
      font-family: ${T.fontSans};
      text-align: left;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logout-btn:hover {
      background: rgba(220,38,38,0.12);
      color: #fca5a5;
    }

    .mobile-topbar {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      height: 58px;
      background: ${T.navy};
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 18px;
      z-index: 3000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }
    .mobile-topbar h3 {
      color: ${T.gold};
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .hamburger {
      background: none;
      border: none;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
    }

    .loading-screen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${T.bg};
    }
    .loading-inner {
      text-align: center;
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid ${T.border};
      border-top-color: ${T.gold};
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${T.textMuted};
    }

    .section-heading {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${T.textMuted};
      margin-bottom: 14px;
    }

    .page-heading {
      font-size: 22px;
      font-weight: 700;
      color: ${T.textPrimary};
      letter-spacing: -0.01em;
    }
    .page-sub {
      font-size: 13px;
      color: ${T.textMuted};
      margin-top: 3px;
    }

    .sidebar-section-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #4a6080;
      padding: 0 14px;
      margin: 18px 0 6px;
    }

    .divider {
      height: 1px;
      background: rgba(255,255,255,0.06);
      margin: 12px 0;
    }
  `}</style>
);

/* ─── ICONS (inline SVG, no deps) ───────────────────────── */
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
  add:        "M12 5v14 M5 12h14",
  scan:       "M1 1h6v6H1z M17 1h6v6h-6z M1 17h6v6H1z M9 1v6 M1 9h6 M17 9v6 M9 17h6 M17 17h6v6",
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
          <div className="loading-inner">
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
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h3>FabricSys</h3>
          </div>
        )}

        {/* ── OVERLAY ── */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 1500,
            }}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: "230px",
          height: "100vh",
          background: T.navy,
          padding: "0",
          position: "fixed",
          top: 0,
          left: isMobile ? (sidebarOpen ? "0" : "-240px") : "0",
          zIndex: 2000,
          transition: "left 0.28s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}>
          {/* Brand */}
          <div style={{
            padding: "28px 20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: 34, height: 34,
                background: T.gold,
                borderRadius: "7px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}>🧵</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "0.04em" }}>
                  FabricSys
                </div>
                <div style={{ color: "#4a6080", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Smart Roll System
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 10px" }}>
            <p className="sidebar-section-label">Navigation</p>
            <SidebarLink icon={icons.dashboard} label="Dashboard"  onClick={() => goTo("/dashboard")} />
            <SidebarLink icon={icons.inventory} label="Inventory"  onClick={() => goTo("/inventory")} />
            <SidebarLink icon={icons.qr}        label="QR Scanner" onClick={() => goTo("/qrscanner")} />
            <SidebarLink icon={icons.cut}       label="Cutting"    onClick={() => goTo("/cutting")} />
          </nav>

          {/* Logout */}
          <div style={{ padding: "12px 10px 24px" }}>
            <div className="divider" />
            <button className="logout-btn" onClick={handleLogout}>
              <Icon d={icons.logout} size={14} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{
          flex: 1,
          marginLeft: isMobile ? 0 : "230px",
          padding: isMobile ? "72px 16px 32px" : "36px 32px 40px",
          minWidth: 0,
        }}>
          {/* Page header */}
          <div style={{ marginBottom: "28px" }}>
            <p className="page-sub" style={{ marginBottom: "4px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <h1 className="page-heading">Dashboard Overview</h1>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            marginBottom: "28px",
          }}>
            <StatCard title="Total Rolls"  value={stats.total}     accent={T.gold}  />
            <StatCard title="Available"    value={stats.available} accent={T.sky}   />
            <StatCard title="Used"         value={stats.used}      accent={T.green} />
            <StatCard title="Damaged"      value={stats.damaged}   accent={T.red}   />
          </div>

          {/* ── CHARTS ── */}
          <div style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            marginBottom: "28px",
          }}>
            <div className="chart-card">
              <p className="chart-title">Inventory Distribution</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90} strokeWidth={2}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontFamily: T.fontSans,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <p className="chart-title">Weekly Cutting Activity</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} barCategoryGap="35%">
                  <CartesianGrid stroke={T.border} strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: T.textMuted, fontFamily: T.fontSans }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: T.textMuted, fontFamily: T.fontSans }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontFamily: T.fontSans,
                    }}
                    cursor={{ fill: "rgba(15,31,61,0.04)" }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", fontFamily: T.fontSans }}
                  />
                  <Bar dataKey="cuts" fill={T.navy} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div>
            <p className="section-heading">Quick Actions</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="action-btn gold" onClick={() => goTo("/addfabric")}>
                + Add Fabric Roll
              </button>
              <button className="action-btn" onClick={() => goTo("/qrscanner")}>
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
    <span className="icon"><Icon d={icon} size={15} /></span>
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
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://smart-roll-backend.onrender.com";

/* ─── TOKENS ─────────────────────────────────────────────── */
const T = {
  navy:    "#0f1f3d",
  navyMid: "#162a50",
  gold:    "#c9a84c",
  goldHov: "#e8c96b",
  bg:      "#f4f6f9",
  surface: "#ffffff",
  border:  "#e2e8ef",
  text:    "#1a2a40",
  muted:   "#64748b",
  red:     "#dc2626",
  green:   "#16a34a",
  sky:     "#0284c7",
  amber:   "#d97706",
  font:    "'Inter','Segoe UI',system-ui,sans-serif",
};

/* ─── GLOBAL CSS ─────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{font-family:${T.font};background:${T.bg};color:${T.text};-webkit-font-smoothing:antialiased}
    button,input{font-family:${T.font}}

    /* ── Sidebar ── */
    .sidebar{
      width:230px;height:100vh;background:${T.navy};
      position:fixed;top:0;left:0;z-index:2000;
      display:flex;flex-direction:column;
      overflow-y:auto;
      transition:transform .28s cubic-bezier(.4,0,.2,1);
    }
    @media(min-width:768px){
      .sidebar{transform:translateX(0)!important}
    }
    @media(max-width:767px){
      .sidebar{transform:translateX(-100%)}
      .sidebar.mobile-open{transform:translateX(0)}
    }
    .sidebar-brand{
      padding:24px 20px 18px;
      border-bottom:1px solid rgba(255,255,255,.07);
      display:flex;align-items:center;gap:10px;flex-shrink:0;
    }
    .brand-icon{
      width:34px;height:34px;border-radius:8px;background:${T.gold};
      display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;
    }
    .brand-name{color:#fff;font-weight:700;font-size:15px;letter-spacing:.04em}
    .brand-sub{color:#4a6080;font-size:10px;letter-spacing:.06em;text-transform:uppercase;margin-top:1px}

    .sidebar-nav{flex:1;padding:10px 10px 0;overflow-y:auto}
    .nav-label{
      font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
      color:#4a6080;padding:14px 12px 6px;
    }
    .nav-link{
      display:flex;align-items:center;gap:10px;width:100%;
      padding:10px 12px;border:none;border-radius:7px;
      background:transparent;color:#8ba4be;
      font-size:13.5px;font-weight:500;text-align:left;
      transition:background .16s,color .16s;
    }
    .nav-link:hover,.nav-link.active{background:rgba(201,168,76,.12);color:${T.goldHov}}
    .nav-link.active{color:${T.gold}}

    .sidebar-footer{padding:12px 10px 20px;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0}
    .logout-btn{
      display:flex;align-items:center;gap:8px;width:100%;
      padding:10px 12px;border:1px solid rgba(220,38,38,.3);border-radius:7px;
      background:transparent;color:#f87171;font-size:13px;font-weight:600;
      letter-spacing:.04em;transition:background .16s,color .16s;
    }
    .logout-btn:hover{background:rgba(220,38,38,.1);color:#fca5a5}

    /* ── Mobile topbar ── */
    .topbar{
      position:fixed;top:0;left:0;right:0;height:56px;
      background:${T.navy};display:flex;align-items:center;
      gap:12px;padding:0 18px;z-index:3000;
      box-shadow:0 2px 8px rgba(0,0,0,.25);
    }
    .topbar-title{color:${T.gold};font-size:15px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
    .hamburger{background:none;border:none;color:#fff;font-size:22px;line-height:1;padding:4px}

    /* ── Overlay ── */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1500;backdrop-filter:blur(2px)}

    /* ── Main ── */
    .main{flex:1;min-width:0;padding:32px}
    @media(max-width:767px){.main{padding:68px 14px 32px}}

    .page-eyebrow{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${T.muted};margin-bottom:4px}
    .page-title{font-size:22px;font-weight:700;color:${T.text};letter-spacing:-.01em;margin-bottom:24px}

    /* ── Stat cards ── */
    .stats-grid{display:grid;gap:14px;margin-bottom:24px;grid-template-columns:repeat(4,1fr)}
    @media(max-width:767px){.stats-grid{grid-template-columns:1fr 1fr}}
    .stat-card{
      background:${T.surface};border-radius:10px;padding:18px 20px;
      border-left:3px solid ${T.gold};
      box-shadow:0 1px 3px rgba(15,31,61,.07);
      transition:box-shadow .2s,transform .2s;
    }
    .stat-card:hover{box-shadow:0 4px 14px rgba(15,31,61,.12);transform:translateY(-1px)}
    .stat-label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${T.muted};margin-bottom:7px}
    .stat-value{font-size:30px;font-weight:700;color:${T.text};line-height:1}

    /* ── Section card ── */
    .section-card{background:${T.surface};border-radius:10px;box-shadow:0 1px 3px rgba(15,31,61,.07);overflow:hidden}
    .section-head{
      padding:14px 18px;border-bottom:1px solid ${T.border};
      display:flex;align-items:center;gap:8px;
    }
    .section-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .section-title{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${T.text}}
    .scroll-x{overflow-x:auto;-webkit-overflow-scrolling:touch}

    /* ── Table ── */
    .adm-table{width:100%;border-collapse:collapse;font-size:13.5px;min-width:460px}
    .adm-table thead tr{border-bottom:2px solid ${T.border}}
    .adm-table th{
      padding:10px 14px;text-align:left;
      font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
      color:${T.muted};white-space:nowrap;
    }
    .adm-table tbody tr{border-bottom:1px solid ${T.border};transition:background .14s}
    .adm-table tbody tr:last-child{border-bottom:none}
    .adm-table tbody tr:hover{background:#f8fafc}
    .adm-table td{padding:11px 14px;white-space:nowrap;font-size:13.5px}
    .mono{font-family:'SF Mono','Fira Code',monospace;font-size:13px;color:${T.muted}}

    /* ── Table buttons ── */
    .tbl-btn{
      padding:5px 12px;border:none;border-radius:5px;
      font-size:12px;font-weight:600;cursor:pointer;
      transition:opacity .15s,transform .15s;
    }
    .tbl-btn:hover{opacity:.82;transform:translateY(-1px)}
    .tbl-btn-add{background:${T.navy};color:#fff;margin-right:6px}
    .tbl-btn-del{background:#fee2e2;color:${T.red}}

    /* ── Create user form ── */
    .form-card{background:${T.surface};border-radius:10px;box-shadow:0 1px 3px rgba(15,31,61,.07);overflow:hidden}
    .form-head{padding:14px 18px;border-bottom:1px solid ${T.border};display:flex;align-items:center;gap:8px}
    .form-body{padding:24px}
    .form-fields{display:flex;flex-direction:column;gap:14px}
    .form-input{
      width:100%;padding:10px 14px;
      border:1px solid ${T.border};border-radius:7px;
      font-size:14px;color:${T.text};background:${T.surface};
      outline:none;transition:border-color .18s,box-shadow .18s;
    }
    .form-input:focus{border-color:${T.gold};box-shadow:0 0 0 3px rgba(201,168,76,.15)}
    .form-input::placeholder{color:#94a3b8}
    .form-submit{
      padding:11px 24px;border:none;border-radius:8px;
      background:${T.navy};color:#fff;
      font-size:14px;font-weight:700;letter-spacing:.03em;cursor:pointer;
      transition:background .18s,transform .15s;align-self:flex-start;
    }
    .form-submit:hover{background:${T.navyMid};transform:translateY(-1px)}

    /* ── Mobile card views ── */
    .mobile-card-list{display:flex;flex-direction:column;gap:0}
    .mobile-row-card{padding:14px 16px;border-bottom:1px solid ${T.border}}
    .mobile-row-card:last-child{border-bottom:none}
    .mrc-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px}
    .mrc-title{font-size:14px;font-weight:600;color:${T.text}}
    .mrc-sub{font-size:12px;color:${T.muted};margin-top:2px;font-family:'SF Mono','Fira Code',monospace}
    .mrc-meta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}
    .mrc-meta-item{display:flex;flex-direction:column;gap:1px}
    .mrc-meta-label{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${T.muted}}
    .mrc-meta-val{font-size:13px;font-weight:600;color:${T.text}}
    .mrc-actions{display:flex;gap:8px}
    .mrc-actions .tbl-btn{flex:1;padding:8px;font-size:13px;text-align:center}

    /* ── Empty ── */
    .empty-cell{text-align:center;padding:32px!important;color:${T.muted};font-size:13px}
  `}</style>
);

/* ─── ICON ───────────────────────────────────────────────── */
const Ico = ({ d, s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IC = {
  cuts:   "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  inv:    "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  users:  "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  create: "M12 5v14 M5 12h14",
  out:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
};

/* ─── ADMIN DASHBOARD ────────────────────────────────────── */
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [cuts,      setCuts]      = useState([]);
  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [inventory, setInventory] = useState([]);

  const [activeTab,   setActiveTab]   = useState("cuts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 768);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const token = localStorage.getItem("adminToken");

  // ================= MOBILE RESIZE =================
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ================= FETCH FUNCTIONS =================
  const fetchCuts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/cuts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCuts(res.data);
    } catch {}
  }, [token]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch {}
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {}
  }, [token]);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch {}
  }, [token]);

  // ================= AUTH CHECK =================
  useEffect(() => {
    if (!token) { navigate("/adminlogin"); return; }
    fetchCuts();
    fetchStats();
    fetchUsers();
    fetchInventory();
  }, [token, navigate, fetchCuts, fetchStats, fetchUsers, fetchInventory]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ================= CREATE USER =================
  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admin/create-user`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User Created ✅");
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch { alert("Error ❌"); }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await axios.delete(`${API}/api/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // ================= DELETE INVENTORY =================
  const handleInvDelete = async (id) => {
    if (!window.confirm("Delete fabric?")) return;
    await axios.delete(`${API}/api/admin/inventory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchInventory();
  };

  // ================= ADD LENGTH =================
  const handleAddLength = async (item) => {
    const value = prompt("Enter length");
    if (!value || isNaN(value)) return;
    const newLength = Number(item.availableLength) + Number(value);
    await axios.put(
      `${API}/api/admin/inventory/${item._id}`,
      { availableLength: newLength },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchInventory();
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    if (isMobile) setSidebarOpen(false);
  };

  const tabAccent = { cuts: T.sky, inventory: T.gold, users: T.green, create: T.amber };

  return (
    <>
      <Styles />
      <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>

        {/* ── MOBILE TOPBAR ── */}
        {isMobile && (
          <div className="topbar">
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <span className="topbar-title">Admin Panel</span>
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
              <div className="brand-sub">Admin Panel</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-label">Management</div>
            <NavLink icon={IC.cuts}   label="Cut History"  active={activeTab === "cuts"}      onClick={() => changeTab("cuts")} />
            <NavLink icon={IC.inv}    label="Inventory"    active={activeTab === "inventory"}  onClick={() => changeTab("inventory")} />
            <NavLink icon={IC.users}  label="Users"        active={activeTab === "users"}      onClick={() => changeTab("users")} />
            <NavLink icon={IC.create} label="Create User"  active={activeTab === "create"}     onClick={() => changeTab("create")} />
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem("adminToken");
              localStorage.removeItem("adminUser");
              navigate("/adminlogin");
            }}>
              <Ico d={IC.out} s={14} /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main" style={{ marginLeft: isMobile ? 0 : "230px" }}>

          {/* Header */}
          <p className="page-eyebrow">FabricSys · Admin Panel</p>
          <h1 className="page-title">Dashboard Overview</h1>

          {/* ── STAT CARDS ── */}
          <div className="stats-grid">
            <StatCard title="Total Rolls" value={stats?.totalRolls    || 0} accent={T.gold}  />
            <StatCard title="Used"        value={stats?.usedRolls     || 0} accent={T.sky}   />
            <StatCard title="Available"   value={stats?.availableRolls|| 0} accent={T.green} />
            <StatCard title="Damaged"     value={stats?.damaged       || 0} accent={T.red}   />
          </div>

          {/* ── CUT HISTORY ── */}
          {activeTab === "cuts" && (
            <div className="section-card">
              <div className="section-head">
                <span className="section-dot" style={{ background: T.sky }} />
                <span className="section-title">Cut History</span>
                <span style={{ marginLeft: "auto", fontSize: "12px", color: T.muted, fontWeight: 500 }}>
                  {cuts.length} record{cuts.length !== 1 ? "s" : ""}
                </span>
              </div>
              {isMobile ? (
                <div className="mobile-card-list">
                  {cuts.length === 0
                    ? <p style={{ padding: "28px", textAlign: "center", color: T.muted, fontSize: "13px" }}>No records</p>
                    : cuts.map((c) => (
                      <div className="mobile-row-card" key={c._id}>
                        <div className="mrc-top">
                          <div>
                            <p className="mrc-title">{c.name}</p>
                            <p className="mrc-sub">{c.rollNumber}</p>
                          </div>
                          <span style={{ fontSize: "11px", color: T.muted }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mrc-meta">
                          <div className="mrc-meta-item">
                            <span className="mrc-meta-label">Cut</span>
                            <span className="mrc-meta-val">{c.cutLength}m</span>
                          </div>
                          <div className="mrc-meta-item">
                            <span className="mrc-meta-label">Remaining</span>
                            <span className="mrc-meta-val">{c.remainingLength}m</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="scroll-x">
                  <table className="adm-table">
                    <thead><tr><th>Roll</th><th>Name</th><th>Cut (m)</th><th>Remaining (m)</th><th>Date</th></tr></thead>
                    <tbody>
                      {cuts.length === 0
                        ? <tr><td colSpan={5} className="empty-cell">No cut records found</td></tr>
                        : cuts.map((c) => (
                          <tr key={c._id}>
                            <td className="mono">{c.rollNumber}</td>
                            <td style={{ fontWeight: 500 }}>{c.name}</td>
                            <td className="mono">{c.cutLength}</td>
                            <td className="mono">{c.remainingLength}</td>
                            <td style={{ fontSize: "12.5px", color: T.muted }}>{new Date(c.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── INVENTORY ── */}
          {activeTab === "inventory" && (
            <div className="section-card">
              <div className="section-head">
                <span className="section-dot" style={{ background: T.gold }} />
                <span className="section-title">Inventory</span>
                <span style={{ marginLeft: "auto", fontSize: "12px", color: T.muted, fontWeight: 500 }}>
                  {inventory.length} roll{inventory.length !== 1 ? "s" : ""}
                </span>
              </div>
              {isMobile ? (
                <div className="mobile-card-list">
                  {inventory.length === 0
                    ? <p style={{ padding: "28px", textAlign: "center", color: T.muted, fontSize: "13px" }}>No inventory</p>
                    : inventory.map((i) => (
                      <div className="mobile-row-card" key={i._id}>
                        <div className="mrc-top">
                          <div>
                            <p className="mrc-title">{i.name}</p>
                            <p className="mrc-sub">{i.rollNumber}</p>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: T.text, fontFamily: "monospace" }}>
                            {i.availableLength}m
                          </span>
                        </div>
                        <div className="mrc-actions">
                          <button className="tbl-btn tbl-btn-add" onClick={() => handleAddLength(i)}>+ Add Length</button>
                          <button className="tbl-btn tbl-btn-del" onClick={() => handleInvDelete(i._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="scroll-x">
                  <table className="adm-table">
                    <thead><tr><th>Roll No.</th><th>Name</th><th>Available (m)</th><th>Actions</th></tr></thead>
                    <tbody>
                      {inventory.length === 0
                        ? <tr><td colSpan={4} className="empty-cell">No inventory found</td></tr>
                        : inventory.map((i) => (
                          <tr key={i._id}>
                            <td className="mono">{i.rollNumber}</td>
                            <td style={{ fontWeight: 500 }}>{i.name}</td>
                            <td className="mono">{i.availableLength}</td>
                            <td>
                              <button className="tbl-btn tbl-btn-add" onClick={() => handleAddLength(i)}>+ Add</button>
                              <button className="tbl-btn tbl-btn-del" onClick={() => handleInvDelete(i._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === "users" && (
            <div className="section-card">
              <div className="section-head">
                <span className="section-dot" style={{ background: T.green }} />
                <span className="section-title">Users</span>
                <span style={{ marginLeft: "auto", fontSize: "12px", color: T.muted, fontWeight: 500 }}>
                  {users.length} user{users.length !== 1 ? "s" : ""}
                </span>
              </div>
              {isMobile ? (
                <div className="mobile-card-list">
                  {users.length === 0
                    ? <p style={{ padding: "28px", textAlign: "center", color: T.muted, fontSize: "13px" }}>No users found</p>
                    : users.map((u) => (
                      <div className="mobile-row-card" key={u._id}>
                        <div className="mrc-top">
                          <div>
                            <p className="mrc-title">{u.name}</p>
                            <p className="mrc-sub" style={{ fontFamily: "inherit" }}>{u.email}</p>
                          </div>
                          <button className="tbl-btn tbl-btn-del" onClick={() => deleteUser(u._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="scroll-x">
                  <table className="adm-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Action</th></tr></thead>
                    <tbody>
                      {users.length === 0
                        ? <tr><td colSpan={3} className="empty-cell">No users found</td></tr>
                        : users.map((u) => (
                          <tr key={u._id}>
                            <td style={{ fontWeight: 500 }}>{u.name}</td>
                            <td style={{ color: T.muted }}>{u.email}</td>
                            <td>
                              <button className="tbl-btn tbl-btn-del" onClick={() => deleteUser(u._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CREATE USER ── */}
          {activeTab === "create" && (
            <div className="form-card">
              <div className="form-head">
                <span className="section-dot" style={{ background: T.amber }} />
                <span className="section-title">Create New User</span>
              </div>
              <div className="form-body">
                <form onSubmit={createUser} className="form-fields">
                  <input
                    className="form-input"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <input
                    className="form-input"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                  />
                  <input
                    className="form-input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button type="submit" className="form-submit">Create User</button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
};

/* ─── SUB-COMPONENTS ─────────────────────────────────────── */
const NavLink = ({ icon, label, active, onClick }) => (
  <button className={`nav-link${active ? " active" : ""}`} onClick={onClick}>
    <Ico d={icon} s={15} />{label}
  </button>
);

const StatCard = ({ title, value, accent }) => (
  <div className="stat-card" style={{ borderLeftColor: accent }}>
    <p className="stat-label">{title}</p>
    <p className="stat-value">{value}</p>
  </div>
);

export default AdminDashboard;
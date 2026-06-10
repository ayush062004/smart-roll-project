import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://smart-roll-backend.onrender.com";

/* ─── DESIGN TOKENS (matches Dashboard) ─────────────────── */
const T = {
  navy:        "#0f1f3d",
  navyLight:   "#162a50",
  gold:        "#c9a84c",
  goldLight:   "#e8c96b",
  bg:          "#f4f6f9",
  surface:     "#ffffff",
  border:      "#e2e8ef",
  textPrimary: "#1a2a40",
  textMuted:   "#64748b",
  red:         "#dc2626",
  green:       "#16a34a",
  sky:         "#0284c7",
  amber:       "#d97706",
  fontSans:    "'Inter', 'Segoe UI', system-ui, sans-serif",
};

/* ─── GLOBAL STYLES ──────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${T.fontSans}; background: ${T.bg}; color: ${T.textPrimary}; }

    .inv-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
    }
    .inv-table thead tr {
      border-bottom: 2px solid ${T.border};
    }
    .inv-table th {
      padding: 10px 14px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${T.textMuted};
      white-space: nowrap;
    }
    .inv-table tbody tr {
      border-bottom: 1px solid ${T.border};
      transition: background 0.15s;
    }
    .inv-table tbody tr:last-child {
      border-bottom: none;
    }
    .inv-table tbody tr:hover {
      background: #f8fafc;
    }
    .inv-table td {
      padding: 11px 14px;
      color: ${T.textPrimary};
      font-size: 13.5px;
      white-space: nowrap;
    }
    .inv-table td.mono {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 13px;
      color: ${T.textMuted};
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .badge-available { background: #dcfce7; color: #15803d; }
    .badge-low       { background: #fef9c3; color: #a16207; }
    .badge-out       { background: #fee2e2; color: #b91c1c; }

    .tbl-btn {
      padding: 5px 12px;
      border: none;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: ${T.fontSans};
      letter-spacing: 0.03em;
      transition: opacity 0.15s, transform 0.15s;
    }
    .tbl-btn:hover { opacity: 0.85; transform: translateY(-1px); }
    .tbl-btn-add    { background: ${T.navy}; color: #fff; margin-right: 6px; }
    .tbl-btn-delete { background: #fee2e2; color: ${T.red}; }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: ${T.surface};
      border: 1px solid ${T.border};
      border-radius: 7px;
      color: ${T.textPrimary};
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: ${T.fontSans};
      transition: background 0.15s, box-shadow 0.15s;
      text-decoration: none;
    }
    .back-btn:hover {
      background: #f1f5f9;
      box-shadow: 0 1px 4px rgba(15,31,61,0.08);
    }

    .stat-card {
      background: ${T.surface};
      border-radius: 10px;
      padding: 20px 24px;
      border-left: 3px solid ${T.gold};
      box-shadow: 0 1px 4px rgba(15,31,61,0.07);
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
      font-size: 30px;
      font-weight: 700;
      color: ${T.textPrimary};
      line-height: 1;
    }

    .section-card {
      background: ${T.surface};
      border-radius: 10px;
      box-shadow: 0 1px 4px rgba(15,31,61,0.07);
      margin-bottom: 24px;
      overflow: hidden;
    }
    .section-card-header {
      padding: 16px 20px;
      border-bottom: 1px solid ${T.border};
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-card-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: ${T.textPrimary};
    }
    .section-card-body {
      overflow-x: auto;
    }

    .loading-screen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${T.bg};
    }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid ${T.border};
      border-top-color: ${T.gold};
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      margin: 0 auto 14px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${T.textMuted};
      text-align: center;
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

    .empty-row td {
      text-align: center;
      padding: 32px;
      color: ${T.textMuted};
      font-size: 13px;
    }
  `}</style>
);

/* ─── INVENTORY ──────────────────────────────────────────── */
const Inventory = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, available: 0, low: 0, out: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const token = localStorage.getItem("token");

  // ================= FETCH FABRICS =================
  const fetchFabrics = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/fabric`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
      let available = 0, low = 0, out = 0;
      res.data.forEach((item) => {
        if (item.availableLength === 0) out++;
        else if (item.availableLength < 20) low++;
        else available++;
      });
      setStats({ total: res.data.length, available, low, out });
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  // ================= FETCH HISTORY =================
  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/fabric/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  // ================= FETCH ALL =================
  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchFabrics(), fetchHistory()]);
    setLoading(false);
  }, [fetchFabrics, fetchHistory]);

  // ================= AUTH + LOAD =================
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchAll();
  }, [token, navigate, fetchAll]);

  // ================= RESIZE =================
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ================= ADD LENGTH =================
  const handleAddLength = async (id) => {
    const input = prompt("Enter length");
    if (!input) return;
    const length = Number(input);
    if (isNaN(length) || length <= 0) { alert("Invalid value ❌"); return; }
    try {
      await axios.post(`${API}/api/fabric/add-length`, { id, length }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Length Added ✅");
      fetchAll();
    } catch { alert("Failed ❌"); }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this roll?");
    if (!ok) return;
    try {
      await axios.delete(`${API}/api/fabric/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted ✅");
      fetchAll();
    } catch { alert("Delete failed ❌"); }
  };

  const getStatus = (item) => {
    if (item.availableLength === 0) return "Out";
    if (item.availableLength < 20)  return "Low";
    return "Available";
  };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <div className="loading-screen">
          <div>
            <div className="spinner" />
            <p className="loading-text">Loading Inventory</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight: "100vh", background: T.bg, padding: isMobile ? "20px 14px" : "36px 32px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p className="page-sub" style={{ marginBottom: "4px" }}>FabricSys · Smart Roll System</p>
            <h1 className="page-heading">Inventory</h1>
          </div>
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          marginBottom: "28px",
        }}>
          <StatCard title="Total Rolls" value={stats.total}     accent={T.gold}  />
          <StatCard title="Available"   value={stats.available} accent={T.green} />
          <StatCard title="Low Stock"   value={stats.low}       accent={T.amber} />
          <StatCard title="Out of Stock" value={stats.out}      accent={T.red}   />
        </div>

        {/* ── FABRIC ROLLS TABLE ── */}
        <div className="section-card">
          <div className="section-card-header">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.gold, flexShrink: 0 }} />
            <span className="section-card-title">Fabric Rolls</span>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: T.textMuted, fontWeight: 500 }}>
              {items.length} roll{items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="section-card-body">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Name</th>
                  <th>Total (m)</th>
                  <th>Remaining (m)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr className="empty-row"><td colSpan={6}>No fabric rolls found</td></tr>
                ) : items.map((item) => {
                  const status = getStatus(item);
                  return (
                    <tr key={item._id}>
                      <td className="mono">{item.rollNumber}</td>
                      <td style={{ fontWeight: 500 }}>{item.name}</td>
                      <td className="mono">{item.totalLength}</td>
                      <td className="mono" style={{
                        color: status === "Out" ? T.red : status === "Low" ? T.amber : T.textPrimary,
                        fontWeight: status !== "Available" ? 600 : 400,
                      }}>
                        {item.availableLength}
                      </td>
                      <td>
                        <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
                      </td>
                      <td>
                        <button className="tbl-btn tbl-btn-add"    onClick={() => handleAddLength(item._id)}>+ Add</button>
                        <button className="tbl-btn tbl-btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── HISTORY TABLE ── */}
        <div className="section-card">
          <div className="section-card-header">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.navy, flexShrink: 0 }} />
            <span className="section-card-title">Transaction History</span>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: T.textMuted, fontWeight: 500 }}>
              {history.length} record{history.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="section-card-body">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Action</th>
                  <th>Length (m)</th>
                  <th>Remaining (m)</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr className="empty-row"><td colSpan={5}>No history records found</td></tr>
                ) : history.map((h, i) => (
                  <tr key={i}>
                    <td className="mono">{h.rollNumber}</td>
                    <td>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        background: h.action === "cut" ? "#fef3c7" : "#e0f2fe",
                        color:       h.action === "cut" ? "#92400e"  : "#075985",
                      }}>
                        {h.action}
                      </span>
                    </td>
                    <td className="mono">{h.length}</td>
                    <td className="mono">{h.remainingLength}</td>
                    <td style={{ fontSize: "12.5px", color: T.textMuted }}>
                      {new Date(h.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

/* ─── STAT CARD ──────────────────────────────────────────── */
const StatCard = ({ title, value, accent }) => (
  <div className="stat-card" style={{ borderLeftColor: accent }}>
    <p className="label">{title}</p>
    <p className="value">{value}</p>
  </div>
);

export default Inventory;
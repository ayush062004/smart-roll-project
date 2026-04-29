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

const Dashboard = () => {
  const navigate = useNavigate();

  const API = "https://smart-roll-backend.onrender.com";

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    used: 0,
    damaged: 0,
  });

  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resize = () => {
      setIsMobile(window.innerWidth < 768);

      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch(`${API}/api/fabric/stats`);
        const statsData = await statsRes.json();

        setStats({
          total: Number(statsData.total) || 0,
          available: Number(statsData.available) || 0,
          used: Number(statsData.used) || 0,
          damaged: Number(statsData.damaged) || 0,
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
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieData = [
    { name: "Available", value: stats.available },
    { name: "Used", value: stats.used },
    { name: "Damaged", value: stats.damaged },
  ];

  const COLORS = ["#38bdf8", "#22c55e", "#ef4444"];

  const goTo = (path) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={layout}>
      {/* MOBILE TOPBAR */}
      {isMobile && (
        <div style={mobileTop}>
          <button
            style={menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <h3 style={{ margin: 0 }}>FabricSys</h3>
        </div>
      )}

      {/* OVERLAY */}
      {isMobile && sidebarOpen && (
        <div
          style={overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        style={{
          ...sidebar,
          left: isMobile
            ? sidebarOpen
              ? "0"
              : "-260px"
            : "0",
        }}
      >
        <h2 style={{ color: "#0ea5e9" }}>🧵 FabricSys</h2>

        <MenuItem
          label="🏠 Dashboard"
          onClick={() => goTo("/dashboard")}
        />

        <MenuItem
          label="📦 Inventory"
          onClick={() => goTo("/inventory")}
        />

        <MenuItem
          label="📱 QR Scanner"
          onClick={() => goTo("/qrscanner")}
        />

        <MenuItem
          label="✂️ Cutting"
          onClick={() => goTo("/cutting")}
        />

        <button
          style={logoutBtn}
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userEmail");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div
        style={{
          ...main,
          marginLeft: isMobile ? "0" : "250px",
        }}
      >
        <h2>🚀 Smart Fabric Dashboard</h2>

        {/* STATS */}
        <div
          style={{
            ...cardGrid,
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : "repeat(4,1fr)",
          }}
        >
          <StatCard title="Total Rolls" value={stats.total} />
          <StatCard title="Available" value={stats.available} />
          <StatCard title="Used" value={stats.used} />
          <StatCard title="Damaged" value={stats.damaged} />
        </div>

        {/* CHARTS */}
        <div
          style={{
            ...chartGrid,
            gridTemplateColumns: isMobile
              ? "1fr"
              : "1fr 1fr",
          }}
        >
          <div style={chartBox}>
            <h3>📦 Inventory</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={chartBox}>
            <h3>✂️ Cutting</h3>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cuts" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK ACTION */}
        <div style={section}>
          <h3>⚡ Quick Actions</h3>

          <div style={actionGrid}>
            <ActionCard
              text="Add Fabric"
              onClick={() => goTo("/addfabric")}
            />

            <ActionCard
              text="Scan QR"
              onClick={() => goTo("/qrscanner")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* COMPONENTS */
const MenuItem = ({ label, onClick }) => (
  <button style={menuItem} onClick={onClick}>
    {label}
  </button>
);

const StatCard = ({ title, value }) => (
  <div style={statCard}>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

const ActionCard = ({ text, onClick }) => (
  <div style={actionCard} onClick={onClick}>
    {text}
  </div>
);

/* STYLES */
const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#f1f5f9",
};

const mobileTop = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "60px",
  background: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "0 15px",
  zIndex: 3000,
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const menuBtn = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.35)",
  zIndex: 1500,
};

const sidebar = {
  width: "250px",
  height: "100%",
  background: "#fff",
  padding: "20px",
  position: "fixed",
  top: 0,
  zIndex: 2000,
  transition: "0.3s",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow: "2px 0 10px rgba(0,0,0,0.08)",
};

const menuItem = {
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: "#f1f5f9",
  textAlign: "left",
};

const logoutBtn = {
  marginTop: "auto",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
};

const main = {
  flex: 1,
  padding: "20px",
  marginTop: "70px",
};

const cardGrid = {
  display: "grid",
  gap: "15px",
};

const statCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center",
};

const chartGrid = {
  display: "grid",
  gap: "20px",
  marginTop: "20px",
};

const chartBox = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
};

const section = {
  marginTop: "30px",
};

const actionGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
};

const actionCard = {
  flex: "1 1 150px",
  padding: "15px",
  background: "#38bdf8",
  color: "#fff",
  borderRadius: "10px",
  textAlign: "center",
  cursor: "pointer",
};

export default Dashboard;
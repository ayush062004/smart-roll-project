import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div style={layout}>
      {/* MOBILE HEADER */}
      {isMobile && (
        <div style={mobileHeader}>
          <button onClick={() => setSidebarOpen(true)} style={menuBtn}>
            ☰
          </button>
          <h3 style={{ margin: 0 }}>⚙️ Admin Panel</h3>
        </div>
      )}

      {/* SIDEBAR */}
      <div
        style={{
          ...sidebar,
          left: isMobile ? (sidebarOpen ? "0" : "-260px") : "0",
        }}
      >
        <h2 style={{ color: "#3b82f6" }}>Fabric Admin</h2>

        <MenuItem label="Dashboard" active={active} setActive={setActive} />
        <MenuItem label="Users" active={active} setActive={setActive} />
        <MenuItem label="Inventory" active={active} setActive={setActive} />
        <MenuItem label="Reports" active={active} setActive={setActive} />

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          style={logoutBtn}
        >
          Logout
        </button>
      </div>

      {/* OVERLAY */}
      {isMobile && sidebarOpen && (
        <div style={overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN */}
      <div
        style={{
          ...main,
          marginLeft: isMobile ? "0" : "250px",
        }}
      >
        {active === "dashboard" && (
          <>
            <h2>📊 Dashboard Overview</h2>

            <div style={grid}>
              <Card title="Total Users" value="45" />
              <Card title="Total Fabric" value="1200" />
              <Card title="Low Stock" value="12" />
              <Card title="Alerts" value="3" />
            </div>

            <div style={section}>
              <h3>⚡ Quick Actions</h3>

              <div style={actionGrid}>
                <ActionBtn text="Add User" />
                <ActionBtn text="Add Fabric" />
                <ActionBtn text="Generate QR" />
              </div>
            </div>
          </>
        )}

        {active === "users" && (
          <>
            <h2>👥 User Management</h2>

            <div style={tableBox}>
              <table style={table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Aman</td>
                    <td>aman@gmail.com</td>
                    <td>
                      <Badge type="admin" />
                    </td>
                    <td>
                      <DeleteBtn />
                    </td>
                  </tr>

                  <tr>
                    <td>Rahul</td>
                    <td>rahul@gmail.com</td>
                    <td>
                      <Badge type="user" />
                    </td>
                    <td>
                      <DeleteBtn />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {active === "inventory" && (
          <>
            <h2>📦 Inventory Control</h2>

            <div style={tableBox}>
              <table style={table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>FR-101</td>
                    <td>Cotton</td>
                    <td>120</td>
                    <td>
                      <Status type="good" />
                    </td>
                    <td>
                      <DeleteBtn />
                    </td>
                  </tr>

                  <tr>
                    <td>FR-102</td>
                    <td>Silk</td>
                    <td>20</td>
                    <td>
                      <Status type="low" />
                    </td>
                    <td>
                      <DeleteBtn />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {active === "reports" && (
          <>
            <h2>📈 Reports</h2>

            <div style={grid}>
              <Card title="Today Cuts" value="45" />
              <Card title="Weekly Usage" value="320m" />
              <Card title="Damaged Rolls" value="5" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* COMPONENTS */

const MenuItem = ({ label, active, setActive }) => {
  const isActive = active.toLowerCase() === label.toLowerCase();

  return (
    <div
      onClick={() => setActive(label.toLowerCase())}
      style={{
        ...menuItem,
        background: isActive ? "#3b82f6" : "#f1f5f9",
        color: isActive ? "#fff" : "#0f172a",
      }}
    >
      {label}
    </div>
  );
};

const Card = ({ title, value }) => (
  <div style={card}>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

const ActionBtn = ({ text }) => <div style={actionBtn}>{text}</div>;

const DeleteBtn = () => <button style={deleteBtn}>Delete</button>;

const Badge = ({ type }) => (
  <span
    style={{
      padding: "5px 10px",
      borderRadius: "20px",
      background: type === "admin" ? "#22c55e" : "#3b82f6",
      color: "#fff",
    }}
  >
    {type}
  </span>
);

const Status = ({ type }) => {
  const color =
    type === "good"
      ? "#22c55e"
      : type === "low"
      ? "#facc15"
      : "#ef4444";

  return (
    <span
      style={{
        padding: "5px 10px",
        borderRadius: "20px",
        background: color,
        color: "#000",
      }}
    >
      {type}
    </span>
  );
};

/* STYLES */

const layout = {
  display: "flex",
  background: "#f8fafc",
  color: "#0f172a",
  minHeight: "100vh",
};

const sidebar = {
  width: "250px",
  background: "#ffffff",
  padding: "20px",
  position: "fixed",
  height: "100%",
  transition: "0.3s",
  zIndex: 1000,
  borderRight: "1px solid #e2e8f0",
};

const main = {
  flex: 1,
  padding: "20px",
  width: "100%",
  marginTop: "60px",
};

const menuItem = {
  padding: "12px",
  marginTop: "10px",
  borderRadius: "8px",
  cursor: "pointer",
};

const card = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: "15px",
  marginTop: "20px",
};

const section = {
  marginTop: "30px",
};

const actionGrid = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
  flexWrap: "wrap",
};

const actionBtn = {
  padding: "10px 15px",
  background: "#3b82f6",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
};

const tableBox = {
  overflowX: "auto",
  marginTop: "20px",
  background: "#ffffff",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const deleteBtn = {
  padding: "5px 10px",
  background: "#ef4444",
  border: "none",
  color: "white",
  borderRadius: "5px",
};

const logoutBtn = {
  marginTop: "20px",
  padding: "10px",
  background: "#ef4444",
  border: "none",
  color: "white",
  borderRadius: "6px",
};

const mobileHeader = {
  position: "fixed",
  top: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  background: "#ffffff",
  zIndex: 1100,
  borderBottom: "1px solid #e2e8f0",
};

const menuBtn = {
  fontSize: "20px",
  background: "none",
  border: "none",
  color: "#0f172a",
};

const overlay = {
  position: "fixed",
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.3)",
  zIndex: 999,
};

export default AdminPanel;
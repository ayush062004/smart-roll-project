import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inventory = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    low: 0,
    out: 0
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchFabrics();
    fetchHistory();

    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const fetchFabrics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fabric");

      setItems(res.data);

      let available = 0;
      let low = 0;
      let out = 0;

      res.data.forEach((item) => {
        if (item.availableLength === 0) out++;
        else if (item.availableLength < 20) low++;
        else available++;
      });

      setStats({
        total: res.data.length,
        available,
        low,
        out
      });

    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fabric/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLength = async (id) => {
    let input = prompt("Enter length to add:");
    if (input === null) return;

    if (input.trim() === "") {
      alert("Enter value ❌");
      return;
    }

    const length = Number(input);

    if (isNaN(length) || length <= 0) {
      alert("Enter valid number ❌");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/fabric/add-length", {
        id,
        length
      });

      alert("Length added ✅");

      fetchFabrics();
      fetchHistory();

    } catch (err) {
      alert("Error ❌");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this roll?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/fabric/${item._id}`);

      alert("Deleted 🗑");

      fetchFabrics();
      fetchHistory();

    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={topBar}>
        <button style={backBtn} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2>
          📦 Smart Inventory System
        </h2>
      </div>

      {/* STATS */}
      <div style={{
        ...statsGrid,
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)"
      }}>
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Available" value={stats.available} />
        <StatCard title="Low Stock" value={stats.low} />
        <StatCard title="Out" value={stats.out} />
      </div>

      {/* TABLE */}
      <div style={tableWrapper}>
        <div style={tableBox}>
          <table style={table}>
            <thead>
              <tr style={theadRow}>
                <th style={th}>Roll</th>
                <th style={th}>Name</th>
                <th style={th}>Total</th>
                <th style={th}>Remaining</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                let status = "Available";
                if (item.availableLength === 0) status = "Out";
                else if (item.availableLength < 20) status = "Low";

                return (
                  <tr key={item._id} style={tr}>
                    <td style={td}>{item.rollNumber}</td>
                    <td style={td}>{item.name}</td>
                    <td style={td}>{item.totalLength}</td>
                    <td style={td}>{item.availableLength}</td>

                    <td style={td}>
                      <span style={getStatusStyle(status)}>
                        {status}
                      </span>
                    </td>

                    <td style={td}>
                      <div style={actionWrap}>
                        <button
                          onClick={() => handleAddLength(item._id)}
                          style={addBtn}
                        >
                          ➕ Add
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          style={deleteBtn}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTORY */}
      <div style={tableWrapper}>
        <div style={historyBox}>
          <h3>📜 Activity History</h3>

          <table style={table}>
            <thead>
              <tr style={theadRow}>
                <th style={th}>Roll</th>
                <th style={th}>Action</th>
                <th style={th}>Length</th>
                <th style={th}>Remaining</th>
                <th style={th}>Time</th>
              </tr>
            </thead>

            <tbody>
              {history.map((h, i) => (
                <tr key={i} style={tr}>
                  <td style={td}>{h.rollNumber}</td>

                  <td style={td}>
                    <span style={{
                      color:
                        h.action === "ADD" ? "#16a34a" :
                        h.action === "CUT" ? "#ca8a04" :
                        "#dc2626"
                    }}>
                      {h.action}
                    </span>
                  </td>

                  <td style={td}>{h.length}</td>
                  <td style={td}>{h.remainingLength}</td>
                  <td style={td}>
                    {new Date(h.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

/* COMPONENT */
const StatCard = ({ title, value }) => (
  <div style={statCard}>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

/* STATUS STYLE */
const getStatusStyle = (status) => {
  const base = {
    padding: "5px 10px",
    borderRadius: "10px",
    color: "#fff"
  };

  if (status === "Available") return { ...base, background: "#22c55e" };
  if (status === "Low") return { ...base, background: "#facc15", color: "#000" };
  return { ...base, background: "#ef4444" };
};

/* STYLES (🔥 BRIGHT) */
const container = {
  padding: "20px",
  background: "#f1f5f9",
  color: "#0f172a",
  minHeight: "100vh"
};

const topBar = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap"
};

const backBtn = {
  padding: "8px 12px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const statsGrid = {
  display: "grid",
  gap: "15px",
  margin: "20px 0"
};

const statCard = {
  background: "#ffffff",
  padding: "15px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const tableWrapper = {
  overflowX: "auto"
};

const tableBox = {
  background: "#ffffff",
  padding: "15px",
  borderRadius: "12px",
  minWidth: "600px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const historyBox = {
  marginTop: "30px",
  background: "#ffffff",
  padding: "15px",
  borderRadius: "12px",
  minWidth: "600px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const table = { width: "100%" };
const th = { padding: "10px", textAlign: "left" };
const td = { padding: "10px" };
const tr = { borderBottom: "1px solid #e2e8f0" };
const theadRow = {};

const actionWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: "5px"
};

const addBtn = {
  background: "#22c55e",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  color: "#fff"
};

const deleteBtn = {
  background: "#ef4444",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  color: "white"
};

export default Inventory;
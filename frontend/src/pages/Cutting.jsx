import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cutting = () => {
  const navigate = useNavigate();

  const [roll, setRoll] = useState("");
  const [cutAmount, setCutAmount] = useState("");
  const [rolls, setRolls] = useState([]);
  const [history, setHistory] = useState([]);

  const API = "https://smart-roll-backend.onrender.com";

  useEffect(() => {
    fetchFabrics();
    fetchHistory();
  }, []);

  const fetchFabrics = async () => {
    try {
      const res = await axios.get(`${API}/api/fabric`);
      setRolls(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${API}/api/fabric/cut-history`,
        { withCredentials: true }
      );
      setHistory(res.data);
    } catch (err) {
      console.error("History error:", err);
    }
  };

  const selectedRoll = rolls.find((r) => r._id === roll);

  const handleCut = async () => {
    if (!roll || !cutAmount) {
      alert("Select roll & enter cut amount ❗");
      return;
    }

    const cutLength = Number(cutAmount);

    if (cutLength > selectedRoll.availableLength) {
      alert("Not enough stock ❌");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/fabric/cut`,
        {
          id: roll,
          cutLength: cutLength
        },
        { withCredentials: true }
      );

      const updatedFabric = res.data;

      setRolls((prev) =>
        prev.map((item) =>
          item._id === roll ? updatedFabric : item
        )
      );

      await fetchHistory();

      setCutAmount("");

      alert("Cut successful ✂️ ✅");

    } catch (err) {
      console.error("CUT ERROR 👉", err.response?.data || err.message);
      alert(err?.response?.data?.message || "Cut failed ❌");
    }
  };

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={topBar}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          ⬅ Back
        </button>

        <h2 style={{ margin: 0, fontSize: "clamp(20px,4vw,28px)" }}>
          ✂️ Cutting Management
        </h2>
      </div>

      {/* FORM */}
      <div style={card}>
        <select value={roll} onChange={(e) => setRoll(e.target.value)} style={input}>
          <option value="">Select Fabric Roll</option>
          {rolls.map((r) => (
            <option key={r._id} value={r._id}>
              {r.rollNumber} - {r.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter cut amount"
          value={cutAmount}
          onChange={(e) => setCutAmount(e.target.value)}
          style={input}
        />

        <button onClick={handleCut} style={btn}>
          Cut Fabric
        </button>
      </div>

      {/* PREVIEW */}
      {selectedRoll && (
        <div style={previewCard}>
          <p>Total: {selectedRoll.totalLength}</p>
          <p>Remaining: {selectedRoll.availableLength}</p>
          <p>
            After Cut: {selectedRoll.availableLength - (cutAmount || 0)}
          </p>
        </div>
      )}

      {/* TABLE */}
      <div style={tableWrapper}>
        <div style={tableBox}>
          <h3>📜 Cutting History</h3>

          <table style={table}>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Name</th>
                <th>Cut</th>
                <th>Remaining</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>{item.rollNumber}</td>
                  <td>{item.name}</td>
                  <td>{item.cutLength}</td>
                  <td>{item.remainingLength}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

/* 🎨 BRIGHT THEME */

const container = {
  padding: "20px",
  background: "#f1f5f9",
  color: "#0f172a",
  minHeight: "100vh"
};

const topBar = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "20px"
};

const backBtn = {
  padding: "8px 12px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const card = {
  padding: "20px",
  background: "#ffffff",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "500px",
  marginBottom: "20px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
};

const input = {
  padding: "10px",
  marginBottom: "10px",
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  outline: "none"
};

const btn = {
  padding: "10px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer"
};

const previewCard = {
  marginTop: "10px",
  padding: "15px",
  background: "#ffffff",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const tableWrapper = {
  overflowX: "auto"
};

const tableBox = {
  marginTop: "20px",
  background: "#ffffff",
  padding: "15px",
  borderRadius: "12px",
  minWidth: "600px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
};

const table = {
  width: "100%"
};

export default Cutting;
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://smart-roll-backend.onrender.com";

const Cutting = () => {
  const navigate = useNavigate();

  const [roll, setRoll] = useState("");
  const [cutAmount, setCutAmount] = useState("");
  const [rolls, setRolls] = useState([]);
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  // ================= FETCH FABRICS =================
  const fetchFabrics = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/fabric`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRolls(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  // ================= FETCH HISTORY =================
  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/fabric/cut-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  // ================= USE EFFECT =================
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchFabrics();
    fetchHistory();
  }, [navigate, token, fetchFabrics, fetchHistory]);

  const selectedRoll = rolls.find((r) => r._id === roll);

  // ================= CUT FABRIC =================
  const handleCut = async () => {
    if (!roll || !cutAmount) {
      alert("Select roll first ❌");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/fabric/cut`,
        {
          id: roll,
          cutLength: Number(cutAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedFabric = res.data;

      setRolls((prev) =>
        prev.map((item) =>
          item._id === roll ? updatedFabric : item
        )
      );

      await fetchHistory();

      setCutAmount("");

      alert("Cut Successful ✅");
    } catch (err) {
      console.log(err.response?.data);

      alert(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Cut Failed ❌"
      );
    }
  };

  return (
    <div style={container}>
      <div style={topBar}>
  <div>
    <p
      style={{
        fontSize: "12px",
        color: "#64748b",
        margin: 0,
        marginBottom: "4px",
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}
    >
      Inventory Management
    </p>

    <h1
      style={{
        margin: 0,
        color: "#0f1f3d",
        fontSize: "34px",
        fontWeight: "700",
      }}
    >
      Cutting Management
    </h1>
  </div>

  <button
    onClick={() => navigate("/dashboard")}
    style={backBtn}
  >
    ← Dashboard
  </button>
</div>

      {/* FORM */}
      <div style={card}>
        <select
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          style={input}
        >
          <option value="">Select Roll</option>

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
            After Cut:{" "}
            {selectedRoll.availableLength -
              Number(cutAmount || 0)}
          </p>
        </div>
      )}

      {/* HISTORY */}
      <div style={tableBox}>
        <h3>📜 Cutting History</h3>

        <table style={table}>
          <thead>
  <tr
    style={{
      background: "#0f1f3d",
      color: "#fff",
    }}
  >
    <th style={{ padding: "12px" }}>Roll</th>
    <th style={{ padding: "12px" }}>Name</th>
    <th style={{ padding: "12px" }}>Cut</th>
    <th style={{ padding: "12px" }}>Remaining</th>
    <th style={{ padding: "12px" }}>Time</th>
  </tr>
</thead>

          <tbody>
            {history.map((item) => (
              <tr key={item._id}>
                <td>{item.rollNumber}</td>
                <td>{item.name}</td>
                <td>{item.cutLength}</td>
                <td>{item.remainingLength}</td>
                <td>
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* UI */

const container = {
  padding: "30px",
  background: "#f4f6f9",
  minHeight: "100vh",
  color: "#1a2a40",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "30px",
  paddingBottom: "18px",
  borderBottom: "1px solid #e2e8ef",
};

const backBtn = {
  padding: "10px 16px",
  background: "#0f1f3d",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  minWidth: "140px",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "18px",
  maxWidth: "600px",
  border: "1px solid #e2e8ef",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #dbe3ec",
  background: "#fff",
  color: "#1a2a40",
  fontSize: "14px",
  boxSizing: "border-box",
};

const btn = {
  width: "100%",
  padding: "14px",
  background: "#c9a84c",
  color: "#0f1f3d",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 4px 12px rgba(201,168,76,0.35)",
};

const previewCard = {
  marginTop: "20px",
  background: "#fff",
  padding: "20px",
  borderRadius: "18px",
  maxWidth: "600px",
  border: "1px solid #e2e8ef",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
};

const tableBox = {
  marginTop: "30px",
  background: "#fff",
  padding: "15px",
  borderRadius: "18px",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  border: "1px solid #e2e8ef",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
};

const table = {
  width: "100%",
  minWidth: "700px",
  borderCollapse: "collapse",
};

export default Cutting;
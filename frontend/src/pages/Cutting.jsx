import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://smart-roll-backend.onrender.com";

// 🔥 VERY IMPORTANT
axios.defaults.withCredentials = true;

const Cutting = () => {
  const navigate = useNavigate();

  const [roll, setRoll] = useState("");
  const [cutAmount, setCutAmount] = useState("");
  const [rolls, setRolls] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchFabrics();
    fetchHistory();
  }, []);

  const fetchFabrics = async () => {
    try {
      const res = await axios.get(`${API}/api/fabric`);
      setRolls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/api/fabric/cut-history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedRoll = rolls.find((r) => r._id === roll);

  const handleCut = async () => {
    if (!roll || !cutAmount) {
      alert("Select roll first ❌");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/fabric/cut`, {
        id: roll,
        cutLength: Number(cutAmount),
      });

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
      alert(err.response?.data?.msg || "Cut Failed ❌");
    }
  };

  return (
    <div style={container}>
      <div style={topBar}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          ⬅ Back
        </button>

        <h2>✂️ Cutting Management</h2>
      </div>

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

      {selectedRoll && (
        <div style={previewCard}>
          <p>Total: {selectedRoll.totalLength}</p>
          <p>Remaining: {selectedRoll.availableLength}</p>
          <p>
            After Cut:{" "}
            {selectedRoll.availableLength - Number(cutAmount || 0)}
          </p>
        </div>
      )}

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
                <td>
                  {new Date(item.createdAt).toLocaleString()}
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
  padding: "20px",
  background: "#f1f5f9",
  minHeight: "100vh",
};

const topBar = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const backBtn = {
  padding: "8px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  maxWidth: "500px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
};

const previewCard = {
  marginTop: "20px",
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  maxWidth: "500px",
};

const tableBox = {
  marginTop: "20px",
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  overflowX: "auto",
};

const table = {
  width: "100%",
};

export default Cutting;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddFabric() {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [form, setForm] = useState({
    name: "",
    totalLength: "",
    type: ""
  });

  const [qr, setQr] = useState("");
  const [roll, setRoll] = useState("");

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/fabric/add",
        form
      );

      setQr(res.data.fabric.qrCode);
      setRoll(res.data.fabric.rollNumber);

      alert("Fabric Added ✅");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR</title>
          <style>
            body { text-align: center; font-family: Arial; background:#f8fafc; }
            img { width: 250px; }
          </style>
        </head>
        <body>
          <h2>Fabric QR</h2>
          <p><b>${roll}</b></p>
          <img src="${qr}" />
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={container}>

      {/* TOPBAR */}
      <div style={topbar}>
        <button onClick={() => navigate("/dashboard")} style={backBtn}>
          ⬅ Back
        </button>

        <h2 style={{ margin: 0, fontSize: isMobile ? "18px" : "24px" }}>
          ➕ Add Fabric
        </h2>
      </div>

      {/* FORM */}
      <div style={{
        ...card,
        maxWidth: isMobile ? "100%" : "400px"
      }}>
        <input
          name="name"
          placeholder="Fabric Name"
          onChange={handleChange}
          style={input}
        />

        <input
          name="totalLength"
          placeholder="Total Length"
          onChange={handleChange}
          style={input}
        />

        <input
          name="type"
          placeholder="Type"
          onChange={handleChange}
          style={input}
        />

        <button style={btn} onClick={handleSubmit}>
          Add Fabric
        </button>
      </div>

      {/* QR RESULT */}
      {qr && (
        <div style={{
          ...qrCard,
          width: isMobile ? "100%" : "350px",
          margin: "30px auto"
        }}>
          <h3>📦 QR Code Generated</h3>

          <p><b>{roll}</b></p>

          <img
            src={qr}
            alt="QR Code"
            style={{
              ...qrImg,
              width: isMobile ? "160px" : "200px"
            }}
          />

          <button style={printBtn} onClick={handlePrint}>
            🖨 Print QR
          </button>
        </div>
      )}

    </div>
  );
}

/* 🎨 BRIGHT THEME STYLES */

const container = {
  padding: "20px",
  background: "#f8fafc",
  minHeight: "100vh",
  color: "#0f172a"
};

const topbar = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px"
};

const backBtn = {
  padding: "6px 12px",
  background: "#3b82f6",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  color: "#fff"
};

const card = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  margin: "auto",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  outline: "none",
  background: "#fff",
  color: "#0f172a"
};

const btn = {
  padding: "10px",
  background: "#3b82f6",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  color: "#fff"
};

const qrCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const qrImg = {
  marginTop: "10px"
};

const printBtn = {
  marginTop: "15px",
  padding: "10px 20px",
  background: "#22c55e",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#fff"
};

export default AddFabric;
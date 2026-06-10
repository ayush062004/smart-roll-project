import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://smart-roll-backend.onrender.com";

function AddFabric() {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [form, setForm] = useState({
    name: "",
    totalLength: "",
    type: "",
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
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API}/api/fabric/add`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setQr(res.data.fabric.qrCode);
    setRoll(res.data.fabric.rollNumber);

    alert("Fabric Added ✅");

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.msg || "Unauthorized ❌");
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
<div
  style={{
    display: "flex",
    alignItems: isMobile ? "flex-start" : "center",
    justifyContent: "space-between",
    flexDirection: isMobile ? "column" : "row",
    gap: "15px",
    marginBottom: "30px",
  }}
>
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
        fontSize: isMobile ? "26px" : "34px",
        fontWeight: "700",
      }}
    >
      Add Fabric Roll
    </h1>
  </div>

  <button
    onClick={() => navigate("/dashboard")}
    style={{
      padding: "10px 18px",
      background: "#0f1f3d",
      border: "none",
      borderRadius: "10px",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    ← Dashboard
  </button>
</div>

      {/* FORM */}
      <div
        style={{
          ...card,
          maxWidth: isMobile ? "100%" : "400px",
        }}
      >
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

        <button
  style={{
    ...btn,
    marginTop: "5px",
    boxShadow: "0 4px 12px rgba(201,168,76,0.35)",
  }}
  onClick={handleSubmit}
>
  + Add Fabric Roll
</button>
      </div>

      {/* QR RESULT */}
      {qr && (
        <div
          style={{
            ...qrCard,
            width: isMobile ? "100%" : "350px",
            margin: "30px auto",
          }}
        >
         <h3
  style={{
    color: "#0f1f3d",
    marginBottom: "10px",
  }}
>
  Fabric QR Generated
</h3>
          <p>
            <b>{roll}</b>
          </p>

          <img
            src={qr}
            alt="QR Code"
            style={{
              ...qrImg,
              width: isMobile ? "160px" : "200px",
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
  padding: "30px",
  background: "#f4f6f9",
  minHeight: "100vh",
  color: "#1a2a40",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  margin: "auto",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
  border: "1px solid #e2e8ef",
};

const input = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #dbe3ec",
  outline: "none",
  background: "#fff",
  color: "#1a2a40",
  fontSize: "14px",
  transition: "0.2s",
};

const btn = {
  padding: "14px",
  background: "#c9a84c",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
  color: "#0f1f3d",
  fontSize: "15px",
};

const qrCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "18px",
  textAlign: "center",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
  border: "1px solid #e2e8ef",
};

const qrImg = {
  marginTop: "15px",
  borderRadius: "10px",
};

const printBtn = {
  marginTop: "18px",
  padding: "12px 22px",
  background: "#16a34a",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  color: "#fff",
};

export default AddFabric;
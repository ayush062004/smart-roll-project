import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QRScanner = () => {
  const navigate = useNavigate();

  const API = "https://smart-roll-backend.onrender.com";

  const [fabric, setFabric] = useState(null);
  const [scannerOn, setScannerOn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startScan = () => {
    setScannerOn(true);

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: isMobile ? 200 : 250
        },
        false
      );

      scanner.render(
        async (result) => {
          try {
            const parsed = JSON.parse(result);

            const res = await axios.get(
              `${API}/api/fabric/qr/${parsed.rollNumber}`
            );

            setFabric(res.data);
          } catch (err) {
            console.error(err);
            alert("QR error ❌");
          }

          scanner.clear();
          setScannerOn(false);
        },
        () => {}
      );
    }, 300);
  };

  const handleCut = async () => {
    const cutLength = prompt("Enter cut length:");
    if (!cutLength) return;

    try {
      const res = await axios.post(
        `${API}/api/fabric/cut`,
        {
          id: fabric._id,
          cutLength: Number(cutLength)
        }
      );

      alert("Cut Successful ✂️");
      setFabric(res.data.fabric || res.data);
    } catch (err) {
      console.error(err);
      alert("Cut failed ❌");
    }
  };

  return (
    <div style={container}>

      {/* TOPBAR */}
      <div style={topbar}>
        <button
          onClick={() => navigate("/dashboard")}
          style={backBtn}
        >
          ⬅ Back
        </button>

        <h3 style={{ margin: 0 }}>📱 QR Scanner</h3>
      </div>

      {/* HEADER */}
      <div style={header}>
        <p>Scan fabric QR to get instant stock details</p>
      </div>

      {/* SCANNER */}
      <div style={scannerBox}>
        <div
          style={{
            ...scanFrame,
            width: isMobile ? "100%" : "320px",
            maxWidth: "350px",
            height: isMobile ? "260px" : "320px"
          }}
        >
          <div style={scanLine}></div>

          {scannerOn ? (
            <div id="reader" style={{ width: "100%" }}></div>
          ) : (
            <p style={{ opacity: 0.6 }}>Camera Preview Area</p>
          )}
        </div>

        <button style={scanBtn} onClick={startScan}>
          Start Scan 📷
        </button>
      </div>

      {/* RESULT */}
      {fabric && (
        <div style={resultCard}>
          <h3>📦 Fabric Details</h3>

          <p><b>Roll ID:</b> {fabric.rollNumber}</p>
          <p><b>Name:</b> {fabric.name}</p>
          <p><b>Total:</b> {fabric.totalLength} meters</p>

          <p style={{ color: "#16a34a" }}>
            <b>Remaining:</b> {fabric.availableLength} meters
          </p>

          <p style={{ color: "#dc2626" }}>
            <b>Used:</b>{" "}
            {fabric.totalLength - fabric.availableLength} meters
          </p>

          <button
            onClick={handleCut}
            style={cutBtn}
          >
            ✂️ Cut Fabric
          </button>
        </div>
      )}

      {/* INFO */}
      <div
        style={{
          ...infoGrid,
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(3,1fr)"
        }}
      >
        <div style={infoCard}>
          <h4>⚡ Fast Scan</h4>
          <p>Instant QR detection system</p>
        </div>

        <div style={infoCard}>
          <h4>📦 Live Data</h4>
          <p>Real-time backend tracking</p>
        </div>

        <div style={infoCard}>
          <h4>🔗 API Connected</h4>
          <p>Fully integrated with database</p>
        </div>
      </div>

    </div>
  );
};

/* 🎨 STYLES */

const container = {
  padding: "20px",
  background: "#f1f5f9",
  color: "#0f172a",
  minHeight: "100vh"
};

const topbar = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
  flexWrap: "wrap"
};

const backBtn = {
  padding: "6px 12px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const header = {
  marginBottom: "20px",
  textAlign: "center",
  color: "#475569"
};

const scannerBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
  marginBottom: "30px"
};

const scanFrame = {
  border: "2px dashed #3b82f6",
  borderRadius: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  background: "#ffffff",
  overflow: "hidden",
  boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
};

const scanLine = {
  position: "absolute",
  width: "100%",
  height: "2px",
  background: "#3b82f6",
  top: "0"
};

const scanBtn = {
  padding: "10px 20px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer"
};

const resultCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "25px",
  width: "100%",
  maxWidth: "500px",
  marginInline: "auto",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
};

const cutBtn = {
  marginTop: "15px",
  padding: "10px 20px",
  background: "#ef4444",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer"
};

const infoGrid = {
  display: "grid",
  gap: "15px"
};

const infoCard = {
  background: "#ffffff",
  padding: "15px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

export default QRScanner;
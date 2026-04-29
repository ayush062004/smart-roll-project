import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QRScanner = () => {
  const navigate = useNavigate();

  const API = "https://smart-roll-backend.onrender.com";
  const token = localStorage.getItem("token");

  const [fabric, setFabric] = useState(null);
  const [scannerOn, setScannerOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const resize = () =>
      setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", resize);

    return () =>
      window.removeEventListener("resize", resize);
  }, []);

  const startScan = () => {
    setScannerOn(true);

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: isMobile ? 220 : 260,
        },
        false
      );

      scanner.render(
        async (result) => {
          try {
            setLoading(true);

            const parsed = JSON.parse(result);

            const res = await axios.get(
              `${API}/api/fabric/qr/${parsed.rollNumber}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setFabric(res.data);
          } catch (err) {
            alert("QR Scan Failed ❌");
          } finally {
            setLoading(false);
            scanner.clear();
            setScannerOn(false);
          }
        },
        () => {}
      );
    }, 300);
  };

  const handleCut = async () => {
    const input = prompt("Enter cut length:");

    if (!input) return;

    const cutLength = Number(input);

    if (isNaN(cutLength) || cutLength <= 0) {
      alert("Enter valid length ❌");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/fabric/cut`,
        {
          id: fabric._id,
          cutLength,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Cut Successful ✂️");
      setFabric(res.data.fabric || res.data);
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Cut Failed ❌"
      );
    }
  };

  return (
    <div style={styles.page}>
      {/* TOPBAR */}
      <div style={styles.topbar}>
        <button
          style={styles.backBtn}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back
        </button>

        <h2 style={{ margin: 0 }}>
          📱 QR Scanner
        </h2>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.heading}>
          Smart Fabric Scanner
        </h1>

        <p style={styles.sub}>
          Scan roll QR and manage live
          inventory instantly.
        </p>
      </div>

      {/* SCANNER */}
      <div style={styles.card}>
        <div
          style={{
            ...styles.scanArea,
            height: isMobile
              ? "280px"
              : "340px",
          }}
        >
          {scannerOn ? (
            <div
              id="reader"
              style={{ width: "100%" }}
            ></div>
          ) : (
            <>
              <div style={styles.scanLine}></div>
              <p style={styles.scanText}>
                Camera Preview Area
              </p>
            </>
          )}
        </div>

        <button
          style={styles.scanBtn}
          onClick={startScan}
          disabled={scannerOn}
        >
          {scannerOn
            ? "Scanning..."
            : "Start Scan 📷"}
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div style={styles.loading}>
          Loading...
        </div>
      )}

      {/* RESULT */}
      {fabric && (
        <div style={styles.result}>
          <h3 style={{ marginTop: 0 }}>
            📦 Fabric Details
          </h3>

          <div style={styles.grid}>
            <Info
              label="Roll No"
              value={fabric.rollNumber}
            />
            <Info
              label="Name"
              value={fabric.name}
            />
            <Info
              label="Type"
              value={fabric.type}
            />
            <Info
              label="Total"
              value={`${fabric.totalLength} m`}
            />
            <Info
              label="Remaining"
              value={`${fabric.availableLength} m`}
            />
            <Info
              label="Used"
              value={`${
                fabric.totalLength -
                fabric.availableLength
              } m`}
            />
          </div>

          <button
            style={styles.cutBtn}
            onClick={handleCut}
          >
            ✂️ Cut Fabric
          </button>
        </div>
      )}

      {/* FEATURES */}
      <div
        style={{
          ...styles.features,
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(3,1fr)",
        }}
      >
        <Feature
          title="⚡ Fast Scan"
          text="Quick QR detection with live camera."
        />

        <Feature
          title="📦 Live Stock"
          text="Real-time inventory updates."
        />

        <Feature
          title="🔒 Secure API"
          text="Connected with backend token auth."
        />
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div style={styles.infoCard}>
    <small style={styles.label}>
      {label}
    </small>
    <strong>{value}</strong>
  </div>
);

const Feature = ({
  title,
  text,
}) => (
  <div style={styles.featureCard}>
    <h4>{title}</h4>
    <p>{text}</p>
  </div>
);

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background:
      "linear-gradient(135deg,#eff6ff,#f8fafc)",
    color: "#0f172a",
  },

  topbar: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  backBtn: {
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  hero: {
    textAlign: "center",
    marginBottom: "25px",
  },

  heading: {
    margin: 0,
    fontSize: "32px",
  },

  sub: {
    color: "#64748b",
    marginTop: "10px",
  },

  card: {
    maxWidth: "500px",
    margin: "0 auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  scanArea: {
    border:
      "2px dashed #3b82f6",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    background: "#f8fafc",
  },

  scanText: {
    color: "#64748b",
  },

  scanLine: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "3px",
    background: "#3b82f6",
    animation:
      "moveLine 2s infinite",
  },

  scanBtn: {
    marginTop: "18px",
    width: "100%",
    border: "none",
    padding: "12px",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  loading: {
    textAlign: "center",
    marginTop: "20px",
    fontWeight: "bold",
  },

  result: {
    maxWidth: "700px",
    margin: "25px auto 0",
    background: "#fff",
    padding: "22px",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(150px,1fr))",
    gap: "12px",
    marginTop: "15px",
  },

  infoCard: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "12px",
  },

  label: {
    display: "block",
    color: "#64748b",
    marginBottom: "6px",
  },

  cutBtn: {
    marginTop: "18px",
    width: "100%",
    border: "none",
    padding: "13px",
    borderRadius: "12px",
    background: "#ef4444",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  features: {
    display: "grid",
    gap: "15px",
    marginTop: "30px",
  },

  featureCard: {
    background: "#fff",
    padding: "18px",
    borderRadius: "18px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
};

export default QRScanner;
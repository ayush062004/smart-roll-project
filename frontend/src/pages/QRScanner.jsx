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
      QR Scanner
    </h1>
  </div>

  <button
    style={styles.backBtn}
    onClick={() => navigate("/dashboard")}
  >
    ← Dashboard
  </button>
</div>

<div style={styles.hero}>
  <p
    style={{
      color: "#64748b",
      marginTop: 0,
      fontSize: "15px",
    }}
  >
    Scan fabric rolls and manage inventory instantly.
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
          <h3
  style={{
    marginTop: 0,
    color: "#0f1f3d",
    fontWeight: "700",
  }}
>
  Fabric Details
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
  padding: "30px",
  background: "#f4f6f9",
  color: "#1a2a40",
},

  topbar: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "30px",
  paddingBottom: "18px",
  borderBottom: "1px solid #e2e8ef",
},


 backBtn: {
  padding: "10px 18px",
  background: "#0f1f3d",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
},

  hero: {
  textAlign: "center",
  marginBottom: "30px",
},

  heading: {
  margin: 0,
  fontSize: "36px",
  color: "#0f1f3d",
  fontWeight: "700",
},
card: {
  maxWidth: "550px",
  margin: "0 auto",
  background: "#fff",
  padding: "30px",
  borderRadius: "18px",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
  border: "1px solid #e2e8ef",
},

  sub: {
    color: "#64748b",
    marginTop: "10px",
  },

  

  scanArea: {
  border: "2px dashed #c9a84c",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
  background: "#fafafa",
},

  scanText: {
    color: "#64748b",
  },

  scanLine: {
  position: "absolute",
  top: 0,
  width: "100%",
  height: "3px",
  background: "#c9a84c",
},

  scanBtn: {
  marginTop: "18px",
  width: "100%",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  background: "#c9a84c",
  color: "#0f1f3d",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(201,168,76,0.35)",
},

  loading: {
    textAlign: "center",
    marginTop: "20px",
    fontWeight: "bold",
  },

  result: {
  maxWidth: "800px",
  margin: "30px auto 0",
  background: "#fff",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
  border: "1px solid #e2e8ef",
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
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e2e8ef",
},

  label: {
    display: "block",
    color: "#64748b",
    marginBottom: "6px",
  },

  cutBtn: {
  marginTop: "20px",
  width: "100%",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  background: "#dc2626",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
},

  features: {
    display: "grid",
    gap: "15px",
    marginTop: "30px",
  },

  featureCard: {
  background: "#fff",
  padding: "22px",
  borderRadius: "18px",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
  border: "1px solid #e2e8ef",
  textAlign: "center",
},
};

export default QRScanner;
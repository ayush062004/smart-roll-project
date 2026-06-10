import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1400&q=80"
  ];

  const [bgIndex, setBgIndex] = useState(0);
  const [loaded, setLoaded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoaded(false);

      setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % images.length);
        setLoaded(true);
      }, 200);
    }, 2500);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div
        style={{
          ...styles.navbar,
          padding: isMobile ? "15px 20px" : "20px 40px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <div>
  <p
    style={{
      margin: 0,
      color: "#64748b",
      fontSize: "11px",
      letterSpacing: "1px",
      textTransform: "uppercase",
    }}
  >
    Textile ERP
  </p>

  <h2 style={styles.logo}>
    FabricSys
  </h2>
</div>

        <div style={styles.navActions}>
          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            style={styles.adminBtn}
            onClick={() => navigate("/adminlogin")}
          >
            Admin
          </button>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          ...styles.hero,
          padding: isMobile ? "50px 20px" : "80px 40px",
          flexDirection: isMobile ? "column" : "row",
          backgroundImage: `url(${images[bgIndex]})`,
          opacity: loaded ? 1 : 0.7
        }}
      >
        <div style={styles.overlay}></div>

        <div
          style={{
            ...styles.heroText,
            maxWidth: isMobile ? "100%" : "500px",
            textAlign: isMobile ? "center" : "left"
          }}
        >
          <>
  <p
    style={{
      color: "#c9a84c",
      letterSpacing: "2px",
      textTransform: "uppercase",
      fontSize: "13px",
      marginBottom: "10px",
    }}
  >
    Smart Inventory Platform
  </p>

  <h1
    style={{
      ...styles.title,
      fontSize: isMobile ? "34px" : "52px",
      fontWeight: "700",
      lineHeight: "1.2",
    }}
  >
    Smart Fabric
    <br />
    Management System
  </h1>
</>

          <p style={styles.subtitle}>
            Track inventory, scan QR, manage cutting &
            monitor usage — all in one powerful dashboard.
          </p>

          <div
            style={{
              ...styles.heroBtns,
              justifyContent: isMobile ? "center" : "flex-start",
              flexWrap: "wrap"
            }}
          >
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() => navigate("/adminlogin")}
            >
              Admin Panel
            </button>
          </div>
        </div>

        <div
          style={{
            ...styles.heroCard,
            marginTop: isMobile ? "25px" : "0"
          }}
        >
          <h3>📊 Live Insights</h3>
          <p>Track usage, inventory & cutting in real-time</p>
        </div>
      </div>

      {/* FEATURES */}
      <div
        style={{
          ...styles.section,
          padding: isMobile ? "40px 20px" : "60px 40px"
        }}
      >
        <h2 style={styles.sectionTitle}>✨ Features</h2>

        <div style={styles.grid}>
          <Feature
            title="📦 Inventory Tracking"
            desc="Manage all fabric rolls with real-time stock updates"
          />

          <Feature
            title="📱 QR Scanning"
            desc="Scan QR codes to instantly access fabric details"
          />

          <Feature
            title="✂️ Smart Cutting"
            desc="Track fabric usage and prevent over-cutting"
          />

          <Feature
            title="📊 Analytics"
            desc="View insights with charts & reports"
          />
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2>Ready to streamline your fabric management?</h2>

        <button
          style={{
            ...styles.primaryBtn,
            marginTop: "15px"
          }}
          onClick={() => navigate("/login")}
        >
          Start Now 🚀
        </button>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>© 2026 FabricSys. All rights reserved.</p>
      </div>
    </div>
  );
};

/* FEATURE CARD */
const Feature = ({ title, desc }) => (
  <div style={styles.featureCard}>
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

/* STYLES */
const styles = {
  container: {
  fontFamily: "sans-serif",
  background: "#f4f6f9",
  minHeight: "100vh",
  color: "#1a2a40",
},

  navbar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#ffffff",
  borderBottom: "1px solid #e2e8ef",
  boxShadow: "0 2px 12px rgba(15,31,61,0.05)",
  position: "sticky",
  top: 0,
  zIndex: 100,
},

 logo: {
  color: "#0f1f3d",
  margin: 0,
  fontWeight: "700",
},

  navActions: {
    display: "flex",
    gap: "10px"
  },

  loginBtn: {
  padding: "10px 18px",
  border: "1px solid #0f1f3d",
  background: "#fff",
  color: "#0f1f3d",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
},

adminBtn: {
  padding: "10px 18px",
  border: "none",
  background: "#0f1f3d",
  color: "#fff",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
},

  hero: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    transition:
      "opacity 0.5s ease-in-out, background-image 1s ease-in-out"
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(15,31,61,0.82)"
  },

  heroText: {
    position: "relative",
    zIndex: 1
  },

  title: {
    marginBottom: "15px"
  },

  subtitle: {
    fontSize: "16px",
    marginBottom: "20px",
    opacity: 0.9
  },

  heroBtns: {
    display: "flex",
    gap: "10px"
  },

primaryBtn: {
  padding: "14px 24px",
  background: "#c9a84c",
  color: "#0f1f3d",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 4px 12px rgba(201,168,76,0.35)",
},

secondaryBtn: {
  padding: "14px 24px",
  background: "#fff",
  color: "#0f1f3d",
  border: "1px solid #e2e8ef",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
},

  heroCard: {
  position: "relative",
  zIndex: 1,
  background: "#fff",
  color: "#1a2a40",
  padding: "28px",
  borderRadius: "18px",
  maxWidth: "300px",
  border: "1px solid #e2e8ef",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
},

  section: {},

  sectionTitle: {
    textAlign: "center",
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px"
  },

  featureCard: {
  background: "#fff",
  padding: "24px",
  borderRadius: "18px",
  border: "1px solid #e2e8ef",
  boxShadow: "0 8px 24px rgba(15,31,61,0.08)",
  transition: "0.3s",
},

  cta: {
  background: "#0f1f3d",
  color: "#fff",
  textAlign: "center",
  padding: "70px 20px",
},

  footer: {
    textAlign: "center",
    padding: "20px",
    background: "#ffffff"
  }
};

export default Landing;
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
        <h2 style={styles.logo}>🧵 FabricSys</h2>

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
          <h1
            style={{
              ...styles.title,
              fontSize: isMobile ? "30px" : "42px"
            }}
          >
            Smart Fabric Management System
          </h1>

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
    background: "#f8fafc",
    minHeight: "100vh",
    color: "#0f172a"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 100
  },

  logo: {
    color: "#3b82f6",
    margin: 0
  },

  navActions: {
    display: "flex",
    gap: "10px"
  },

  loginBtn: {
    padding: "8px 16px",
    border: "none",
    background: "#e2e8f0",
    borderRadius: "6px",
    cursor: "pointer"
  },

  adminBtn: {
    padding: "8px 16px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
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
    background: "rgba(0,0,0,0.6)"
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
    padding: "12px 20px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  secondaryBtn: {
    padding: "12px 20px",
    background: "#ffffff",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  heroCard: {
    position: "relative",
    zIndex: 1,
    background: "rgba(255,255,255,0.9)",
    color: "#000",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "280px"
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
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
  },

  cta: {
    background: "#3b82f6",
    color: "#fff",
    textAlign: "center",
    padding: "50px 20px"
  },

  footer: {
    textAlign: "center",
    padding: "20px",
    background: "#ffffff"
  }
};

export default Landing;
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  const startScan = () => {
    setScannerOn(true);

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: isMobile ? 200 : 250,
        },
        false
      );

      scanner.render(
        async (result) => {
          try {
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
            alert("QR Error ❌");
          }

          scanner.clear();
          setScannerOn(false);
        },
        () => {}
      );
    }, 300);
  };

  // ✅ FIXED CUT
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
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>

      <h2>QR Scanner</h2>

      {!scannerOn ? (
        <button onClick={startScan}>
          Start Scan
        </button>
      ) : (
        <div id="reader"></div>
      )}

      {fabric && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#fff",
            borderRadius: "10px",
          }}
        >
          <h3>{fabric.name}</h3>

          <p>
            Roll: {fabric.rollNumber}
          </p>

          <p>
            Total: {fabric.totalLength}
          </p>

          <p>
            Remaining:
            {fabric.availableLength}
          </p>

          <button onClick={handleCut}>
            ✂️ Cut Fabric
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
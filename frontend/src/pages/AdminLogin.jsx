// ================= AdminLogin.jsx =================
import React, {
  useState,
  useEffect,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  useNavigate,
} from "react-router-dom";
import axios from "axios";

const API =
  "https://smart-roll-backend.onrender.com";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "admin@gmail.com",
    password: "admin123",
  });

  const fillTestCredentials = () => {
    setForm({
      email: "admin@gmail.com",
      password: "admin123",
    });
  };

  // ✅ already login
  useEffect(() => {
    const token =
      localStorage.getItem(
        "adminToken"
      );

    if (token) {
      navigate(
        "/adminDashboard",
        { replace: true }
      );
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleLogin = async (
    e
  ) => {
    e.preventDefault();

    try {
      const res =
        await axios.post(
          `${API}/api/admin/login`,
          form
        );

      // ✅ save token
      localStorage.setItem(
        "adminToken",
        res.data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(
          res.data.user
        )
      );

      alert(
        "Admin Login Successful ✅"
      );

      // ✅ force redirect
     navigate("/adminDashboard", { replace: true });

    } catch (err) {
      alert(
        err.response?.data
          ?.msg ||
          "Admin Login Failed ❌"
      );
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0 flex-column flex-md-row">
      {/* LEFT */}
      <div
        className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg')",
          backgroundSize:
            "cover",
          backgroundPosition:
            "center",
          minHeight: "40vh",
        }}
      >
        <div
          style={{
            
              background: "rgba(15,31,61,0.82)",
            padding: "20px",
            borderRadius:
              "10px",
            textAlign:
              "center",
          }}
        >
          <h1
  style={{
    color: "#ffffff",
    fontWeight: "700",
  }}
>
  Admin Control Panel
</h1>

<div
  style={{
    width: "60px",
    height: "4px",
    background: "#c9a84c",
    margin: "12px auto",
    borderRadius: "10px",
  }}
></div>

          <p className="opacity-75">
            Manage users,
            inventory &
            system securely.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="col-12 col-md-6 d-flex align-items-center justify-content-center"
        style={{
          background:
            "#f8fafc",
          padding: "20px",
        }}
      >
        <div className="glass-card">
          <h2
  className="text-center mb-1"
  style={{
    color: "#0f1f3d",
    fontWeight: "700",
  }}
>
  Welcome Admin
</h2>

<p
  className="text-center mb-3"
  style={{
    color: "#64748b",
    fontSize: "14px",
  }}
>
  Login to Admin Control Panel
</p>

          {/* 🛡️ Test Admin Credentials Card */}
          <div
            style={{
              background: "rgba(201, 168, 76, 0.08)",
              border: "1px dashed #c9a84c",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "18px",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: "#0f1f3d", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🛡️</span> Test Admin Credentials
              </strong>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={fillTestCredentials}
                  style={{
                    border: "none",
                    background: "#0f1f3d",
                    color: "#c9a84c",
                    padding: "4px 9px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ⚡ Quick Fill
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ email: "", password: "" })}
                  style={{
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#64748b",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            <div style={{ color: "#334155", lineHeight: "1.6" }}>
              <div>
                <span style={{ color: "#64748b" }}>Email: </span>
                <strong style={{ fontFamily: "monospace", color: "#0f1f3d" }}>admin@gmail.com</strong>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Password: </span>
                <strong style={{ fontFamily: "monospace", color: "#0f1f3d" }}>admin123</strong>
              </div>
            </div>
          </div>

          <form
            onSubmit={
              handleLogin
            }
          >
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                placeholder="Enter Admin Email"
                className="form-control custom-input"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter Password"
                className="form-control custom-input"
                required
              />
            </div>

            <button className="custom-btn w-100 mb-3">
              Login as Admin
            </button>

            <div
              className="text-center mt-3 pt-3"
              style={{ borderTop: "1px solid #e2e8f0" }}
            >
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Staff or Regular User?{" "}
              </span>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                style={{
                  fontSize: "13px",
                  color: "#0f1f3d",
                  fontWeight: "700",
                }}
                onClick={() => navigate("/login")}
              >
                User Login →
              </button>
            </div>
          </form>

          
        </div>
      </div>

      <style>{`
       .glass-card{
  width:100%;
  max-width:420px;
  padding:35px;
  border-radius:18px;
  background:#ffffff;
  border:1px solid #e2e8ef;
  box-shadow:0 8px 24px rgba(15,31,61,0.08);
}

.custom-input{
  background:"#f4f6f9" !important;
  border:1px solid #dbe3ec !important;
  color:#1a2a40 !important;
  padding:12px !important;
  border-radius:10px !important;
}

.custom-input:focus{
  border-color:#c9a84c !important;
  box-shadow:0 0 8px rgba(201,168,76,0.35) !important;
}

.custom-btn{
  background:#c9a84c;
  color:#0f1f3d;
  border:none;
  padding:12px;
  border-radius:10px;
  font-weight:700;
  box-shadow:0 4px 12px rgba(201,168,76,0.35);
  transition:.3s;
}

.custom-btn:hover{
  background:#d4b15a;
  transform:translateY(-1px);
}

input::placeholder{
  color:#64748b !important;
}
      `}</style>
    </div>
  );
};

export default AdminLogin;
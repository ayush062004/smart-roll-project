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

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

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
  className="text-center mb-4"
  style={{
    color: "#64748b",
    fontSize: "14px",
  }}
>
  Login to Admin Control Panel
</p>

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
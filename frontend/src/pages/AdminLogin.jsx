// ================= AdminLogin.jsx =================
import React, {
  useState,
  useEffect,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaGithub,
  FaWhatsapp,
  FaTwitter,
} from "react-icons/fa";
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
      window.location.href =
        "/adminDashboard";

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
            background:
              "rgba(0,0,0,0.5)",
            padding: "20px",
            borderRadius:
              "10px",
            textAlign:
              "center",
          }}
        >
          <h1 className="fw-bold mb-3">
            Admin Control
            Panel ⚙️
          </h1>

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
          <h2 className="text-center mb-4 fw-bold text-dark">
            Admin Login
          </h2>

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
                placeholder="Admin Email"
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
                placeholder="Password"
                className="form-control custom-input"
                required
              />
            </div>

            <button className="custom-btn w-100 mb-3">
              Login as Admin
            </button>
          </form>

          <div className="d-flex justify-content-center gap-3 mt-3 fs-5">
            <FaGithub />
            <FaWhatsapp />
            <FaTwitter />
          </div>
        </div>
      </div>

      <style>{`
        .glass-card{
          width:100%;
          max-width:400px;
          padding:30px;
          border-radius:15px;
          background:white;
          box-shadow:0 8px 25px rgba(0,0,0,.08);
        }

        .custom-input{
          background:#f1f5f9 !important;
          border:1px solid #cbd5e1 !important;
        }

        .custom-btn{
          background:#2563eb;
          color:white;
          border:none;
          padding:10px;
          border-radius:8px;
          font-weight:bold;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
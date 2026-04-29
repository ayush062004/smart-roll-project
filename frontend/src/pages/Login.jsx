import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaGithub, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const API = "https://smart-roll-backend.onrender.com";

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        form,
        { withCredentials: true }
      );

      alert(res.data.msg);

      localStorage.setItem('userEmail', form.email);
      localStorage.setItem('isLoggedIn', 'true');

      navigate("/dashboard");

    } catch (error) {
      alert(error?.response?.data?.msg || "Login failed ❌");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API}/api/examinee/forgot-password`,
        { email: forgotEmail }
      );

      alert(res.data.message || "Reset link sent ✅");

      setShowForgot(false);
      setForgotEmail('');

    } catch (error) {
      alert(error?.response?.data?.msg || "Something went wrong ❌");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0 flex-column flex-md-row">

      {/* LEFT SIDE */}
      <div
        className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "40vh",
          padding: "20px"
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.55)",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
            width: "100%",
            maxWidth: "400px"
          }}
        >
          <h1 className="fw-bold mb-3">
            Smart Fabric System 🧵
          </h1>
          <p className="opacity-75">
            Manage fabric rolls & automate textile workflow efficiently.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="col-12 col-md-6 d-flex align-items-center justify-content-center"
        style={{ background: "#f1f5f9", padding: "20px" }}
      >

        <div className="glass-card">

          {!showForgot ? (
            <>
              <h2 className="text-center mb-4 fw-bold text-dark">Login</h2>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    className="form-control custom-input"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    className="form-control custom-input"
                    required
                  />
                </div>

                <button type="submit" className="custom-btn w-100 mb-3">
                  Login
                </button>

                <button
                  type="button"
                  className="btn btn-link w-100 text-decoration-none"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>

              </form>
            </>
          ) : (
            <>
              <h2 className="text-center mb-4 fw-bold text-dark">Reset Password</h2>

              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="form-control custom-input mb-3"
                  required
                />

                <button className="custom-btn w-100 mb-2">
                  Send Link
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setShowForgot(false)}
                >
                  Back
                </button>
              </form>
            </>
          )}

        </div>
      </div>

      <style>{`
        .glass-card {
          width: 100%;
          max-width: 400px;
          padding: 30px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .custom-input {
          background: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
          padding: 10px;
          border-radius: 8px;
        }

        .custom-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 6px rgba(59,130,246,0.4) !important;
        }

        .custom-btn {
          background: linear-gradient(135deg, #3b82f6, #0ea5e9);
          border: none;
          color: white;
          padding: 10px;
          border-radius: 8px;
          font-weight: bold;
        }

        .custom-btn:hover {
          opacity: 0.9;
        }

        input::placeholder {
          color: #64748b !important;
        }
      `}</style>

    </div>
  );
};

export default Login;
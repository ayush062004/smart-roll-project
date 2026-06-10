import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const API = "https://smart-roll-backend.onrender.com";

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  // ✅ already logged in
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }
}, [navigate]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ LOGIN
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${API}/api/auth/login`,
      form
    );

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login Successful ✅");

    navigate("/dashboard", { replace: true });

  } catch (error) {
    alert(error?.response?.data?.msg || "Login failed ❌");
  }
};

  // forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API}/api/examinee/forgot-password`,
        { email: forgotEmail }
      );

      alert(
        res.data.message ||
        "Reset link sent ✅"
      );

      setShowForgot(false);
      setForgotEmail("");

    } catch (error) {
      alert(
        error?.response?.data?.msg ||
        "Something went wrong ❌"
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
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "40vh",
          padding: "20px"
        }}
      >
        <div
          style={{
            background:"rgba(15,31,61,0.82)",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
            width: "100%",
            maxWidth: "400px"
          }}
        >
          <h1
  style={{
    color: "#ffffff",
    fontWeight: "700",
  }}
>
  Smart Fabric System
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
            Manage fabric rolls & automate textile workflow efficiently.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="col-12 col-md-6 d-flex align-items-center justify-content-center"
        style={{
          background: "#f1f5f9",
          padding: "20px"
        }}
      >
        <div className="glass-card">

          {!showForgot ? (
            <>
              <h2
  className="text-center mb-1"
  style={{
    color: "#0f1f3d",
    fontWeight: "700",
  }}
>
  Welcome Back
</h2>

<p
  className="text-center mb-4"
  style={{
    color: "#64748b",
    fontSize: "14px",
  }}
>
  Login to Smart Fabric System
</p>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="form-control custom-input"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="form-control custom-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="custom-btn w-100 mb-3"
                >
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
              <h2 className="text-center mb-4 fw-bold text-dark">
                Reset Password
              </h2>

              <form onSubmit={handleForgotPassword}>

                <input
                  type="email"
                  placeholder="Enter email"
                  value={forgotEmail}
                  onChange={(e) =>
                    setForgotEmail(e.target.value)
                  }
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
     .glass-card{
  width:100%;
  max-width:420px;
  padding:35px;
  border-radius:18px;
  background:"#f4f6f9";
  border:1px solid #e2e8ef;
  box-shadow:0 8px 24px rgba(15,31,61,0.08);
}

        .custom-input{
          background:#f8fafc !important;
          border:1px solid #cbd5e1 !important;
          color:#0f172a !important;
          padding:10px;
          border-radius:8px;
        }

       .custom-input:focus{
  border-color:#c9a84c !important;
  box-shadow:0 0 8px rgba(201,168,76,0.35) !important;
}

.custom-btn{
  background:#c9a84c;
  border:none;
  color:#0f1f3d;
  padding:12px;
  border-radius:10px;
  font-weight:700;
  box-shadow:0 4px 12px rgba(201,168,76,0.35);
  transition:0.3s;
}

.custom-btn:hover{
  transform:translateY(-1px);
  background:#d4b15a;
}

        .custom-btn:hover{
          opacity:0.9;
        }

        input::placeholder{
          color:#64748b !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
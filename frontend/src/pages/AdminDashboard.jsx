import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://smart-roll-backend.onrender.com";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [cuts, setCuts] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [activeTab, setActiveTab] = useState("cuts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [navigate]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      navigate("/adminlogin");
    } else {
      fetchCuts();
      fetchStats();
      fetchUsers();
      fetchInventory();
    }
  }, [navigate]);

  const fetchCuts = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/cuts`, {
        withCredentials: true,
      });
      setCuts(res.data);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/dashboard-stats`, {
        withCredentials: true,
      });
      setStats(res.data);
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch {}
  };

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/inventory`, {
        withCredentials: true,
      });
      setInventory(res.data);
    } catch {}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/api/admin/create-user`, form, {
        withCredentials: true,
      });

      alert("User Created ✅");
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch {
      alert("Error ❌");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await axios.delete(`${API}/api/admin/user/${id}`, {
      withCredentials: true,
    });

    fetchUsers();
  };

  const handleInvDelete = async (id) => {
    if (!window.confirm("Delete fabric?")) return;

    await axios.delete(`${API}/api/admin/inventory/${id}`, {
      withCredentials: true,
    });

    fetchInventory();
  };

  const handleAddLength = async (item) => {
    const value = prompt("Enter length:");
    if (!value || isNaN(value)) return;

    const newLength = Number(item.availableLength) + Number(value);

    await axios.put(
      `${API}/api/admin/inventory/${item._id}`,
      { availableLength: newLength },
      { withCredentials: true }
    );

    fetchInventory();
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div style={styles.container}>
      {isMobile && (
        <div style={styles.mobileTop}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuBtn}
          >
            ☰
          </button>
          <h3 style={{ margin: 0 }}>Admin</h3>
        </div>
      )}

      {isMobile && sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        style={{
          ...styles.sidebar,
          left: isMobile ? (sidebarOpen ? "0" : "-260px") : "0",
        }}
      >
        <h2 style={{ color: "#3b82f6" }}>🧵 FabricSys</h2>

        <button onClick={() => changeTab("cuts")} style={styles.btn}>
          📊 Cuts
        </button>

        <button onClick={() => changeTab("inventory")} style={styles.btn}>
          📦 Inventory
        </button>

        <button onClick={() => changeTab("create")} style={styles.btn}>
          ➕ Create
        </button>

        <button onClick={() => changeTab("users")} style={styles.btn}>
          👥 Users
        </button>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            navigate("/adminlogin");
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          ...styles.main,
          marginLeft: isMobile ? "0" : "250px",
        }}
      >
        <h2>🚀 Admin Dashboard</h2>

        <div
          style={{
            ...styles.cards,
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : "repeat(4,1fr)",
          }}
        >
          <Card title="Total" value={stats?.totalRolls || 0} />
          <Card title="Used" value={stats?.usedRolls || 0} />
          <Card title="Available" value={stats?.availableRolls || 0} />
          <Card title="Damaged" value={stats?.damaged || 0} />
        </div>

        {activeTab === "cuts" && (
          <TableWrapper title="Cut History">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Cut Length</th>
                <th>Remaining</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {cuts.map((c) => (
                <tr key={c._id}>
                  <td>{c.rollNumber}</td>
                  <td>{c.cutLength}</td>
                  <td>{c.remainingLength}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}

        {activeTab === "inventory" && (
          <TableWrapper title="Inventory">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Length</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((i) => (
                <tr key={i._id}>
                  <td>{i.rollNumber}</td>
                  <td>{i.name}</td>
                  <td>{i.availableLength}</td>
                  <td>
                    <button
                      style={styles.smallBtn}
                      onClick={() => handleAddLength(i)}
                    >
                      ＋
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleInvDelete(i._id)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}

        {activeTab === "users" && (
          <TableWrapper title="Users">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}

        {activeTab === "create" && (
          <div style={styles.card}>
            <h3>Create User</h3>

            <form onSubmit={createUser} style={styles.form}>
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="password"
                placeholder="Password"
                onChange={handleChange}
                style={styles.input}
              />

              <button style={styles.button}>Create</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const TableWrapper = ({ title, children }) => (
  <div style={styles.card}>
    <h3>{title}</h3>
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>{children}</table>
    </div>
  </div>
);

const Card = ({ title, value }) => (
  <div style={styles.stat}>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

const styles = {
  container: {
    display: "flex",
    background: "#f8fafc",
    minHeight: "100vh",
    color: "#0f172a",
  },
  sidebar: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    zIndex: 2000,
    transition: "0.3s",
    boxShadow: "2px 0 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    zIndex: 1500,
  },
  main: {
    flex: 1,
    padding: "20px",
    marginTop: "70px",
  },
  btn: {
    padding: "10px",
    marginTop: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#e2e8f0",
    cursor: "pointer",
    textAlign: "left",
  },
  logout: {
    marginTop: "auto",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
  },
  cards: {
    display: "grid",
    gap: "15px",
    marginTop: "20px",
  },
  stat: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#3b82f6",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  smallBtn: {
    marginRight: "8px",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#ef4444",
    color: "#fff",
  },
  mobileTop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    background: "#fff",
    zIndex: 3000,
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "0 15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  menuBtn: {
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
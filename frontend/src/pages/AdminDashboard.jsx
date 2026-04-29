import React, { useEffect, useState, useCallback } from "react";
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

  const token = localStorage.getItem("adminToken");

  // ================= MOBILE RESIZE =================
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ================= FETCH FUNCTIONS =================
  const fetchCuts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/cuts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCuts(res.data);
    } catch {}
  }, [token]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch {}
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {}
  }, [token]);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch {}
  }, [token]);

  // ================= AUTH CHECK =================
  useEffect(() => {
    if (!token) {
      navigate("/adminlogin");
      return;
    }

    fetchCuts();
    fetchStats();
    fetchUsers();
    fetchInventory();
  }, [
    token,
    navigate,
    fetchCuts,
    fetchStats,
    fetchUsers,
    fetchInventory,
  ]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE USER =================
  const createUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API}/api/admin/create-user`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("User Created ✅");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      fetchUsers();
    } catch {
      alert("Error ❌");
    }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await axios.delete(`${API}/api/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
  };

  // ================= DELETE INVENTORY =================
  const handleInvDelete = async (id) => {
    if (!window.confirm("Delete fabric?")) return;

    await axios.delete(`${API}/api/admin/inventory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchInventory();
  };

  // ================= ADD LENGTH =================
  const handleAddLength = async (item) => {
    const value = prompt("Enter length");

    if (!value || isNaN(value)) return;

    const newLength =
      Number(item.availableLength) + Number(value);

    await axios.put(
      `${API}/api/admin/inventory/${item._id}`,
      { availableLength: newLength },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
          <h3>Admin</h3>
        </div>
      )}

      {isMobile && sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        style={{
          ...styles.sidebar,
          left: isMobile
            ? sidebarOpen
              ? "0"
              : "-260px"
            : "0",
        }}
      >
        <h2 style={{ color: "#2563eb" }}>🧵 FabricSys</h2>

        <button
          style={styles.btn}
          onClick={() => changeTab("cuts")}
        >
          📊 Cuts
        </button>

        <button
          style={styles.btn}
          onClick={() => changeTab("inventory")}
        >
          📦 Inventory
        </button>

        <button
          style={styles.btn}
          onClick={() => changeTab("users")}
        >
          👥 Users
        </button>

        <button
          style={styles.btn}
          onClick={() => changeTab("create")}
        >
          ➕ Create User
        </button>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            navigate("/adminlogin");
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
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
          <Card
            title="Available"
            value={stats?.availableRolls || 0}
          />
          <Card title="Damaged" value={stats?.damaged || 0} />
        </div>

        {/* CUTS */}
        {activeTab === "cuts" && (
          <TableWrapper title="Cut History">
            <thead>
  <tr>
    <th>Roll</th>
    <th>Name</th>
    <th>Cut</th>
    <th>Remain</th>
    <th>Date</th>
  </tr>
</thead>

<tbody>
  {cuts.map((c) => (
    <tr key={c._id}>
      <td>{c.rollNumber}</td>
      <td>{c.name}</td>
      <td>{c.cutLength}</td>
      <td>{c.remainingLength}</td>
      <td>
        {new Date(c.createdAt).toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>
          </TableWrapper>
        )}

        {/* INVENTORY */}
        {activeTab === "inventory" && (
          <TableWrapper title="Inventory">
            <thead>
              <tr>
                <th>Roll</th>
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
                      Add
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        handleInvDelete(i._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}

        {/* USERS */}
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

        {/* CREATE USER */}
        {activeTab === "create" && (
          <div style={styles.card}>
            <h3>Create User</h3>

            <form
              onSubmit={createUser}
              style={styles.form}
            >
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />

              <button style={styles.button}>
                Create
              </button>
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
    minHeight: "100vh",
    background: "#f8fafc",
  },

  sidebar: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    position: "fixed",
    top: 0,
    height: "100%",
    transition: "0.3s",
    boxShadow: "2px 0 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 2000,
  },

  main: {
    flex: 1,
    padding: "20px",
    marginTop: "70px",
  },

  btn: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  logout: {
    marginTop: "auto",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "#fff",
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
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "20px",
  },

  table: {
    width: "100%",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "10px",
  },

  button: {
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },

  smallBtn: {
    marginRight: "8px",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
  },

  mobileTop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "0 15px",
    zIndex: 3000,
  },

  menuBtn: {
    border: "none",
    background: "none",
    fontSize: "24px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    zIndex: 1500,
  },
};

export default AdminDashboard;
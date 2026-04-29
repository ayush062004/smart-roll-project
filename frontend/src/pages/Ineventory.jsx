import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API =
  "https://smart-roll-backend.onrender.com";

const Inventory = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    low: 0,
    out: 0,
  });

  const [isMobile, setIsMobile] =
    useState(window.innerWidth < 768);

  const token = localStorage.getItem(
    "token"
  );

  // ================= FETCH FABRICS =================
  const fetchFabrics = useCallback(
    async () => {
      try {
        const res = await axios.get(
          `${API}/api/fabric`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setItems(res.data);

        let available = 0;
        let low = 0;
        let out = 0;

        res.data.forEach((item) => {
          if (
            item.availableLength === 0
          )
            out++;
          else if (
            item.availableLength < 20
          )
            low++;
          else available++;
        });

        setStats({
          total: res.data.length,
          available,
          low,
          out,
        });
      } catch (err) {
        console.log(err);
      }
    },
    [token]
  );

  // ================= FETCH HISTORY =================
  const fetchHistory = useCallback(
    async () => {
      try {
        const res = await axios.get(
          `${API}/api/fabric/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHistory(res.data);
      } catch (err) {
        console.log(err);
      }
    },
    [token]
  );

  // ================= FETCH ALL =================
  const fetchAll = useCallback(
    async () => {
      setLoading(true);

      await Promise.all([
        fetchFabrics(),
        fetchHistory(),
      ]);

      setLoading(false);
    },
    [fetchFabrics, fetchHistory]
  );

  // ================= AUTH + LOAD =================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchAll();
  }, [token, navigate, fetchAll]);

  // ================= RESIZE =================
  useEffect(() => {
    const resize = () =>
      setIsMobile(
        window.innerWidth < 768
      );

    window.addEventListener(
      "resize",
      resize
    );

    return () =>
      window.removeEventListener(
        "resize",
        resize
      );
  }, []);

  // ================= ADD LENGTH =================
  const handleAddLength = async (
    id
  ) => {
    const input = prompt(
      "Enter length"
    );

    if (!input) return;

    const length = Number(input);

    if (
      isNaN(length) ||
      length <= 0
    ) {
      alert("Invalid value ❌");
      return;
    }

    try {
      await axios.post(
        `${API}/api/fabric/add-length`,
        { id, length },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Length Added ✅");
      fetchAll();
    } catch {
      alert("Failed ❌");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (
    id
  ) => {
    const ok = window.confirm(
      "Delete this roll?"
    );

    if (!ok) return;

    try {
      await axios.delete(
        `${API}/api/fabric/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Deleted ✅");
      fetchAll();
    } catch {
      alert("Delete failed ❌");
    }
  };

  const getStatus = (item) => {
    if (
      item.availableLength === 0
    )
      return "Out";

    if (
      item.availableLength < 20
    )
      return "Low";

    return "Available";
  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={topBar}>
        <button
          style={backBtn}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back
        </button>

        <h2>📦 Inventory</h2>
      </div>

      {/* STATS */}
      <div
        style={{
          ...statsGrid,
          gridTemplateColumns:
            isMobile
              ? "1fr 1fr"
              : "repeat(4,1fr)",
        }}
      >
        <StatCard
          title="Total"
          value={stats.total}
        />
        <StatCard
          title="Available"
          value={stats.available}
        />
        <StatCard
          title="Low"
          value={stats.low}
        />
        <StatCard
          title="Out"
          value={stats.out}
        />
      </div>

      {/* TABLE */}
      <div style={box}>
        <h3>Fabric Rolls</h3>

        <div style={scroll}>
          <table style={table}>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Name</th>
                <th>Total</th>
                <th>Remain</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.rollNumber}
                  </td>
                  <td>{item.name}</td>
                  <td>
                    {item.totalLength}
                  </td>
                  <td>
                    {
                      item.availableLength
                    }
                  </td>

                  <td>
                    <span
                      style={statusStyle(
                        getStatus(
                          item
                        )
                      )}
                    >
                      {getStatus(
                        item
                      )}
                    </span>
                  </td>

                  <td>
                    <button
                      style={addBtn}
                      onClick={() =>
                        handleAddLength(
                          item._id
                        )
                      }
                    >
                      Add
                    </button>

                    <button
                      style={
                        deleteBtn
                      }
                      onClick={() =>
                        handleDelete(
                          item._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTORY */}
      <div style={box}>
        <h3>📜 History</h3>

        <div style={scroll}>
          <table style={table}>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Action</th>
                <th>Length</th>
                <th>Remain</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {history.map(
                (h, i) => (
                  <tr key={i}>
                    <td>
                      {
                        h.rollNumber
                      }
                    </td>
                    <td>
                      {h.action}
                    </td>
                    <td>
                      {h.length}
                    </td>
                    <td>
                      {
                        h.remainingLength
                      }
                    </td>
                    <td>
                      {new Date(
                        h.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ================= COMPONENT =================
const StatCard = ({
  title,
  value,
}) => (
  <div style={statCard}>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

// ================= STYLES =================
const container = {
  padding: "20px",
  background: "#f1f5f9",
  minHeight: "100vh",
};

const topBar = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  marginBottom: "20px",
};

const backBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
};

const statsGrid = {
  display: "grid",
  gap: "15px",
  marginBottom: "20px",
};

const statCard = {
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  textAlign: "center",
};

const box = {
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const scroll = {
  overflowX: "auto",
};

const table = {
  width: "100%",
};

const addBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "6px 10px",
  marginRight: "5px",
  borderRadius: "6px",
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
};

const statusStyle = (
  status
) => {
  if (status === "Available") {
    return {
      background: "#22c55e",
      color: "white",
      padding: "4px 8px",
      borderRadius: "8px",
    };
  }

  if (status === "Low") {
    return {
      background: "#facc15",
      color: "black",
      padding: "4px 8px",
      borderRadius: "8px",
    };
  }

  return {
    background: "#ef4444",
    color: "white",
    padding: "4px 8px",
    borderRadius: "8px",
  };
};

export default Inventory;
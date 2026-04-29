import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dasboard";
import AddFabric from "./pages/AddFabric";
import Landing from "./pages/Landing";
import Inventory from "./pages/Ineventory";
import QRScanner from "./pages/QRScanner";
import AdminLogin from "./pages/AdminLogin";
import Cutting from "./pages/Cutting";


import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

// 🔥 INLINE ADMIN ROUTE (extra safe)
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("admin");

  return isAdmin ? children : <Navigate to="/adminlogin" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* 🌐 PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* 👤 USER ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addfabric"
          element={
            <ProtectedRoute>
              <AddFabric />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/qrscanner"
          element={
            <ProtectedRoute>
              <QRScanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cutting"
          element={
            <ProtectedRoute>
              <Cutting />
            </ProtectedRoute>
          }
        />

        {/* 👑 ADMIN */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route
          path="/adminDashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
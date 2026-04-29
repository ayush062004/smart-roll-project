// ================= AdminRoute.jsx =================
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  return token
    ? children
    : <Navigate to="/adminlogin" replace />;
};

export default AdminRoute;
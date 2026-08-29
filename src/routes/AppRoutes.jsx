import { Routes, Route, Router } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoutes";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import DashboardLayout from "../components/common/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Settings from "../pages/settings/Settings";
import Users from "../pages/users/Users";
import Category from "../pages/category/Categories";
import Food from "../pages/food/Food";
import Tables from "../pages/table/Table";
import Sessions from "../pages/session/Session";
import Orders from "../pages/order/Orders";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>
        {/* ================= ADMIN ================= */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/food" element={<Food />} />
            <Route path="/admin/categories" element={<Category />} />
            <Route path="/admin/tables" element={<Tables />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/sessions" element={<Sessions/>} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ================= KITCHEN ================= */}
        <Route element={<RoleRoute allowedRoles={["admin", "kitchen"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/kitchen"
              element={
                <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
              }
            />
            <Route path="/kitchen/orders" element={<Orders />} />
            <Route path="/kitchen/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ================= WAITER ================= */}
        <Route element={<RoleRoute allowedRoles={["admin", "waiter"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/waiter"
              element={<h1 className="text-2xl font-bold">Waiter Dashboard</h1>}
            />
            <Route path="/waiter/tables" element={<Tables />} />
            <Route path="/waiter/orders" element={<Orders/>} />
            <Route path="/waiter/sessions" element={<Sessions/>} />
            <Route path="/waiter/settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoutes";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import DashboardLayout from "../components/layout/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Settings from "../pages/settings/Settings";
import Users from "../pages/users/Users";
import Category from "../pages/category/Categories";
import Food from "../pages/food/Food";
import Tables from "../pages/table/Table";
import Sessions from "../pages/session/Session";
import Orders from "../pages/order/Orders";
import KitchenDashboard from "../pages/kitchen/KitchenDashboard";
import WaiterDashboard from "../pages/waiter/WaiterDashboard";

import NotFound from "../pages/notfound/NotFound";

import Home from "../pages/customer/Home";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import TableEntry from "../pages/customer/TableEntry";
import MyOrders from "../pages/customer/MyOrders";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}

      <Route path="/" element={<Home />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />

      <Route path="/table/:tableId" element={<TableEntry />} />



      {/* login */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />

      <Route path="*" element={<NotFound />} />

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
            <Route path="/admin/sessions" element={<Sessions />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ================= KITCHEN ================= */}
        <Route element={<RoleRoute allowedRoles={["admin", "kitchen"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/kitchen" element={<KitchenDashboard />} />
            <Route path="/kitchen/orders" element={<Orders />} />
            <Route path="/kitchen/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ================= WAITER ================= */}
        <Route element={<RoleRoute allowedRoles={["admin", "waiter"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/waiter" element={<WaiterDashboard />} />
            <Route path="/waiter/tables" element={<Tables />} />
            <Route path="/waiter/orders" element={<Orders />} />
            <Route path="/waiter/sessions" element={<Sessions />} />
            <Route path="/waiter/settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

import { useEffect, useMemo, useState } from "react";
import StatCard from "../../components/common/StatCard";

import {
  ClipboardList,
  Users,
  ShoppingCart,
  CheckCircle,
  Clock,
  RefreshCw,
  Utensils,
  Table2,
  ArrowRight,
} from "lucide-react";

import { getActiveSessions } from "../../api/session.api";
import { getAllOrders, updateWaiterStatus } from "../../api/order.api";

import Header from "../../components/common/Header";
import Button from "../../components/common/Button";

import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";

const WaiterDashboard = () => {

  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [sessionResponse, orderResponse] = await Promise.all([
        getActiveSessions(),
        getAllOrders(),
      ]);

      const sessionData = sessionResponse?.data || [];
      const orderData = orderResponse?.data || [];

      setSessions(Array.isArray(sessionData) ? sessionData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Failed to load waiter dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboard();
  }, []);

  
  // STATISTICS
  const activeSessions = sessions.length;

  const totalTables = useMemo(() => {
    return new Set(
      sessions.map((session) => session.table?._id).filter(Boolean),
    ).size;
  }, [sessions]);

  const newOrders = useMemo(() => {
    return orders.filter(
      (order) => order.waiterStatus === "new" && order.status !== "cancelled",
    ).length;
  }, [orders]);

  const readyOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.kitchenStatus === "ready" &&
        order.waiterStatus !== "served" &&
        order.status !== "cancelled",
    ).length;
  }, [orders]);


  // RECENT ORDERS
  const recentOrders = useMemo(() => {
    return [...orders]
      .filter((order) => order.status !== "cancelled")
      .slice(0, 6);
  }, [orders]);

  // SERVE ORDER
  const handleServe = async (order) => {
    if (order.kitchenStatus !== "ready") {
      setError("Order cannot be served before the kitchen marks it ready.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to mark ${order.orderNumber} as served?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(order._id);
      setError("");
      setSuccess("");

      await updateWaiterStatus(order._id, "served");

      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? {
                ...item,
                waiterStatus: "served",
                status: "served",
              }
            : item,
        ),
      );

      setSuccess(`${order.orderNumber} marked as served successfully.`);

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Failed to update waiter status.",
      );
    } finally {
      setActionId(null);
    }
  };


  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString();
  };

  // KITCHEN STATUS CLASS
  const getKitchenStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";

      case "accepted":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "preparing":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";

      case "ready":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  
  // LOADING
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-800" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-800" />
          </div>

          <div className="h-11 w-28 animate-pulse rounded-lg bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex justify-between">
                <div>
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-800" />
                  <div className="mt-3 h-8 w-12 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-800" />

          <div className="mt-5 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-lg bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }


  // UI
  return (
    <div className="space-y-6">

          {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header
          title="Waiter Dashboard"
          value={`Welcome back, ${user?.fullName || "Waiter"}.`}
        />

        <Button
          onClick={fetchDashboard}
          disabled={loading}
          value={
            <>
              <RefreshCw size={18} />
              Refresh
            </>
          }
        />
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="ml-4 cursor-pointer text-lg hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* ========================================
          SUCCESS
      ======================================== */}

      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}


          {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Active Sessions"
          value={activeSessions}
          icon={<ClipboardList size={22} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Total Tables"
          value={totalTables}
          icon={<Table2 size={22} />}
          iconClass="bg-red-500/10 text-red-400"
          valueClass="text-red-400"
        />

        <StatCard
          title="New Orders"
          value={newOrders}
          icon={<ShoppingCart size={22} />}
          iconClass="bg-orange-500/10 text-orange-400"
          valueClass="text-orange-400"
        />

        <StatCard
          title="Ready Orders"
          value={readyOrders}
          icon={<CheckCircle size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />
      </div>


          {/* READY ORDERS */}
      <div className="rounded-xl border border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Ready Orders</h2>

            <p className="mt-1 text-sm text-gray-500">
              Orders waiting to be served.
            </p>
          </div>

          <NavLink
            to="/waiter/orders"
            className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            View All
            <ArrowRight size={16} />
          </NavLink>
        </div>

        <div className="p-5">
          {readyOrders === 0 ? (
            <div className="py-10 text-center">
              <Utensils size={40} className="mx-auto text-gray-700" />

              <p className="mt-3 text-sm text-gray-500">
                No orders are ready to serve.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders
                .filter(
                  (order) =>
                    order.kitchenStatus === "ready" &&
                    order.waiterStatus !== "served" &&
                    order.status !== "cancelled",
                )
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-800/40 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                        <CheckCircle size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Table {order.session?.table?.tableNumber || "N/A"}
                          {" • "}
                          {order.session?.customerName || "Guest"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleServe(order)}
                      disabled={actionId === order._id}
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle size={16} />

                      {actionId === order._id ? "Processing..." : "Mark Served"}
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>


          {/* RECENT ORDERS */}
      <div className="rounded-xl border border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest customer orders.
            </p>
          </div>

          <NavLink
            to="/waiter/orders"
            className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            View All
            <ArrowRight size={16} />
          </NavLink>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              No orders found.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-4">Order</th>

                  <th className="px-5 py-4">Table</th>

                  <th className="px-5 py-4">Customer</th>

                  <th className="px-5 py-4">Total</th>

                  <th className="px-5 py-4">Kitchen</th>

                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/30"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-300">
                      {order.session?.table?.tableNumber || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-300">
                      {order.session?.customerName || "Guest"}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-green-400">
                      Rs. {order.totalAmount?.toFixed(2) || "0.00"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getKitchenStatusClass(
                          order.kitchenStatus,
                        )}`}
                      >
                        {order.kitchenStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {order.kitchenStatus === "ready" &&
                      order.waiterStatus !== "served" ? (
                        <button
                          onClick={() => handleServe(order)}
                          disabled={actionId === order._id}
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle size={14} />
                          Serve
                        </button>
                      ) : (
                        <span className="text-xs capitalize text-gray-500">
                          {order.waiterStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

          {/* QUICK ACTIONS */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <QuickAction
            to="/waiter/tables"
            icon={<Table2 size={21} />}
            title="Manage Tables"
            description="View and manage restaurant tables."
          />

          <QuickAction
            to="/waiter/sessions"
            icon={<ClipboardList size={21} />}
            title="Manage Sessions"
            description="View active customer sessions."
          />

          <QuickAction
            to="/waiter/orders"
            icon={<ShoppingCart size={21} />}
            title="Manage Orders"
            description="View and serve customer orders."
          />
        </div>
      </div>
    </div>
  );
};

// QUICK ACTION
const QuickAction = ({ to, icon, title, description }) => {
  return (
    <NavLink
      to={to}
      className="group rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="text-gray-700 transition group-hover:translate-x-1 group-hover:text-blue-400"
        />
      </div>

      <h3 className="mt-4 font-semibold text-white">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </NavLink>
  );
};

export default WaiterDashboard;

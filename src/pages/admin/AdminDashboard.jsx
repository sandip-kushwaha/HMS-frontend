import { useEffect, useState } from "react";

import {
  Users,
  Utensils,
  Tags,
  Table2,
  ClipboardList,
  ShoppingCart,
  Clock,
  CheckCircle,
  ChefHat,
  RefreshCw,
  DollarSign,
  FlagTriangleLeft,
} from "lucide-react";

import { getAdminDashboard } from "../../api/dashboard.api";

import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  // FETCH DASHBOARD
  const fetchDashboard = async ( showToast=false ) => {
    try {
      setLoading(true);

      const response = await getAdminDashboard();

      setDashboard(response?.data || null);
       if (showToast) {
      toast.success("Dashboard refreshed successfully");
    }
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);


  const formatDate = (date) => {
     if(!date) return "N/A"

     return new Date(date).toLocaleString();
  }

  // LOADING
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-800" />

          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex justify-between">
                <div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />

                  <div className="mt-3 h-8 w-12 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-xl bg-gray-900" />

          <div className="h-72 animate-pulse rounded-xl bg-gray-900" />
        </div>
      </div>
    );
  }

  const statistics = dashboard?.statistics || {};

  const orders = dashboard?.orders || {};

  const recentOrders = dashboard?.recentOrders || [];

  // UI
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header title="Admin Dashboard" value="Hotel management overview." />

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

      {/* STATISTICS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Users"
          value={statistics.totalUsers || 0}
          icon={<Users size={22} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Food Items"
          value={statistics.totalFoods || 0}
          icon={<Utensils size={22} />}
          iconClass="bg-orange-500/10 text-orange-400"
        />

        <StatCard
          title="Categories"
          value={statistics.totalCategories || 0}
          icon={<Tags size={22} />}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Tables"
          value={statistics.totalTables || 0}
          icon={<Table2 size={22} />}
          iconClass="bg-green-500/10 text-green-400"
        />

        <StatCard
          title="Active Sessions"
          value={statistics.activeSessions || 0}
          icon={<ClipboardList size={22} />}
          iconClass="bg-red-500/10 text-red-400"
          valueClass="text-red-400"
        />
        <StatCard
          title="Today's Revenue"
          value={`Rs. ${(statistics.todayRevenue || 0).toFixed(2)}`}
          icon={<DollarSign size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />
      </div>

      {/* ORDER OVERVIEW + RECENT ORDERS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* ORDER OVERVIEW */}

        <div className="rounded-xl border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <ShoppingCart size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">Orders Overview</h2>

                <p className="text-sm text-gray-500">Current order activity</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5">
            <OrderStatus
              title="Pending"
              value={orders.pending || 0}
              icon={<Clock size={18} />}
            />

            <OrderStatus
              title="Preparing"
              value={orders.preparing || 0}
              icon={<ChefHat size={18} />}
            />

            <OrderStatus
              title="Ready"
              value={orders.ready || 0}
              icon={<CheckCircle size={18} />}
            />

            <OrderStatus
              title="Completed"
              value={orders.completed || 0}
              icon={<CheckCircle size={18} />}
            />
          </div>
        </div>

        {/* RECENT ORDERS */}

        <div className="rounded-xl border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <ShoppingCart size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">Recent Orders</h2>

                <p className="text-sm text-gray-500">Latest customer orders</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No orders found.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Table {order.session?.table?.tableNumber || "N/A"}({" "}
                      {order.session?.customerName || "N/A"} )
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      Date
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-400">
                      Rs. {order.totalAmount?.toFixed(2) || "0.00"}
                    </p>

                    <p className="mt-1 text-xs capitalize text-gray-500">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// STAT CARD
const StatCard = ({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-white",
}) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// ORDER STATUS
const OrderStatus = ({ title, value, icon }) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/40 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400">
          {icon}
        </div>

        <span className="text-sm font-medium text-gray-300">{title}</span>
      </div>

      <span className="text-lg font-bold text-white">{value}</span>
    </div>
  );
};

export default AdminDashboard;

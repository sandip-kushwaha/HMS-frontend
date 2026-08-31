import { useEffect, useMemo, useState } from "react";

import {
  ShoppingCart,
  Clock,
  ChefHat,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  Utensils,
} from "lucide-react";

import { getAllOrders } from "../../api/order.api";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const KitchenDashboard = () => {
  const navigate = useNavigate();

  // STATE
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ORDERS
  const fetchOrders = async (showToast = false) => {
    try {
      setLoading(true);

      const response = await getAllOrders();

      const orderData = response?.data || [];

      setOrders(Array.isArray(orderData) ? orderData : []);

      if (showToast) {
        toast.success("Orders refreshed successfully");
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to fetch kitchen orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // KITCHEN ORDER COUNTS
  const totalOrders = orders.length;

  const pendingOrders = useMemo(() => {
    return orders.filter((order) => order.kitchenStatus === "pending").length;
  }, [orders]);

  const acceptedOrders = useMemo(() => {
    return orders.filter((order) => order.kitchenStatus === "accepted").length;
  }, [orders]);

  const preparingOrders = useMemo(() => {
    return orders.filter((order) => order.kitchenStatus === "preparing").length;
  }, [orders]);

  const readyOrders = useMemo(() => {
    return orders.filter((order) => order.kitchenStatus === "ready").length;
  }, [orders]);

  // RECENT ORDERS
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [orders]);

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }
    return new Date(date).toLocaleString();
  };

  // STATUS CLASS
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

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

  // STATUS ICON
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={15} />;

      case "accepted":
        return <CheckCircle size={15} />;

      case "preparing":
        return <ChefHat size={15} />;

      case "ready":
        return <CheckCircle size={15} />;

      default:
        return <Clock size={15} />;
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-800" />

            <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-800" />
          </div>

          <div className="h-11 w-28 animate-pulse rounded-lg bg-gray-800" />
        </div>

        {/* STAT SKELETON */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-800" />

                  <div className="mt-3 h-8 w-12 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

        {/* RECENT ORDERS */}

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
          title="Kitchen Dashboard"
          value="Monitor and manage kitchen orders."
        />

        <Button
          onClick={() => fetchOrders(true)}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart size={22} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Pending"
          value={pendingOrders}
          icon={<Clock size={22} />}
          iconClass="bg-yellow-500/10 text-yellow-400"
          valueClass="text-yellow-400"
        />

        <StatCard
          title="Preparing"
          value={preparingOrders}
          icon={<ChefHat size={22} />}
          iconClass="bg-orange-500/10 text-orange-400"
          valueClass="text-orange-400"
        />

        <StatCard
          title="Ready"
          value={readyOrders}
          icon={<CheckCircle size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />
      </div>


          {/* KITCHEN WORKFLOW */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Kitchen Workflow
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current order progress.
            </p>
          </div>

          <Utensils size={22} className="text-gray-600" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <WorkflowCard
            title="Pending"
            value={pendingOrders}
            icon={<Clock size={20} />}
            className="border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
          />

          <WorkflowCard
            title="Accepted"
            value={acceptedOrders}
            icon={<CheckCircle size={20} />}
            className="border-blue-500/20 bg-blue-500/5 text-blue-400"
          />

          <WorkflowCard
            title="Preparing"
            value={preparingOrders}
            icon={<ChefHat size={20} />}
            className="border-orange-500/20 bg-orange-500/5 text-orange-400"
          />

          <WorkflowCard
            title="Ready"
            value={readyOrders}
            icon={<CheckCircle size={20} />}
            className="border-green-500/20 bg-green-500/5 text-green-400"
          />
        </div>
      </div>


          {/* RECENT ORDERS */}
      <div className="rounded-xl border border-gray-800 bg-gray-900">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>

            <p className="mt-1 text-sm text-gray-500">Latest kitchen orders.</p>
          </div>

          <button
            onClick={() => navigate("/kitchen/orders")}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        {/* ORDERS */}
        {recentOrders.length === 0 ? (
          <div className="py-14 text-center">
            <ShoppingCart size={42} className="mx-auto text-gray-700" />

            <h3 className="mt-4 font-medium text-gray-300">No orders found</h3>

            <p className="mt-1 text-sm text-gray-500">
              There are no kitchen orders yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-4 p-5 transition hover:bg-gray-800/30 md:flex-row md:items-center md:justify-between"
              >
                {/* ORDER */}
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-400">
                    <ShoppingCart size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Table {order.session?.table?.tableNumber || "N/A"}
                    </p>
                  </div>
                </div>

                {/* CUSTOMER */}
                <div className="hidden min-w-32.5 md:block">
                  <p className="text-xs text-gray-500">Customer</p>

                  <p className="mt-1 truncate text-sm font-medium text-gray-300">
                    {order.session?.customerName || "Guest"}
                  </p>
                </div>

                {/* ITEMS */}
                <div className="hidden min-w-25 md:block">
                  <p className="text-xs text-gray-500">Items</p>

                  <p className="mt-1 text-sm font-medium text-gray-300">
                    {order.items?.length || 0}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <span
                    className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                      order.kitchenStatus,
                    )}`}
                  >
                    {getStatusIcon(order.kitchenStatus)}

                    {order.kitchenStatus}
                  </span>
                </div>

                {/* DATE */}
                <div className="hidden text-right lg:block">
                  <p className="text-xs text-gray-500">Ordered</p>

                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


          {/* FOOTER */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {recentOrders.length} recent orders</span>

        <button
          onClick={() => navigate("/kitchen/orders")}
          className="flex cursor-pointer items-center gap-2 font-medium text-blue-400 hover:text-blue-300"
        >
          Manage Orders
          <ArrowRight size={15} />
        </button>
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

// WORKFLOW CARD
const WorkflowCard = ({ title, value, icon, className }) => {
  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>

        {icon}
      </div>
    </div>
  );
};

export default KitchenDashboard;

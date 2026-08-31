import { useEffect, useMemo, useState } from "react";
import OrderCard from "../../components/order/OrderCard";
import OrderDetailsModal from "../../components/order/OrderDetailsModal";

import {
  Search,
  ShoppingCart,
  RefreshCw,
  CheckCircle,
  Clock,
  ChefHat,
  Utensils,
  XCircle,
} from "lucide-react";

import {
  getAllOrders,
  updateKitchenStatus,
  updateWaiterStatus,
} from "../../api/order.api";

import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import { toast } from "react-toastify";

const Orders = () => {
  const { user } = useAuth();

  // ORDER DATA
  const [orders, setOrders] = useState([]);

  // LOADING / ERROR
  const [loading, setLoading] = useState(true);

  // SEARCH / FILTER
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kitchenFilter, setKitchenFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [actionId, setActionId] = useState(null);

  // FETCH ORDERS
  const fetchOrders = async ( showToast = false ) => {
    try {
      setLoading(true);

      const response = await getAllOrders();

      const orderData = response?.data || [];
      console.log(orderData)

      setOrders(Array.isArray(orderData) ? orderData : []);

       if (showToast) {
      toast.success("Orders refreshed successfully");
    }

    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchOrders();
  }, []);

  // FILTER ORDERS
  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderNumber = order.orderNumber?.toLowerCase() || "";

      const tableNumber =
        order.session?.table?.tableNumber?.toLowerCase() || "";

      const customerName = order.session?.customerName?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        orderNumber.includes(searchText) ||
        tableNumber.includes(searchText) ||
        customerName.includes(searchText);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesKitchen =
        kitchenFilter === "all" || order.kitchenStatus === kitchenFilter;

      return matchesSearch && matchesStatus && matchesKitchen;
    });
  }, [orders, search, statusFilter, kitchenFilter]);

  //Kitchen Status
  const handleKitchenStatus = async (order, kitchenStatus) => {
    try {
      setActionId(order._id);

      const response = await updateKitchenStatus(order._id, kitchenStatus);

      const updatedOrder = response?.data;

      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? {
                ...item,
                ...updatedOrder,
                kitchenStatus: updatedOrder?.kitchenStatus || kitchenStatus,
              }
            : item,
        ),
      );

      toast.success(`Order ${order.orderNumber} updated to ${kitchenStatus}.`);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to update kitchen status.",
      );
    } finally {
      setActionId(null);
    }
  };

  //Waiter Status
  const handleWaiterStatus = async (order, waiterStatus) => {
    try {
      setActionId(order._id);

      const response = await updateWaiterStatus(order._id, waiterStatus);

      const updatedOrder = response?.data;

      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? {
                ...item,
                ...updatedOrder,
                waiterStatus: updatedOrder.waiterStatus || waiterStatus,
              }
            : item,
        ),
      );

      toast.success(`Order ${order.orderNumber} updated to ${waiterStatus}.`);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to update waiter status.",
      );
    } finally {
      setActionId(null);
    }
  };

  // STATISTICS
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "preparing",
  ).length;

  const readyOrders = orders.filter((order) => order.status === "ready").length;

  const compltedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
  };

  // ORDER STATUS CLASS
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";

      case "confirmed":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";

      case "preparing":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";

      case "ready":
        return "bg-green-500/10 text-green-400 border border-green-500/20";

      case "served":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";

      case "completed":
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  // ORDER STATUS ICON
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={15} />;

      case "confirmed":
        return <CheckCircle size={15} />;

      case "preparing":
        return <ChefHat size={15} />;

      case "ready":
        return <CheckCircle size={15} />;

      case "served":
        return <Utensils size={15} />;

      case "completed":
        return <CheckCircle size={15} />;

      case "cancelled":
        return <XCircle size={15} />;

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

        {/* STATISTICS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />
                  <div className="mt-3 h-8 w-12 animate-pulse rounded bg-gray-800" />
                </div>
                <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

        {/* FILTER */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="h-11 animate-pulse rounded-lg bg-gray-800" />
            <div className="h-11 animate-pulse rounded-lg bg-gray-800" />
            <div className="h-11 animate-pulse rounded-lg bg-gray-800" />
          </div>
        </div>

        {/* CARDS */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex h-30 justify-between">
                <div>
                  <div className="h-6 w-28 animate-pulse rounded bg-gray-800" />

                  <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-800" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="h-4 animate-pulse rounded bg-gray-800" />
                <div className="h-4 animate-pulse rounded bg-gray-800" />
                <div className="h-4 animate-pulse rounded bg-gray-800" />
                <div className="h-4 animate-pulse rounded bg-gray-800" />

                <div className="h-20 animate-pulse rounded-lg bg-gray-800" />

                <div className="h-10 animate-pulse rounded-lg bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // UI
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header title="Order Management" value="Manage restaurant orders." />

        <Button
          onClick={fetchOrders}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

        <StatCard
          title="Completed"
          value={compltedOrders}
          icon={<CheckCircle size={22} />}
          iconClass="bg-purple-500/10 text-purple-400"
          valueClass="text-purple-400"
        />
      </div>

      {/* SEARCH + FILTER */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, table or customer..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* ORDER STATUS */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Order Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* {KITCHEN STATUS} */}
          <select
            value={kitchenFilter}
            onChange={(e) => setKitchenFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm capitalize text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Kitchen Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
          </select>
        </div>

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            formatDate={formatDate}
            getStatusClass={getStatusClass}
            getStatusIcon={getStatusIcon}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>

      {/* ORDER CARDS */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 py-16 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-700" />

          <h3 className="mt-4 text-lg font-semibold text-gray-300">
            No orders found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            There are currently no orders matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              getStatusClass={getStatusClass}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
              user={user}
              actionId={actionId}
              handleKitchenStatus={handleKitchenStatus}
              handleWaiterStatus={handleWaiterStatus}
              onViewDetails={setSelectedOrder}
            />
          ))}
        </div>
      )}

      {/* RESULT COUNT */}
      <div className="text-base text-gray-800">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {filteredOrders.length}
        </span>{" "}
        of <span className="font-medium text-gray-900">{orders.length}</span>{" "}
        orders
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

export default Orders;

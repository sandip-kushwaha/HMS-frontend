import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  CheckCircle2,
  ChefHat,
  CircleAlert,
  LoaderCircle,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Utensils,
} from "lucide-react";

import { getMyOrder } from "../../api/order.api";
import { useSession } from "../../context/SessionContext";

const MyOrders = () => {
  const { sessionToken, customerName, table } = useSession();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!sessionToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getMyOrder(sessionToken);

        // console.log("My orders response:", response);

        setOrders(response?.data || []);
      } catch (error) {
        console.error("Fetch my orders error:", error);

        setError(
          error?.response?.data?.message || "Failed to load your orders.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sessionToken]);

  const formatPrice = (price) => {
    return `Rs. ${Number(price || 0).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleString("en-NP", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          icon: Clock3,
          className: "bg-yellow-100 text-yellow-700 ",
        };

      case "confirmed":
        return {
          label: "Confirmed",
          icon: CheckCircle2,
          className: "bg-blue-100 text-blue-700 ",
        };

      case "preparing":
        return {
          label: "Preparing",
          icon: ChefHat,
          className: "bg-orange-100 text-orange-700 ",
        };

      case "ready":
        return {
          label: "Ready",
          icon: PackageCheck,
          className: "bg-green-100 text-green-700 ",
        };

      case "served":
        return {
          label: "Served",
          icon: Utensils,
          className: "bg-purple-100 text-purple-700 ",
        };

      case "completed":
        return {
          label: "Completed",
          icon: CheckCircle2,
          className: "bg-green-100 text-green-700 ",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          icon: CircleAlert,
          className: "bg-red-100 text-red-700 ",
        };

      default:
        return {
          label: status || "Unknown",
          icon: Clock3,
          className: "bg-gray-100 text-gray-700 ",
        };
    }
  };

  /* No session */
  if (!sessionToken) {
    return (
      <div>
        <main className=" mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center ">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 ">
              <ShoppingBag size={36} className="text-blue-500" />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
              No Active Table Session
            </h1>

            <p className="mt-2 text-sm text-gray-500 ">
              Please scan the QR code on your table to start ordering.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              <ArrowLeft size={18} />
              Go Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 ">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4">
          <Link
            to="/menu"
            className=" inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-blue-500"
          >
            <ArrowLeft size={18} />
            Back to Menu
          </Link>

          <div className="mt-5">
            <h1 className="text-3xl font-extrabold sm:text-4xl">My Orders</h1>

            <p className="mt-2 text-sm text-gray-500 ">
              Track your food orders from your current table session.
            </p>
          </div>
        </div>

        {/* Customer / Table Info */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 ">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 ">
              Customer
            </p>

            <p className="mt-1 text-lg font-bold">{customerName || "Guest"}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 ">
            <div className="flex items-center gap-2">
              <MapPin size={17} className="text-blue-500" />

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                Table
              </p>
            </div>

            <p className="mt-1 text-lg font-bold">
              {table?.tableNumber || table?.name || "Table"}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-75 items-center justify-center">
            <div className="flex items-center gap-3 text-blue-500">
              <LoaderCircle size={25} className="animate-spin" />
              <span className="font-semibold">Loading your orders...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 ">
            <div className="flex items-start gap-3 text-red-600 ">
              <CircleAlert size={22} className="mt-0.5 shrink-0" />

              <div>
                <h2 className="font-bold">Unable to load orders</h2>

                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center ">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 ">
              <ShoppingBag size={36} className="text-blue-500" />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold">No Orders Yet</h2>

            <p className="mt-2 text-sm text-gray-500 ">
              You haven't placed any food orders yet.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              <Utensils size={18} />
              Browse Menu
            </Link>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);

              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white "
                >
                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between ">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                        Order Number
                      </p>

                      <h2 className="mt-1 text-lg font-extrabold">
                        #{order.orderNumber || order._id}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500 ">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div
                      className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${statusInfo.className}`}
                    >
                      <StatusIcon size={17} />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-gray-200 ">
                    {(order.items || []).map((item) => (
                      <div
                        key={item._id || item.food?._id}
                        className="flex gap-4 px-5 py-3"
                      >
                        {/* Food Image */}
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 ">
                          {item.food?.image ? (
                            <img
                              src={item.food.image}
                              alt={item.food.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Utensils size={25} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Food Details */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold">
                            {item.food?.name || "Food Item"}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500 ">
                            {formatPrice(item.price || item.food?.price)} ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        {/* Item Total */}
                        <div className="shrink-0 text-right">
                          <p className="font-bold text-blue-500">
                            {formatPrice(
                              (item.price || item.food?.price || 0) *
                                item.quantity,
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 bg-gray-50 p-5 ">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 ">Total</p>

                        <p className="text-xl font-extrabold text-blue-500">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500 ">Table</p>

                        <p className="font-bold">
                          {order.session?.table?.tableNumber ||
                            table?.tableNumber ||
                            "Table"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;

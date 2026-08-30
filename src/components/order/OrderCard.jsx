import { CheckCircle, ChefHat } from "lucide-react";

const OrderCard = ({
  order,
  getStatusClass,
  getStatusIcon,
  formatDate,
  user,
  actionId,
  handleKitchenStatus,
  handleWaiterStatus,
  onViewDetails,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-sm transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-lg">
      {/* ========================================
          CARD HEADER
      ======================================== */}

      <div className="border-b border-gray-800 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white">
              {order.orderNumber}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {order.session?.table?.tableNumber || "Unknown Table"}
            </p>
          </div>

          {/* ORDER STATUS */}

          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
              order.status,
            )}`}
          >
            {getStatusIcon(order.status)}

            {order.status}
          </span>
        </div>
      </div>

      {/* ========================================
          CARD BODY
      ======================================== */}

      <div className="space-y-4 p-5">
        {/* CUSTOMER */}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Customer</span>

          <span className="font-medium text-gray-200">
            {order.session?.customerName || "Guest"}
          </span>
        </div>

        {/* TABLE */}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Table</span>

          <span className="font-medium text-gray-200">
            {order.session?.table?.tableNumber || "N/A"}
          </span>
        </div>

        {/* TOTAL */}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total Amount</span>

          <span className="font-semibold text-green-400">
            Rs. {order.totalAmount?.toFixed(2) || "0.00"}
          </span>
        </div>

        {/* ORDER DATE */}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Ordered</span>

          <span className="text-sm text-gray-300">
            {formatDate(order.createdAt)}
          </span>
        </div>


            {/* KITCHEN STATUS */}
        <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Kitchen Status</span>

            <span className="text-sm font-medium capitalize text-gray-200">
              {order.kitchenStatus}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Waiter Status</span>

            <span className="text-sm font-medium capitalize text-gray-200">
              {order.waiterStatus}
            </span>
          </div>
        </div>


            {/* ORDER ITEMS */}
        {order.items?.length > 0 && (
          <div className="border-t border-gray-800 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Order Items
            </p>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-200">
                      {item.food?.name || "Unknown Food"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-medium text-gray-300">
                    Rs.{" "}
                    {(
                      (item.price || item.food?.price || 0) * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
          {/* ADMIN ACTIONS */}
        {user?.role === "admin" && (
        <button
          onClick={() => onViewDetails(order)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
        >
          View Details
        </button>
        )}

        
            {/* KITCHEN ACTIONS */}
        {user?.role === "kitchen" && (
          <div className="border-t border-gray-800 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Kitchen Actions
            </p>

            <div className="grid gap-3">
              {/* ACCEPT */}
              {order.kitchenStatus === "pending" && (
                <button
                  onClick={() => handleKitchenStatus(order, "accepted")}
                  disabled={actionId === order._id}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  {actionId === order._id ? "Processing..." : "Accept"}
                </button>
              )}

              {/* PREPARING */}
              {order.kitchenStatus === "accepted" && (
                <button
                  onClick={() => handleKitchenStatus(order, "preparing")}
                  disabled={actionId === order._id}
                  className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChefHat size={16} />

                  {actionId === order._id ? "Processing..." : "Start Preparing"}
                </button>
              )}

              {/* READY */}
              {order.kitchenStatus === "preparing" && (
                <button
                  onClick={() => handleKitchenStatus(order, "ready")}
                  disabled={actionId === order._id}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle size={16} />

                  {actionId === order._id ? "Processing..." : "Mark Ready"}
                </button>
              )}

              {/* READY MESSAGE */}
              {order.kitchenStatus === "ready" && (
                <div className="col-span-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm font-medium text-green-400">
                  Order is ready for waiter
                </div>
              )}
            </div>
          </div>
        )}


        {/* WAITER ACTIONS */}
        {user?.role === "waiter" && (
          <div className="border-t border-gray-800 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Waiter Actions
            </p>

            <div className="grid gap-3">

             {/* WAITING */}
              {order.kitchenStatus !== "ready" &&
                order.waiterStatus == "new" && (
                  <div className="rounded-lg border border-gray-800 bg-gray-800/50 px-4 py-3 text-center">
                    <p className="text-sm font-medium text-gray-400">
                      Waiting for kitchen
                    </p>

                    <p className="mt-1 text-xs capitalize text-gray-600">
                      Kitchen: {order.kitchenStatus}
                    </p>
                  </div>
                )}

              {/* ACCEPT */}
              {order.kitchenStatus === "ready" &&
                order.waiterStatus === "new" && (
                  <button
                    onClick={() => handleWaiterStatus(order, "accepted")}
                    disabled={actionId === order._id}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle size={16} />

                    {actionId === order._id ? "Processing..." : "Accept"}
                  </button>
                )}

              {/* SERVE */}
              {order.waiterStatus === "accepted" && (
                <button
                  onClick={() => handleWaiterStatus(order, "served")}
                  disabled={actionId === order._id}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle size={16} />

                  {actionId === order._id ? "Processing..." : "Mark Served"}
                </button>
              )}

              {/* SERVED */}
              {order.waiterStatus === "served" && (
                <div className="col-span-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm font-medium text-green-400">
                  Order has been served
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDER CANCELLED MESSAGE */}
          {order.status === "cancelled" && (
                <div className="col-span-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-400">
                  Order is cancelled
                </div>
              )}
      </div>
    </div>
  );
};


export default OrderCard;

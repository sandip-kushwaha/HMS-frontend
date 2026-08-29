import { Slash, Tally1, Users } from "lucide-react";
import Button from "../common/Button";

const OrderDetailsModal = ({
  order,
  formatDate,
  getStatusClass,
  getStatusIcon,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 ">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl scrollbar-thin overflow-auto">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h2 className="text-xl font-bold text-white">Order Details</h2>

            <p className="mt-1 text-sm text-gray-500">{order.orderNumber}</p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer
                       text-gray-400 hover:text-white hover:bg-gray-800
                       transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-5 p-5">
          {/* ORDER STATUS */}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Order Status</span>

            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                order.status,
              )}`}
            >
              {getStatusIcon(order.status)}
              {order.status}
            </span>
          </div>

          {/* TABLE */}

          <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-4">
            <p className="mb-3 text-xs uppercase tracking-wide text-gray-500">
              Table Information
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Table</p>
                <p className="mt-1 font-medium text-white">
                  {order.session?.table?.tableNumber || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="mt-1 capitalize text-gray-200">
                  {order.session?.table?.location || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Capacity</p>
                <p className="mt-1 capitalize text-gray-200">
                  {order.session?.table?.capacity || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* CUSTOMER */}

          <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-4">
            <p className="mb-3 text-xs uppercase tracking-wide text-gray-500">
              Customer
            </p>

            <div className="flex items-center gap-3">
              <Users size={20} className="text-blue-400" />

              <div>
                <p className="font-medium text-white">
                  {order.session?.customerName || "Guest"}
                </p>

                <p className="text-xs text-gray-500">Customer Session</p>
              </div>
            </div>
          </div>

          {/* ORDER ITEMS */}

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Order Items
            </p>

            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/40 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-200">
                      {item.food?.name || "Unknown Food"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium text-gray-300">
                    Rs.{" "}
                    {(
                      (item.price || item.food?.price || 0) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* KITCHEN STATUS */}

          <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/40 p-4">
            <span className="text-sm text-gray-500">Kitchen Status</span>

            <span className="font-medium capitalize text-gray-200">
              {order.kitchenStatus};
            </span>
            <Tally1 className="text-gray-400"/>
            <span className="text-sm text-gray-500">Waiter Status</span>
            <span className="font-medium capitalize text-gray-200">
              {order.waiterStatus}
            </span>
          </div>

          {/* TOTAL */}

          <div className="flex items-center justify-between border-t border-gray-800 pt-4">
            <span className="text-base font-medium text-gray-400">
              Total Amount
            </span>

            <span className="text-xl font-bold text-green-400">
              Rs. {order.totalAmount?.toFixed(2) || "0.00"}
            </span>
          </div>

          {/* DATE */}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Ordered At</span>

            <span className="text-sm text-gray-300">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg cursor-pointer bg-gray-700 px-6 py-2.5 text-sm font-medium transition hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

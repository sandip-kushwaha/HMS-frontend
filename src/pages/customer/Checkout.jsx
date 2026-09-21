import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { useState } from "react";

import { createOrder } from "../../api/order.api";
import { useCart } from "../../context/CartContext";
import { useSession } from "../../context/SessionContext";

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, totalItems, totalAmount, clearCart } = useCart();

  const { sessionToken, customerName, table } = useSession();

  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return `Rs. ${Number(price || 0).toLocaleString()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check session
    if (!sessionToken) {
      alert(
        "Your table session is not available. Please scan the table QR code again.",
      );

      navigate("/");
      return;
    }

    // Check customer name
    if (!customerName?.trim()) {
      alert("Customer name is missing.");
      return;
    }

    // Check cart
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/menu");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cartItems.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),

        totalAmount,
      };

      console.log("Order data:", orderData);

      const response = await createOrder(orderData, sessionToken);

      console.log("Order created:", response);

      // Clear cart after successful order
      clearCart();

      // Go to My Orders
      navigate("/orders");
    } catch (error) {
      console.error("Create order error:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to place order. Please try again.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div>
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center ">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 ">
              <ShoppingBag size={36} className="text-blue-500" />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="mt-2 text-sm text-gray-500 ">
              Add some food items before proceeding to checkout.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Browse Menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>

          <div className="mt-5">
            <h1 className="text-3xl font-extrabold sm:text-4xl text-gray-900">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-gray-500 ">
              Review your order before placing it.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* LEFT SIDE */}
            <div className="space-y-4 lg:col-span-2">
              {/* Customer & Table Information */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 ">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 ">
                    <ClipboardList size={20} className="text-blue-500" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">Order Information</h2>

                    <p className="text-sm text-gray-500 ">
                      Your order will be placed for the current table session.
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {/* Customer */}
                  <div className="rounded-xl bg-gray-50 p-4 ">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                      Customer
                    </p>

                    <p className="mt-2 font-bold text-gray-900">
                      {customerName || "Guest"}
                    </p>
                  </div>

                  {/* Table */}
                  <div className="rounded-xl bg-gray-50 p-4 ">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500" />

                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                        Table
                      </p>
                    </div>

                    <p className="mt-2 font-bold text-gray-900">
                      {table?.tableNumber || table?.name || "Table"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Order Items */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 ">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Your Order
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 ">
                      {totalItems} item
                      {totalItems !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-3 divide-y divide-gray-200 ">
                  {cartItems.map((item) => (
                    <div
                      key={item.foodId}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      {/* Image */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-200 ">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-gray-800">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 ">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <p className="font-bold text-blue-500">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 ">
                <h2 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-2 space-y-2">
                  {/* Items */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 ">Items</span>

                    <span className="font-semibold text-gray-800">
                      {totalItems}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 ">Subtotal</span>

                    <span className="font-semibold text-gray-800">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-2 ">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total</span>

                      <span className="text-xl font-extrabold text-blue-500">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  disabled={loading || !sessionToken}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle size={19} />

                  {loading ? "Placing Order..." : "Place Order"}
                </button>

                {!sessionToken && (
                  <p className="mt-2 text-center text-xs font-medium text-red-500">
                    Table session is not available.
                  </p>
                )}

                <Link
                  to="/cart"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-300 px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-500 "
                >
                  Edit Cart
                </Link>

                <p className="mt-3 text-center text-xs leading-5 text-gray-500 ">
                  Your order will be sent directly to the hotel kitchen after
                  confirmation.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;

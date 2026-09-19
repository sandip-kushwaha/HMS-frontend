import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { useState } from "react";

import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";

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
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
        <CustomerNavbar />

        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10">
              <ShoppingBag size={36} className="text-blue-500" />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold">Your Cart is Empty</h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
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

        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <CustomerNavbar />

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
            <h1 className="text-3xl font-extrabold sm:text-4xl">Checkout</h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Review your order before placing it.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* LEFT SIDE */}
            <div className="space-y-6 lg:col-span-2">
              {/* Customer & Table Information */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
                    <ClipboardList size={20} className="text-blue-500" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">Order Information</h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your order will be placed for the current table session.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {/* Customer */}
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Customer
                    </p>

                    <p className="mt-2 font-bold">{customerName || "Guest"}</p>
                  </div>

                  {/* Table */}
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500" />

                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Table
                      </p>
                    </div>

                    <p className="mt-2 font-bold">
                      {table?.tableNumber || table?.name || "Table"}
                    </p>
                  </div>
                </div>

                {/* Session status */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/20">
                  <CheckCircle size={20} className="shrink-0 text-green-500" />

                  <div>
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">
                      Table Session Active
                    </p>

                    <p className="mt-1 text-xs text-green-600 dark:text-green-500">
                      Your order will automatically be linked to this table.
                    </p>
                  </div>
                </div>
              </section>

              {/* Order Items */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Your Order</h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {totalItems} item
                      {totalItems !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-800">
                  {cartItems.map((item) => (
                    <div
                      key={item.foodId}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      {/* Image */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold">{item.name}</h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="mt-6 space-y-4">
                  {/* Items */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Items
                    </span>

                    <span className="font-semibold">{totalItems}</span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
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
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle size={19} />

                  {loading ? "Placing Order..." : "Place Order"}
                </button>

                {!sessionToken && (
                  <p className="mt-3 text-center text-xs font-medium text-red-500">
                    Table session is not available.
                  </p>
                )}

                <Link
                  to="/cart"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-500 dark:border-gray-700 dark:text-gray-300"
                >
                  Edit Cart
                </Link>

                <p className="mt-4 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Your order will be sent directly to the hotel kitchen after
                  confirmation.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <CustomerFooter />
    </div>
  );
};

export default Checkout;

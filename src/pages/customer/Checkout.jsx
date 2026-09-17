import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";

import { createOrder } from "../../api/order.api";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, totalItems, totalAmount, clearCart, } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [loading, setLoading] = useState(false);


  const formatPrice = (price) => {
    return `Rs. ${Number(price || 0).toLocaleString()}`;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!customerName.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!sessionToken.trim()) {
    alert("Session token is required.");
    return;
  }

  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    navigate("/menu");
    return;
  }

  try {
    setLoading(true);

    const orderData = {
      customerName: customerName.trim(),
      items: cartItems.map((item) => ({
        food: item.foodId,
        quantity: item.quantity,
      })),
      totalAmount,
    };

    const response = await createOrder(orderData);

    console.log("Order created:", response);

    clearCart();

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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
        <CustomerNavbar />

        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10">
              <ShoppingBag size={36} className="text-blue-500" />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold">
              Your Cart is Empty
            </h1>

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
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Checkout
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Confirm your details and review your order.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-6 lg:col-span-2">
              {/* Customer Information */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
                    <ClipboardList
                      size={20}
                      className="text-blue-500"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Customer Information
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enter the information required for your order.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {/* Customer Name */}
                  <div>
                    <label
                      htmlFor="customerName"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Customer Name
                    </label>

                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950"
                    />
                  </div>

                  {/* Session Token */}
                  <div>
                    <label
                      htmlFor="sessionToken"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Session Token
                    </label>

                    <input
                      id="sessionToken"
                      type="text"
                      value={sessionToken}
                      onChange={(e) =>
                        setSessionToken(e.target.value)
                      }
                      placeholder="Enter or scan your session token"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950"
                    />

                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Your session token connects this order to the
                      correct table session.
                    </p>
                  </div>
                </div>
              </section>

              {/* Order Items */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-xl font-bold">
                  Your Order
                </h2>

                <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-800">
                  {cartItems.map((item) => (
                    <div
                      key={item.foodId}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
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

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {formatPrice(item.price)} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-bold text-blue-500">
                          {formatPrice(
                            item.price * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right - Summary */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-xl font-bold">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Items
                    </span>

                    <span className="font-semibold">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        Total
                      </span>

                      <span className="text-xl font-extrabold text-blue-500">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle size={19} />

                  {loading
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                  By placing this order, your selected food
                  items will be sent to the hotel kitchen.
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
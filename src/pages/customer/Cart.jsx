import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { useCart } from "../../context/CartContext";


const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount,
  } = useCart();

  const formatPrice = (price) => {
    return `Rs. ${Number(price || 0).toLocaleString()}`;
  };

  return (
    <div>

      <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl text-gray-900">Your Cart</h1>

              <p className="mt-2 text-sm text-gray-500 ">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
              </p>
            </div>

            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-2 rounded-xl cursor-pointer border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 "
              >
                <Trash2 size={17} />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-center ">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 ">
              <ShoppingCart size={36} className="text-blue-500" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">Your Cart is Empty</h2>

            <p className="mt-2 max-w-md text-sm text-gray-500 ">
              You haven't added any food items yet. Explore our menu and choose
              your favorite food.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.foodId}
                  className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 "
                >
                  {/* Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28">
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
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 ">
                          {formatPrice(item.price)} each
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.foodId)}
                        className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer "
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      {/* Quantity */}
                      <div className="flex items-center rounded-xl border border-gray-200 ">
                        {item.quantity <= 1 ? (
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.foodId)}
                            disabled
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:text-gray-500  cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.foodId)}
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:text-blue-500 cursor-pointer "
                          >
                            <Minus size={16} />
                          </button>
                        )}

                        <span className="w-9 text-center text-sm font-bold text-gray-800 ">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.foodId)}
                          className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:text-blue-500 cursor-pointer "
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="font-bold text-blue-500">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 ">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 ">
                      Items
                    </span>

                    <span className="font-semibold text-gray-800">{totalItems}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 ">
                      Subtotal
                    </span>

                    <span className="font-semibold text-gray-800">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 ">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total</span>

                      <span className="text-xl font-extrabold text-blue-500">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-500 px-5 py-3.5 font-bold text-white transition hover:bg-blue-600"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/menu"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-300 px-5 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-blue-400 hover:text-blue-500 "
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};

export default Cart;
